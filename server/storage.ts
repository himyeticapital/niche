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
        title: "Sunrise Hiking at Tashi Viewpoint",
        description: "Join us for a beautiful sunrise hike to Tashi Viewpoint! Experience breathtaking views of Kanchenjunga as the sun rises over the Himalayas.\n\nWhat to bring:\n- Warm layers (it gets cold!)\n- Water bottle\n- Camera for the views\n- Comfortable hiking shoes\n\nWe'll meet at MG Marg and carpool together. Hot chai and momos after the hike!",
        category: "running",
        interests: ["fitness", "outdoor", "nature"],
        coverImage: "",
        date: "2025-12-28",
        time: "05:00",
        duration: 180,
        locationName: "Tashi Viewpoint",
        locationAddress: "Tashi Viewpoint, Gangtok, Sikkim 737101",
        latitude: 27.3389,
        longitude: 88.6065,
        maxCapacity: 15,
        currentAttendees: 12,
        price: 1000,
        isRecurring: true,
        recurringType: "weekly",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "intermediate",
        organizerId: "demo-user",
        organizerName: "Tenzin Dorje",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.8,
        organizerReviewCount: 23,
        rating: 4.9,
        reviewCount: 18,
        status: "active",
        isFeatured: true,
      },
      {
        id: "evt-2",
        title: "Dog Parents Nature Walk - Hanuman Tok Trail",
        description: "Calling all dog parents in Gangtok! Join us for a scenic walk with your furry friends along the peaceful Hanuman Tok trail.\n\nRequirements:\n- Dogs must be on leash\n- Bring water for yourself and your pet\n- Pick up after your dog\n\nThe trail is moderate and perfect for dogs of all sizes. Beautiful mountain views guaranteed!",
        category: "dog-parents",
        interests: ["hiking", "outdoor", "pets"],
        coverImage: "",
        date: "2025-12-29",
        time: "07:00",
        duration: 150,
        locationName: "Hanuman Tok Trail",
        locationAddress: "Hanuman Tok, Gangtok, Sikkim",
        latitude: 27.3500,
        longitude: 88.6150,
        maxCapacity: 12,
        currentAttendees: 8,
        price: 1000,
        isRecurring: false,
        recurringType: "",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "beginner",
        organizerId: "org-2",
        organizerName: "Pema Lhamo",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.7,
        organizerReviewCount: 15,
        rating: 4.8,
        reviewCount: 11,
        status: "active",
        isFeatured: true,
      },
      {
        id: "evt-3",
        title: "Christmas Eve House Party - MG Marg",
        description: "Celebrate Christmas Eve with the Gangtok community! Join us for a cozy house party with music, food, and good vibes.\n\nWhat to expect:\n- DJ playing everything from Nepali hits to Bollywood\n- Potluck style - bring a dish to share\n- Secret Santa (optional)\n- Stunning rooftop views of Gangtok\n\nLet's make this Christmas memorable!",
        category: "social",
        interests: ["social", "music", "party"],
        coverImage: "",
        date: "2025-12-24",
        time: "19:00",
        duration: 300,
        locationName: "Rooftop near MG Marg",
        locationAddress: "MG Marg, Gangtok, Sikkim 737101",
        latitude: 27.3314,
        longitude: 88.6138,
        maxCapacity: 30,
        currentAttendees: 24,
        price: 1000,
        isRecurring: false,
        recurringType: "",
        bringFriend: true,
        ageRequirement: "18+",
        fitnessLevel: "",
        organizerId: "org-3",
        organizerName: "Karma Tsering",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.9,
        organizerReviewCount: 31,
        rating: 4.9,
        reviewCount: 22,
        status: "active",
        isFeatured: true,
      },
      {
        id: "evt-4",
        title: "Thangka Painting Workshop for Beginners",
        description: "Learn the ancient Tibetan Buddhist art of Thangka painting! This beginner-friendly workshop will introduce you to the basics of this sacred art form.\n\nYou'll learn:\n- History and significance of Thangka\n- Basic drawing techniques\n- Traditional color mixing\n- Meditation while painting\n\nAll materials provided. Take home your own small Thangka!",
        category: "art",
        interests: ["creative", "meditation", "culture"],
        coverImage: "",
        date: "2025-12-28",
        time: "10:00",
        duration: 240,
        locationName: "Namgyal Institute of Tibetology",
        locationAddress: "Deorali, Gangtok, Sikkim 737102",
        latitude: 27.3167,
        longitude: 88.6000,
        maxCapacity: 10,
        currentAttendees: 7,
        price: 1000,
        isRecurring: false,
        recurringType: "",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "",
        organizerId: "org-4",
        organizerName: "Dawa Sherpa",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.8,
        organizerReviewCount: 19,
        rating: 4.9,
        reviewCount: 14,
        status: "active",
        isFeatured: true,
      },
      {
        id: "evt-5",
        title: "Early Morning Fishing at Tsomgo Lake",
        description: "Experience the peace of fishing at the stunning Tsomgo Lake! Join fellow fishing enthusiasts for a serene morning surrounded by snow-capped peaks.\n\nEquipment provided for beginners. Experienced anglers welcome with their own gear.\n\nNote: We practice catch-and-release. Permits arranged. Dress warmly - it's cold up there!",
        category: "fishing",
        interests: ["outdoor", "relaxation", "nature"],
        coverImage: "",
        date: "2025-12-30",
        time: "05:30",
        duration: 300,
        locationName: "Tsomgo Lake",
        locationAddress: "Tsomgo Lake, East Sikkim 737103",
        latitude: 27.3753,
        longitude: 88.7644,
        maxCapacity: 8,
        currentAttendees: 5,
        price: 1200,
        isRecurring: true,
        recurringType: "weekly",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "",
        organizerId: "org-5",
        organizerName: "Mingma Bhutia",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.7,
        organizerReviewCount: 12,
        rating: 4.8,
        reviewCount: 8,
        status: "active",
        isFeatured: false,
      },
      {
        id: "evt-6",
        title: "Saturday Night DJ Rave - Cloud Nine Rooftop",
        description: "Get ready for Gangtok's hottest weekend party! DJ Sonam is spinning the best EDM, techno, and house music.\n\nHighlights:\n- Open-air rooftop with mountain views\n- Full bar available\n- Light show and fog machines\n- Dance till 2 AM\n\nCome dressed to impress. Let's make Saturday nights legendary!",
        category: "social",
        interests: ["music", "party", "nightlife"],
        coverImage: "",
        date: "2025-12-28",
        time: "21:00",
        duration: 300,
        locationName: "Cloud Nine Rooftop Cafe",
        locationAddress: "Near MG Marg, Gangtok, Sikkim",
        latitude: 27.3320,
        longitude: 88.6145,
        maxCapacity: 50,
        currentAttendees: 38,
        price: 1000,
        isRecurring: true,
        recurringType: "weekly",
        bringFriend: true,
        ageRequirement: "21+",
        fitnessLevel: "",
        organizerId: "org-6",
        organizerName: "Sonam Wangchuk",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.6,
        organizerReviewCount: 28,
        rating: 4.7,
        reviewCount: 19,
        status: "active",
        isFeatured: true,
      },
      {
        id: "evt-7",
        title: "Tattoo Workshop - Learn Basic Techniques",
        description: "Ever wanted to try tattooing? Join our hands-on workshop where you'll learn:\n\n- Safety and hygiene basics\n- Machine handling\n- Line work on practice skin\n- Design fundamentals\n\nNo experience needed. All equipment provided. You won't be tattooing real skin - just practice materials!\n\nPerfect for artists curious about the craft.",
        category: "art",
        interests: ["creative", "learning", "art"],
        coverImage: "",
        date: "2025-12-29",
        time: "14:00",
        duration: 180,
        locationName: "Ink & Soul Studio",
        locationAddress: "Tibet Road, Gangtok, Sikkim",
        latitude: 27.3289,
        longitude: 88.6123,
        maxCapacity: 6,
        currentAttendees: 4,
        price: 1500,
        isRecurring: false,
        recurringType: "",
        bringFriend: true,
        ageRequirement: "18+",
        fitnessLevel: "",
        organizerId: "org-7",
        organizerName: "Phurba Tamang",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.9,
        organizerReviewCount: 16,
        rating: 4.9,
        reviewCount: 11,
        status: "active",
        isFeatured: false,
      },
      {
        id: "evt-8",
        title: "Sikkim Investors Club - Monthly Meetup",
        description: "Join Sikkim's growing community of investors! Whether you're into stocks, crypto, mutual funds, or real estate - this is your tribe.\n\nThis month's topics:\n- 2025 market outlook\n- Tax-saving investment strategies\n- Local business investment opportunities\n- Q&A session\n\nBeginner-friendly. Learn from experienced investors!",
        category: "social",
        interests: ["finance", "learning", "networking"],
        coverImage: "",
        date: "2025-12-27",
        time: "18:00",
        duration: 120,
        locationName: "The Coffee Shop",
        locationAddress: "MG Marg, Gangtok, Sikkim 737101",
        latitude: 27.3310,
        longitude: 88.6135,
        maxCapacity: 20,
        currentAttendees: 14,
        price: 1000,
        isRecurring: true,
        recurringType: "monthly",
        bringFriend: true,
        ageRequirement: "18+",
        fitnessLevel: "",
        organizerId: "org-8",
        organizerName: "Nima Lepcha",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.8,
        organizerReviewCount: 22,
        rating: 4.8,
        reviewCount: 17,
        status: "active",
        isFeatured: true,
      },
      {
        id: "evt-9",
        title: "Gangtok Hackathon - Build for Sikkim",
        description: "24-hour hackathon to build tech solutions for local Sikkim challenges!\n\nThemes:\n- Tourism tech\n- Local business digitization\n- Environmental monitoring\n- Healthcare accessibility\n\nPrizes worth Rs. 50,000! Food and chai provided throughout.\n\nTeams of 2-4. Solo participants will be matched with teams.",
        category: "social",
        interests: ["tech", "coding", "innovation"],
        coverImage: "",
        date: "2026-01-04",
        time: "09:00",
        duration: 1440,
        locationName: "Sikkim Manipal University",
        locationAddress: "5th Mile, Tadong, Gangtok, Sikkim",
        latitude: 27.2950,
        longitude: 88.6050,
        maxCapacity: 40,
        currentAttendees: 28,
        price: 1000,
        isRecurring: false,
        recurringType: "",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "",
        organizerId: "org-9",
        organizerName: "Sangay Bhutia",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.7,
        organizerReviewCount: 9,
        rating: 4.8,
        reviewCount: 6,
        status: "active",
        isFeatured: true,
      },
      {
        id: "evt-10",
        title: "New Year's Eve House Party Bash",
        description: "Ring in 2026 with the biggest house party in Gangtok! Celebrate with friends old and new.\n\nWhat's happening:\n- Live DJ from 10 PM\n- Bonfire on the terrace\n- Midnight fireworks view\n- Unlimited drinks package\n- Momos and local food\n\nDress code: Festive! Let's welcome 2026 in style!",
        category: "social",
        interests: ["party", "social", "celebration"],
        coverImage: "",
        date: "2025-12-31",
        time: "20:00",
        duration: 360,
        locationName: "Mountain View Villa",
        locationAddress: "Upper Tadong, Gangtok, Sikkim",
        latitude: 27.3050,
        longitude: 88.6100,
        maxCapacity: 60,
        currentAttendees: 45,
        price: 1200,
        isRecurring: false,
        recurringType: "",
        bringFriend: true,
        ageRequirement: "21+",
        fitnessLevel: "",
        organizerId: "org-10",
        organizerName: "Tsering Namgyal",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.9,
        organizerReviewCount: 42,
        rating: 4.9,
        reviewCount: 35,
        status: "active",
        isFeatured: true,
      },
      {
        id: "evt-11",
        title: "BGMI Tournament - Gangtok Esports League",
        description: "Calling all BGMI players! Join Gangtok's biggest mobile gaming tournament with cash prizes!\n\nFormat:\n- Squad mode (4 players per team)\n- 3 matches, points system\n- Top 3 teams win cash prizes\n- Total prize pool: Rs. 15,000\n\nRequirements:\n- Bring your own device\n- Stable internet (WiFi provided as backup)\n- Register with your in-game name\n\nLet's find out who's the best squad in Sikkim!",
        category: "gaming",
        interests: ["gaming", "esports", "competition"],
        coverImage: "",
        date: "2025-12-29",
        time: "14:00",
        duration: 240,
        locationName: "Game Zone Cafe",
        locationAddress: "Tibet Road, Gangtok, Sikkim",
        latitude: 27.3295,
        longitude: 88.6130,
        maxCapacity: 40,
        currentAttendees: 32,
        price: 1000,
        isRecurring: true,
        recurringType: "monthly",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "",
        organizerId: "org-11",
        organizerName: "Rinzin Gyatso",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.7,
        organizerReviewCount: 18,
        rating: 4.8,
        reviewCount: 12,
        status: "active",
        isFeatured: true,
      },
      {
        id: "evt-12",
        title: "PC Gaming LAN Party - Valorant & CS2",
        description: "Old school LAN party vibes are back! Join fellow gamers for an epic night of Valorant and CS2.\n\nWhat we're playing:\n- Valorant custom matches\n- CS2 competitive\n- Casual games between rounds\n\nSetup:\n- 20 gaming PCs available\n- Bring your own peripherals if preferred\n- High-speed internet\n- Snacks and energy drinks included\n\nBeginner-friendly! We'll help you get started.",
        category: "gaming",
        interests: ["gaming", "social", "PC gaming"],
        coverImage: "",
        date: "2025-12-28",
        time: "18:00",
        duration: 300,
        locationName: "Pixel Arena Gaming Lounge",
        locationAddress: "Development Area, Gangtok, Sikkim",
        latitude: 27.3400,
        longitude: 88.6080,
        maxCapacity: 20,
        currentAttendees: 16,
        price: 1000,
        isRecurring: true,
        recurringType: "weekly",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "",
        organizerId: "org-12",
        organizerName: "Tashi Norbu",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.9,
        organizerReviewCount: 24,
        rating: 4.9,
        reviewCount: 18,
        status: "active",
        isFeatured: true,
      },
      {
        id: "evt-13",
        title: "Board Games & Chai Night",
        description: "Tired of screens? Join us for an evening of classic and modern board games!\n\nGames available:\n- Catan, Ticket to Ride, Codenames\n- Chess, Carrom, Ludo\n- Werewolf for larger groups\n- Bring your favorites too!\n\nPerfect for:\n- Making new friends\n- Date nights\n- Family-friendly fun\n\nUnlimited chai and light snacks included!",
        category: "gaming",
        interests: ["board games", "social", "strategy"],
        coverImage: "",
        date: "2025-12-27",
        time: "17:00",
        duration: 180,
        locationName: "Himalayan Board Game Club",
        locationAddress: "MG Marg, Gangtok, Sikkim 737101",
        latitude: 27.3312,
        longitude: 88.6140,
        maxCapacity: 24,
        currentAttendees: 18,
        price: 1000,
        isRecurring: true,
        recurringType: "weekly",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "",
        organizerId: "org-13",
        organizerName: "Pema Yangchen",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.8,
        organizerReviewCount: 21,
        rating: 4.9,
        reviewCount: 16,
        status: "active",
        isFeatured: false,
      },
      {
        id: "evt-14",
        title: "Anime Watch Party - One Piece Marathon",
        description: "Nakama assemble! Join the Gangtok Anime Club for a One Piece marathon on the big screen!\n\nWhat's happening:\n- Watching Wano arc highlights\n- Big projector screen experience\n- Japanese snacks available\n- Cosplay welcome (bonus points!)\n- Discussion and theories session\n\nWhether you're caught up or a new fan, everyone's welcome!",
        category: "gaming",
        interests: ["anime", "social", "entertainment"],
        coverImage: "",
        date: "2025-12-30",
        time: "15:00",
        duration: 240,
        locationName: "Otaku Den",
        locationAddress: "Near Lal Bazaar, Gangtok, Sikkim",
        latitude: 27.3280,
        longitude: 88.6155,
        maxCapacity: 30,
        currentAttendees: 22,
        price: 1000,
        isRecurring: true,
        recurringType: "weekly",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "",
        organizerId: "org-14",
        organizerName: "Lobsang Tenzin",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.8,
        organizerReviewCount: 15,
        rating: 4.8,
        reviewCount: 11,
        status: "active",
        isFeatured: false,
      },
      {
        id: "evt-15",
        title: "FIFA Tournament - Console Gaming Night",
        description: "Think you're the best FIFA player in Gangtok? Prove it!\n\nTournament details:\n- FIFA 24 on PS5\n- 1v1 knockout format\n- Winner takes Rs. 5000\n- Runner-up gets Rs. 2000\n\nRules:\n- 6-minute halves\n- Any team allowed\n- Fair play expected\n\nCasual matches available for non-participants. Come watch the action!",
        category: "gaming",
        interests: ["gaming", "sports", "competition"],
        coverImage: "",
        date: "2025-12-26",
        time: "16:00",
        duration: 240,
        locationName: "Console Corner",
        locationAddress: "Nam Nang, Gangtok, Sikkim",
        latitude: 27.3350,
        longitude: 88.6170,
        maxCapacity: 32,
        currentAttendees: 24,
        price: 1000,
        isRecurring: false,
        recurringType: "",
        bringFriend: true,
        ageRequirement: "",
        fitnessLevel: "",
        organizerId: "org-15",
        organizerName: "Kunzang Dorje",
        organizerAvatar: "",
        organizerVerified: true,
        organizerRating: 4.6,
        organizerReviewCount: 14,
        rating: 4.7,
        reviewCount: 9,
        status: "active",
        isFeatured: true,
      },
    ];

    const sampleReviews: Review[] = [
      {
        id: "rev-1",
        eventId: "evt-1",
        userId: "user-1",
        userName: "Karma Diki",
        userAvatar: "",
        rating: 5,
        comment: "The sunrise view was absolutely magical! Tenzin is a wonderful guide. Made new hiking friends!",
        createdAt: "2025-12-20T10:00:00Z",
        organizerReply: "Thank you Karma! The Kanchenjunga views never disappoint. See you next week!",
      },
      {
        id: "rev-2",
        eventId: "evt-1",
        userId: "user-2",
        userName: "Dorje Wangmo",
        userAvatar: "",
        rating: 5,
        comment: "Perfect morning activity. The hot momos after the hike were a bonus!",
        createdAt: "2025-12-18T09:00:00Z",
        organizerReply: null,
      },
      {
        id: "rev-3",
        eventId: "evt-4",
        userId: "user-3",
        userName: "Passang Sherpa",
        userAvatar: "",
        rating: 5,
        comment: "Dawa is an incredible teacher! I never thought I could create something so beautiful. Highly recommend!",
        createdAt: "2025-12-15T22:00:00Z",
        organizerReply: null,
      },
    ];

    const sampleAttendees: Attendee[] = [
      {
        id: "att-1",
        eventId: "evt-1",
        userId: "user-1",
        userName: "Karma Diki",
        userPhone: "+91 98765 43210",
        paymentStatus: "completed",
        joinedAt: "2025-12-20T10:00:00Z",
        checkedIn: true,
      },
      {
        id: "att-2",
        eventId: "evt-1",
        userId: "user-2",
        userName: "Dorje Wangmo",
        userPhone: "+91 87654 32109",
        paymentStatus: "completed",
        joinedAt: "2025-12-21T09:00:00Z",
        checkedIn: false,
      },
      {
        id: "att-3",
        eventId: "evt-1",
        userId: "user-3",
        userName: "Passang Sherpa",
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
      return sum + (e.currentAttendees || 0) * (e.price || 0) * 0.8;
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
      revenue: (e.currentAttendees || 0) * (e.price || 0) * 0.8,
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
