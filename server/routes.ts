import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertAttendeeSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication first
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // Get all events with optional filters
  app.get("/api/events", async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string | undefined,
        searchQuery: req.query.q as string | undefined,
        minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
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
        return res.status(400).json({ error: "Invalid event data", details: error.errors });
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

  // Join event
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
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
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
      const organizerId = (req.query.organizerId as string) || "demo-user";
      const stats = await storage.getDashboardStats(organizerId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Get categories
  app.get("/api/categories", async (req, res) => {
    const { categories } = await import("@shared/schema");
    res.json(categories);
  });

  // Get Stripe publishable key
  app.get("/api/stripe/config", async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      console.error("Error getting Stripe config:", error);
      res.status(500).json({ error: "Failed to get payment config" });
    }
  });

  // Create checkout session for event booking
  app.post("/api/events/:id/checkout", async (req, res) => {
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

      const stripe = await getUncachableStripeClient();
      
      // Create checkout session with event details
      // Price is in INR (paise), so multiply by 100
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: event.title,
                description: `${event.category} event on ${new Date(event.dateTime).toLocaleDateString()}`,
                images: event.imageUrl ? [event.imageUrl] : [],
              },
              unit_amount: event.price * 100, // Convert to paise
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/events/${event.id}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/events/${event.id}?payment=cancelled`,
        customer_email: userEmail,
        metadata: {
          eventId: event.id,
          userName,
          userPhone: userPhone || '',
        },
      });

      res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Verify payment and register attendee
  app.post("/api/events/:id/verify-payment", async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID required" });
      }

      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== 'paid') {
        return res.status(400).json({ error: "Payment not completed" });
      }

      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Check if already registered (prevent duplicate registrations)
      const existingAttendees = await storage.getEventAttendees(req.params.id);
      const alreadyRegistered = existingAttendees.some(
        a => a.userId === session.customer_email || a.userName === session.metadata?.userName
      );

      if (alreadyRegistered) {
        return res.json({ success: true, message: "Already registered" });
      }

      // Register attendee
      const attendeeData = {
        eventId: req.params.id,
        userId: session.customer_email || `user-${Date.now()}`,
        userName: session.metadata?.userName || 'Anonymous',
        userPhone: session.metadata?.userPhone || '',
        paymentStatus: 'completed',
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
