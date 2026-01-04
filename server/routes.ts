import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertEventSchema,
  insertAttendeeSchema,
  insertReviewSchema,
} from "@shared/schema";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import {
  getRazorpayKeyId,
  createOrder,
  verifyPaymentSignature,
  fetchOrder,
  fetchPayment,
} from "./razorpayClient";
import { registerUserPreferencesRoutes } from "./routes/user_preferences_routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication first
  await setupAuth(app);

  registerAuthRoutes(app);

  registerUserPreferencesRoutes(app);

  // Get all events with optional filters
  app.get("/api/events", async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string | undefined,
        searchQuery: req.query.q as string | undefined,
        minPrice: req.query.minPrice
          ? parseInt(req.query.minPrice as string)
          : undefined,
        maxPrice: req.query.maxPrice
          ? parseInt(req.query.maxPrice as string)
          : undefined,
      };
      const events = await storage.getEvents(filters);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // Get single event by ID
  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  // Create new event
  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Invalid event data", details: error.errors });
      }
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  // Update event
  app.patch("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  // Delete event
  app.delete("/api/events/:id", async (req, res) => {
    try {
      const success = await storage.deleteEvent(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Join event (for free events)
  app.post("/api/events/:id/join", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      if (event.currentAttendees! >= event.maxCapacity) {
        return res.status(400).json({ error: "Event is full" });
      }

      if (!req.body.userName) {
        return res.status(400).json({ error: "User name is required" });
      }

      const attendeeData = {
        eventId: req.params.id,
        userId: req.body.userId || `user-${Date.now()}`,
        userName: req.body.userName,
        userPhone: req.body.userPhone || "",
        paymentStatus: req.body.paymentStatus || "completed",
        joinedAt: req.body.joinedAt || new Date().toISOString(),
      };

      const attendee = await storage.addAttendee(attendeeData);
      res.status(201).json(attendee);
    } catch (error) {
      console.error("Error joining event:", error);
      res.status(500).json({ error: "Failed to join event" });
    }
  });

  // Get event attendees
  app.get("/api/events/:id/attendees", async (req, res) => {
    try {
      const attendees = await storage.getEventAttendees(req.params.id);
      res.json(attendees);
    } catch (error) {
      console.error("Error fetching attendees:", error);
      res.status(500).json({ error: "Failed to fetch attendees" });
    }
  });

  // Leave event
  app.delete("/api/events/:id/leave", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }

      const success = await storage.removeAttendee(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ error: "Attendee not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error leaving event:", error);
      res.status(500).json({ error: "Failed to leave event" });
    }
  });

  // Get event reviews
  app.get("/api/events/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getEventReviews(req.params.id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Add review
  app.post("/api/events/:id/reviews", async (req, res) => {
    try {
      if (!req.body.userName) {
        return res.status(400).json({ error: "User name is required" });
      }
      if (!req.body.rating || req.body.rating < 1 || req.body.rating > 5) {
        return res
          .status(400)
          .json({ error: "Rating must be between 1 and 5" });
      }

      const reviewData = {
        eventId: req.params.id,
        userId: req.body.userId || `user-${Date.now()}`,
        userName: req.body.userName,
        userAvatar: req.body.userAvatar || "",
        rating: req.body.rating,
        comment: req.body.comment || "",
        createdAt: req.body.createdAt || new Date().toISOString(),
      };

      const review = await storage.addReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ error: "Failed to add review" });
    }
  });

  // Get organizer dashboard stats
  app.get("/api/organizer/dashboard", async (req, res) => {
    try {
      const organizerId = req.query.organizerId as string;
      if (!organizerId) {
        // Return empty stats if no organizerId provided (backward compatible)
        return res.json({
          totalRevenue: 0,
          totalEvents: 0,
          totalAttendees: 0,
          averageRating: 0,
        });
      }
      const stats = await storage.getDashboardStats(organizerId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Get attendees for organizer's events
  app.get("/api/organizer/attendees", async (req, res) => {
    try {
      const organizerId = req.query.organizerId as string;
      if (!organizerId) {
        // Return empty array if no organizerId provided (backward compatible)
        return res.json([]);
      }
      const attendees = await storage.getOrganizerAttendees(organizerId);
      res.json(attendees);
    } catch (error) {
      console.error("Error fetching organizer attendees:", error);
      res.status(500).json({ error: "Failed to fetch attendees" });
    }
  });

  // Get categories
  app.get("/api/categories", async (req, res) => {
    const { categories } = await import("@shared/utils/constants");
    res.json(categories);
  });

  // Get Razorpay config (key ID for frontend)
  app.get("/api/razorpay/config", async (req, res) => {
    try {
      const keyId = getRazorpayKeyId();
      res.json({ keyId });
    } catch (error) {
      console.error("Error getting Razorpay config:", error);
      res.status(500).json({
        error:
          "Payment system not configured. Please add Razorpay credentials.",
      });
    }
  });

  // Create Razorpay order for event booking
  app.post("/api/events/:id/create-order", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      if (event.currentAttendees! >= event.maxCapacity) {
        return res.status(400).json({ error: "Event is full" });
      }

      const { userName, userPhone, userEmail } = req.body;
      if (!userName || !userEmail) {
        return res.status(400).json({ error: "Name and email are required" });
      }

      // Create Razorpay order
      const order = await createOrder({
        amount: event.price ?? 0,
        currency: "INR",
        receipt: `event_${event.id}_${Date.now()}`,
        notes: {
          eventId: event.id,
          eventTitle: event.title,
          userName,
          userEmail,
          userPhone: userPhone || "",
        },
      });

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: getRazorpayKeyId(),
        eventTitle: event.title,
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone || "",
        },
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create payment order" });
    }
  });

  // Verify Razorpay payment and register attendee
  app.post("/api/events/:id/verify-payment", async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        userName,
        userEmail,
        userPhone,
      } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res
          .status(400)
          .json({ error: "Payment verification data required" });
      }

      // Verify the payment signature (HMAC)
      const isValid = verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        return res.status(400).json({ error: "Invalid payment signature" });
      }

      // Fetch order from Razorpay to verify it belongs to this event
      const order = await fetchOrder(razorpay_order_id);
      const orderNotes = order.notes as Record<string, string> | undefined;

      if (!orderNotes || orderNotes.eventId !== req.params.id) {
        return res
          .status(403)
          .json({ error: "Payment order does not match this event" });
      }

      // Verify payment status
      const payment = await fetchPayment(razorpay_payment_id);
      if (payment.status !== "captured") {
        return res.status(400).json({ error: "Payment not captured" });
      }

      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Verify payment amount matches event price (in paise)
      const expectedAmount = (event.price ?? 0) * 100;
      if (payment.amount !== expectedAmount) {
        return res.status(400).json({ error: "Payment amount mismatch" });
      }

      // Get user details from order notes (server-side truth)
      const serverUserName = orderNotes.userName || userName;
      const serverUserEmail = orderNotes.userEmail || userEmail;

      if (!serverUserName || !serverUserEmail) {
        return res.status(400).json({ error: "User details required" });
      }

      // Check if already registered by payment ID (prevents replay)
      const existingAttendees = await storage.getEventAttendees(req.params.id);
      const alreadyRegisteredByPayment = existingAttendees.some((a) =>
        a.paymentStatus?.includes(razorpay_payment_id)
      );

      if (alreadyRegisteredByPayment) {
        return res.json({ success: true, message: "Already registered" });
      }

      // Also check by email
      const alreadyRegisteredByEmail = existingAttendees.some(
        (a) => a.userId === serverUserEmail
      );

      if (alreadyRegisteredByEmail) {
        return res.json({
          success: true,
          message: "Already registered with this email",
        });
      }

      // Check capacity
      if ((event.currentAttendees ?? 0) >= event.maxCapacity) {
        return res.status(400).json({ error: "Event is now full" });
      }

      // Register attendee using server-side verified data
      const attendeeData = {
        eventId: req.params.id,
        userId: serverUserEmail,
        userName: serverUserName,
        userPhone: orderNotes.userPhone || userPhone || "",
        paymentStatus: `paid:${razorpay_payment_id}:${razorpay_order_id}`,
        joinedAt: new Date().toISOString(),
      };

      const attendee = await storage.addAttendee(attendeeData);
      res.json({ success: true, attendee });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  return httpServer;
}
