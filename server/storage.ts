import {
  type User,
  type InsertUser,
  type Event,
  type InsertEvent,
  type Attendee,
  type InsertAttendee,
  type Review,
  type InsertReview,
  type DashboardStats,
  type EventFilters,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Events
  getEvents(filters?: EventFilters): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;

  // Attendees
  getEventAttendees(eventId: string): Promise<Attendee[]>;
  addAttendee(attendee: InsertAttendee): Promise<Attendee>;
  removeAttendee(eventId: string, userId: string): Promise<boolean>;
  checkInAttendee(eventId: string, attendeeId: string): Promise<boolean>;

  // Reviews
  getEventReviews(eventId: string): Promise<Review[]>;
  addReview(review: InsertReview): Promise<Review>;

  // Dashboard
  getDashboardStats(organizerId: string): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private events: Map<string, Event>;
  private attendees: Map<string, Attendee>;
  private reviews: Map<string, Review>;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.attendees = new Map();
    this.reviews = new Map();

    this.seedData();
  }

  private seedData() {
    const sampleEvents: Event[] = [
      {
        id: "evt-1",
        title: "Saturday Morning Running Club - 8AM at Cubbon Park",
        description: "Join us for a refreshing 5km run through the beautiful Cubbon Park! Whether you're a beginner or experienced runner, everyone is welcome. We'll start with light stretching, followed by a group run at a comfortable pace.\n\nWhat to bring:\n- Running shoes\n- Water bottle\n- Light snacks (optional)\n\nWe usually finish with chai at the nearby stall. It's a great way to start your weekend and make new friends who share your love for running!",
        category: "running",
        interests: ["fitness", "outdoor", "social"],
        coverImage: "",
        date: "2025-12-28",
        time: "08:00",
        duration: 90,
        locationName: "Cubbon Park Main Gate",
        locationAddress: "Cubbon Park, Kasturba Road, Bangalore 560001",
        latitude: 12.9763,
        longitude: 77.5929,
        maxCapacity: 30,
        currentAttendees: 24,
        price: 0,
        isRecurring: true,
        recurringType: "weekly",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "beginner",
        organizerId: "demo-user",
        organizerName: "Sahil Mehta",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.8,
        organizerReviewCount: 47,
        rating: 4.9,
        reviewCount: 32,
        status: "active",
        isFeatured: true,
      },
      {
        id: "evt-2",
        title: "Dog Parents Hiking Trip - Nandi Hills",
        description: "Calling all dog parents! Join us for a beautiful sunrise hike at Nandi Hills with your furry friends. This is a moderate 3km trail perfect for dogs of all sizes.\n\nRequirements:\n- Dogs must be on leash\n- Bring water for yourself and your pet\n- Pick up after your dog\n\nWe'll carpool from Indiranagar at 5 AM. The view from the top is absolutely stunning!",
        category: "dog-parents",
        interests: ["hiking", "outdoor", "pets"],
        coverImage: "",
        date: "2025-12-29",
        time: "05:00",
        duration: 240,
        locationName: "Nandi Hills Summit",
        locationAddress: "Nandi Hills, Chikkaballapur District",
        latitude: 13.3702,
        longitude: 77.6835,
        maxCapacity: 20,
        currentAttendees: 16,
        price: 200,
        isRecurring: false,
        recurringType: "",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "intermediate",
        organizerId: "org-2",
        organizerName: "Priya Sharma",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.7,
        organizerReviewCount: 23,
        rating: 4.8,
        reviewCount: 18,
        status: "active",
        isFeatured: true,
      },
      {
        id: "evt-3",
        title: "Friday Night Board Game Showdown",
        description: "Looking for a fun Friday evening? Join our intimate board game night! We play a mix of strategy games and party games.\n\nGames we usually play:\n- Settlers of Catan\n- Ticket to Ride\n- Codenames\n- Splendor\n\nSnacks and chai included in the fee. No experience needed - we'll teach you the rules!",
        category: "board-games",
        interests: ["social", "indoor", "gaming"],
        coverImage: "",
        date: "2025-12-27",
        time: "19:00",
        duration: 180,
        locationName: "The Boardroom Cafe",
        locationAddress: "100 Feet Road, Indiranagar, Bangalore",
        latitude: 12.9784,
        longitude: 77.6408,
        maxCapacity: 12,
        currentAttendees: 10,
        price: 300,
        isRecurring: true,
        recurringType: "weekly",
        bringFriend: true,
        ageRequirement: "18+",
        fitnessLevel: "",
        organizerId: "org-3",
        organizerName: "Rahul Verma",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.9,
        organizerReviewCount: 56,
        rating: 4.9,
        reviewCount: 41,
        status: "active",
        isFeatured: true,
      },
      {
        id: "evt-4",
        title: "Weekend Photography Walk - Lalbagh",
        description: "Explore the beautiful Lalbagh Botanical Garden through your camera lens! This is a casual photography walk suitable for all skill levels - from smartphone photographers to DSLR enthusiasts.\n\nWe'll focus on:\n- Flower macro photography\n- Bird photography tips\n- Composition techniques\n- Natural lighting\n\nBring your camera/phone and walking shoes!",
        category: "photography",
        interests: ["outdoor", "creative", "nature"],
        coverImage: "",
        date: "2025-12-28",
        time: "06:30",
        duration: 120,
        locationName: "Lalbagh Main Gate",
        locationAddress: "Lalbagh Botanical Garden, Bangalore 560004",
        latitude: 12.9507,
        longitude: 77.5848,
        maxCapacity: 15,
        currentAttendees: 8,
        price: 150,
        isRecurring: false,
        recurringType: "",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "",
        organizerId: "org-4",
        organizerName: "Anita Desai",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.6,
        organizerReviewCount: 19,
        rating: 4.7,
        reviewCount: 12,
        status: "active",
        isFeatured: false,
      },
      {
        id: "evt-5",
        title: "Sunrise Yoga at Ulsoor Lake",
        description: "Start your day with peaceful yoga by the serene Ulsoor Lake. This 75-minute session combines Hatha yoga with mindful meditation.\n\nSuitable for all levels. Mats provided.\n\nBenefits:\n- Stress relief\n- Improved flexibility\n- Community connection\n- Beautiful lake views",
        category: "yoga",
        interests: ["fitness", "meditation", "wellness"],
        coverImage: "",
        date: "2025-12-29",
        time: "06:00",
        duration: 75,
        locationName: "Ulsoor Lake Promenade",
        locationAddress: "Ulsoor Lake, Halasuru, Bangalore",
        latitude: 12.9829,
        longitude: 77.6201,
        maxCapacity: 25,
        currentAttendees: 18,
        price: 100,
        isRecurring: true,
        recurringType: "weekly",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "beginner",
        organizerId: "org-5",
        organizerName: "Maya Iyer",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.9,
        organizerReviewCount: 89,
        rating: 4.9,
        reviewCount: 67,
        status: "active",
        isFeatured: true,
      },
      {
        id: "evt-6",
        title: "Book Club: Fiction Lovers Monthly Meet",
        description: "This month we're discussing 'The White Tiger' by Aravind Adiga. Join fellow book lovers for thoughtful discussion, chai, and snacks.\n\nEven if you haven't finished the book, you're welcome to join and listen!\n\nNext month's pick will be voted on at the meeting.",
        category: "book-clubs",
        interests: ["reading", "social", "discussion"],
        coverImage: "",
        date: "2025-12-30",
        time: "17:00",
        duration: 120,
        locationName: "Champaca Bookstore",
        locationAddress: "4th Cross, HAL 2nd Stage, Indiranagar",
        latitude: 12.9781,
        longitude: 77.6393,
        maxCapacity: 15,
        currentAttendees: 11,
        price: 0,
        isRecurring: true,
        recurringType: "monthly",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "",
        organizerId: "org-6",
        organizerName: "Kavitha Rao",
        organizerAvatar: "",
        organizerVerified: false,
        organizerRating: 4.5,
        organizerReviewCount: 8,
        rating: 4.6,
        reviewCount: 5,
        status: "active",
        isFeatured: false,
      },
      {
        id: "evt-7",
        title: "Early Morning Fishing - Yelahanka Lake",
        description: "Join our peaceful fishing group for a relaxing morning by the lake. We practice catch-and-release fishing.\n\nEquipment provided for beginners. Experienced anglers welcome with their own gear.\n\nThis is a great activity to disconnect from screens and connect with nature and like-minded folks.",
        category: "fishing",
        interests: ["outdoor", "relaxation", "nature"],
        coverImage: "",
        date: "2025-12-28",
        time: "05:30",
        duration: 180,
        locationName: "Yelahanka Lake Fishing Point",
        locationAddress: "Yelahanka Lake, Bangalore North",
        latitude: 13.1007,
        longitude: 77.5963,
        maxCapacity: 10,
        currentAttendees: 6,
        price: 250,
        isRecurring: true,
        recurringType: "weekly",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "",
        organizerId: "org-7",
        organizerName: "Venkat Reddy",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.7,
        organizerReviewCount: 14,
        rating: 4.8,
        reviewCount: 9,
        status: "active",
        isFeatured: false,
      },
      {
        id: "evt-8",
        title: "Sunday Badminton Tournament",
        description: "Fun doubles badminton tournament for recreational players! All skill levels welcome.\n\nFormat:\n- Random partner assignment\n- Round robin matches\n- Snacks break in between\n\nBring your racket (extras available) and lots of energy!",
        category: "sports",
        interests: ["fitness", "competition", "social"],
        coverImage: "",
        date: "2025-12-28",
        time: "07:00",
        duration: 180,
        locationName: "Koramangala Indoor Stadium",
        locationAddress: "5th Block, Koramangala, Bangalore",
        latitude: 12.9352,
        longitude: 77.6245,
        maxCapacity: 16,
        currentAttendees: 14,
        price: 200,
        isRecurring: true,
        recurringType: "weekly",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "intermediate",
        organizerId: "org-8",
        organizerName: "Arjun Nair",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.8,
        organizerReviewCount: 34,
        rating: 4.7,
        reviewCount: 28,
        status: "active",
        isFeatured: true,
      },
    ];

    const sampleReviews: Review[] = [
      {
        id: "rev-1",
        eventId: "evt-1",
        userId: "user-1",
        userName: "Priya Sharma",
        userAvatar: "",
        rating: 5,
        comment: "Amazing running group! Sahil is such an encouraging organizer. Made 3 new running buddies!",
        createdAt: "2025-12-20T10:00:00Z",
        organizerReply: "Thank you Priya! So glad you enjoyed it. See you next Saturday!",
      },
      {
        id: "rev-2",
        eventId: "evt-1",
        userId: "user-2",
        userName: "Vikram K",
        userAvatar: "",
        rating: 5,
        comment: "Perfect pace for beginners. The chai at the end is a bonus!",
        createdAt: "2025-12-18T09:00:00Z",
        organizerReply: null,
      },
      {
        id: "rev-3",
        eventId: "evt-3",
        userId: "user-3",
        userName: "Anita M",
        userAvatar: "",
        rating: 5,
        comment: "Best board game night in Bangalore! Rahul explains rules so well, even complex games become fun.",
        createdAt: "2025-12-15T22:00:00Z",
        organizerReply: null,
      },
    ];

    const sampleAttendees: Attendee[] = [
      {
        id: "att-1",
        eventId: "evt-1",
        userId: "user-1",
        userName: "Priya Sharma",
        userPhone: "+91 98765 43210",
        paymentStatus: "completed",
        joinedAt: "2025-12-20T10:00:00Z",
        checkedIn: true,
      },
      {
        id: "att-2",
        eventId: "evt-1",
        userId: "user-2",
        userName: "Vikram K",
        userPhone: "+91 87654 32109",
        paymentStatus: "completed",
        joinedAt: "2025-12-21T09:00:00Z",
        checkedIn: false,
      },
      {
        id: "att-3",
        eventId: "evt-1",
        userId: "user-3",
        userName: "Ananya Menon",
        userPhone: "+91 76543 21098",
        paymentStatus: "completed",
        joinedAt: "2025-12-22T14:00:00Z",
        checkedIn: false,
      },
    ];

    sampleEvents.forEach((event) => {
      this.events.set(event.id, event);
    });

    sampleReviews.forEach((review) => {
      this.reviews.set(review.id, review);
    });

    sampleAttendees.forEach((attendee) => {
      this.attendees.set(attendee.id, attendee);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      eventsHosted: 0,
      rating: 0,
      reviewCount: 0,
    };
    this.users.set(id, user);
    return user;
  }

  async getEvents(filters?: EventFilters): Promise<Event[]> {
    let events = Array.from(this.events.values()).filter(
      (e) => e.status === "active"
    );

    if (filters?.category) {
      events = events.filter((e) => e.category === filters.category);
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.locationName.toLowerCase().includes(query)
      );
    }

    if (filters?.minPrice !== undefined) {
      events = events.filter((e) => (e.price || 0) >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      events = events.filter((e) => (e.price || 0) <= filters.maxPrice!);
    }

    return events.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = `evt-${randomUUID().slice(0, 8)}`;
    const event: Event = {
      ...insertEvent,
      id,
      currentAttendees: 0,
      rating: 0,
      reviewCount: 0,
      status: "active",
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(
    id: string,
    updates: Partial<Event>
  ): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;

    const updated = { ...event, ...updates };
    this.events.set(id, updated);
    return updated;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  async getEventAttendees(eventId: string): Promise<Attendee[]> {
    return Array.from(this.attendees.values()).filter(
      (a) => a.eventId === eventId
    );
  }

  async addAttendee(insertAttendee: InsertAttendee): Promise<Attendee> {
    const id = `att-${randomUUID().slice(0, 8)}`;
    const attendee: Attendee = {
      ...insertAttendee,
      id,
      checkedIn: false,
    };
    this.attendees.set(id, attendee);

    const event = this.events.get(insertAttendee.eventId);
    if (event) {
      event.currentAttendees = (event.currentAttendees || 0) + 1;
      this.events.set(event.id, event);
    }

    return attendee;
  }

  async removeAttendee(eventId: string, userId: string): Promise<boolean> {
    const attendee = Array.from(this.attendees.values()).find(
      (a) => a.eventId === eventId && a.userId === userId
    );
    if (!attendee) return false;

    this.attendees.delete(attendee.id);

    const event = this.events.get(eventId);
    if (event && event.currentAttendees && event.currentAttendees > 0) {
      event.currentAttendees -= 1;
      this.events.set(event.id, event);
    }

    return true;
  }

  async checkInAttendee(eventId: string, attendeeId: string): Promise<boolean> {
    const attendee = this.attendees.get(attendeeId);
    if (!attendee || attendee.eventId !== eventId) return false;

    attendee.checkedIn = true;
    this.attendees.set(attendeeId, attendee);
    return true;
  }

  async getEventReviews(eventId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter((r) => r.eventId === eventId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async addReview(insertReview: InsertReview): Promise<Review> {
    const id = `rev-${randomUUID().slice(0, 8)}`;
    const review: Review = {
      ...insertReview,
      id,
      organizerReply: null,
    };
    this.reviews.set(id, review);

    const event = this.events.get(insertReview.eventId);
    if (event) {
      const reviews = await this.getEventReviews(insertReview.eventId);
      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      event.rating = Math.round(avgRating * 10) / 10;
      event.reviewCount = reviews.length;
      this.events.set(event.id, event);
    }

    return review;
  }

  async getDashboardStats(organizerId: string): Promise<DashboardStats> {
    const myEvents = Array.from(this.events.values()).filter(
      (e) => e.organizerId === organizerId
    );

    const totalRevenue = myEvents.reduce((sum, e) => {
      return sum + (e.currentAttendees || 0) * (e.price || 0) * 0.9;
    }, 0);

    const totalAttendees = myEvents.reduce(
      (sum, e) => sum + (e.currentAttendees || 0),
      0
    );

    const avgRating =
      myEvents.length > 0
        ? myEvents.reduce((sum, e) => sum + (e.rating || 0), 0) / myEvents.length
        : 0;

    const upcomingEvents = myEvents
      .filter((e) => new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);

    const recentAttendees = Array.from(this.attendees.values())
      .filter((a) => myEvents.some((e) => e.id === a.eventId))
      .sort(
        (a, b) =>
          new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
      )
      .slice(0, 10);

    const revenueByEvent = myEvents.map((e) => ({
      eventTitle: e.title,
      revenue: (e.currentAttendees || 0) * (e.price || 0) * 0.9,
    }));

    return {
      totalRevenue: Math.round(totalRevenue),
      totalEvents: myEvents.length,
      totalAttendees,
      averageRating: Math.round(avgRating * 10) / 10,
      upcomingEvents,
      recentAttendees,
      revenueByEvent,
    };
  }
}

export const storage = new MemStorage();
