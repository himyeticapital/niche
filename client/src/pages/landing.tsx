import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  MapPin,
  Users,
  Star,
  Search,
  UserPlus,
  Heart,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Eye,
  IndianRupee,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
// Sikkim images from Unsplash
const sikkimImages = {
  // Sikkim landscapes and mountains
  landscape1: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80", // Sikkim mountains
  landscape2: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80", // Himalayan view
  landscape3: "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=800&q=80", // Gangtok view
  landscape4: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80", // Mountain monastery
  // Community and people
  community1: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80", // Friends gathering
  community2: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80", // Group activity
  // Local culture
  culture1: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&q=80", // Buddhist monastery
  culture2: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80", // Mountain trails
  // Adventure
  adventure1: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80", // Hiking
  adventure2: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800&q=80", // Trekking
  adventure3: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", // Mountain peaks
  adventure4: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80", // Sunrise mountains
};
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EventCard } from "@/components/event-card";
import { CategoryPill } from "@/components/category-pill";
import { StarRating } from "@/components/star-rating";
import {
  AnimatedStat,
  AnimatedStatsContainer,
} from "@/components/animated-stat";
import { type Event } from "@shared/schema";
import { categories } from "@shared/utils/constants";
import { useQuery } from "@tanstack/react-query";

export default function LandingPage() {
  const { data: featuredEvents = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const galleryImages = [
    sikkimImages.landscape1,
    sikkimImages.landscape2,
    sikkimImages.adventure1,
    sikkimImages.adventure2,
    sikkimImages.culture1,
    sikkimImages.culture2,
    sikkimImages.community1,
    sikkimImages.community2,
    sikkimImages.landscape3,
    sikkimImages.landscape4,
    sikkimImages.adventure3,
    sikkimImages.adventure4,
  ];
  const [currentIndices, setCurrentIndices] = useState([0, 3, 6]);

  useEffect(() => {
    const intervals = [
      setInterval(() => {
        setCurrentIndices((prev) => [
          (prev[0] + 1) % galleryImages.length,
          prev[1],
          prev[2],
        ]);
      }, 3500),
      setInterval(() => {
        setCurrentIndices((prev) => [
          prev[0],
          (prev[1] + 1) % galleryImages.length,
          prev[2],
        ]);
      }, 4500),
      setInterval(() => {
        setCurrentIndices((prev) => [
          prev[0],
          prev[1],
          (prev[2] + 1) % galleryImages.length,
        ]);
      }, 5500),
    ];

    return () => intervals.forEach(clearInterval);
  }, []);

  const galleryLabels = [
    { title: "Mountain Adventures", subtitle: "Himalayan Trails" },
    { title: "Community Gatherings", subtitle: "New Friendships" },
    { title: "Local Experiences", subtitle: "Discover Sikkim" },
  ];

  const testimonials = [
    {
      name: "Pema Diki",
      role: "Dog Parent",
      avatar: "PD",
      quote:
        "I found my tribe! Every Sunday morning, I now hike with 10 other dog parents at Hanuman Tok. My dog has made friends, and so have I.",
      rating: 5,
    },
    {
      name: "Tenzin Norbu",
      role: "Hiking Group Organizer",
      avatar: "TN",
      quote:
        "Garum helped me turn my passion into a sustainable community. I now earn enough to cover my trekking gear and more!",
      rating: 5,
    },
    {
      name: "Karma Yangzom",
      role: "Art Workshop Enthusiast",
      avatar: "KY",
      quote:
        "As someone new to Gangtok, joining a small Thangka painting workshop was perfect. Made 3 close friends in my first month.",
      rating: 5,
    },
  ];

  const howItWorks = [
    {
      icon: Search,
      title: "Discover",
      description: "Find niche events near you based on your interests",
    },
    {
      icon: UserPlus,
      title: "Join",
      description: "One-tap registration with instant payment confirmation",
    },
    {
      icon: Heart,
      title: "Connect",
      description: "Build lasting friendships through shared passions",
    },
  ];

  const safetyFeatures = [
    {
      icon: CheckCircle2,
      title: "Verified Organizers",
      description: "Phone & identity verification for all organizers",
    },
    {
      icon: Star,
      title: "Community Ratings",
      description: "Transparent reviews from real attendees",
    },
    {
      icon: AlertTriangle,
      title: "SOS Button",
      description: "Emergency alert during events with location sharing",
    },
    {
      icon: Eye,
      title: "Active Moderation",
      description: "24/7 content moderation and quick response to reports",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <MapPin className="h-4 w-4" />
            Hyperlocal Community Discovery
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Find Your Community
            <br />
            <span className="text-primary">Near You</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-8">
            Combat urban loneliness through hyperlocal niche events. Discover
            running clubs, dog parent hikes, board game nights, and more—all
            within walking distance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/events">
              <Button
                size="lg"
                className="text-base px-8"
                data-testid="button-discover-events"
              >
                Discover Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/create">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8"
                data-testid="button-create-event-hero"
              >
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y bg-muted/30">
        <AnimatedStatsContainer>
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              <AnimatedStat value={5} suffix="+" label="Events Hosted" />
              <div className="h-8 w-px bg-border hidden md:block" />
              <AnimatedStat value={1} suffix="+" label="Cities" />
              <div className="h-8 w-px bg-border hidden md:block" />
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <AnimatedStat value={4.8} label="" decimals={1} />
                  <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>
        </AnimatedStatsContainer>
      </section>

      {/* Scenic Community Gallery */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Adventure Awaits in Sikkim
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join hiking groups exploring the stunning Himalayan trails around
              Gangtok
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {galleryLabels.map((label, cardIndex) => (
              <div
                key={cardIndex}
                className="relative aspect-[4/3] overflow-hidden rounded-md group"
              >
                {galleryImages.map((img, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={img}
                    alt={`${label.title} - hiking scene`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 group-hover:scale-105 ${
                      currentIndices[cardIndex] === imgIndex
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                    style={{
                      transition: "opacity 1s ease-in-out, transform 0.3s ease",
                    }}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold">{label.title}</p>
                  <p className="text-sm text-white/80">{label.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to finding your community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-bold mb-3">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Events */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Happening Near You
              </h2>
              <p className="text-muted-foreground">
                Trending events in your area
              </p>
            </div>
            <Link href="/events">
              <Button variant="outline" data-testid="link-view-all-events">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-5 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                    <div className="h-9 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.slice(0, 6).map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  distance={1.2 + index * 0.8}
                  variant={index === 0 ? "featured" : "default"}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* For Organizers */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                <Users className="h-4 w-4" />
                For Organizers
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Turn Your Passion Into a Sustainable Community
              </h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Monetize your events</strong> - Earn 90% of event
                    fees with instant payouts
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Auto payment collection</strong> - No more manual
                    UPI requests or tracking
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Built-in marketing</strong> - Get discovered by
                    nearby community seekers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Free for free events</strong> - No platform fee for
                    community events
                  </span>
                </li>
              </ul>

              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <IndianRupee className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">500 - 1,000 per event</p>
                  <p className="text-sm text-muted-foreground">
                    Average organizer earnings
                  </p>
                </div>
              </div>

              <Link href="/create">
                <Button size="lg" data-testid="button-start-organizing">
                  Start Organizing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Organizer Dashboard</h3>
                  <span className="text-sm text-muted-foreground">
                    This month
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">12,500</p>
                    <p className="text-sm text-muted-foreground">
                      Total Revenue
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Events</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-sm text-muted-foreground">Attendees</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-1">
                      <p className="text-2xl font-bold">4.9</p>
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg flex items-end p-4">
                  <div className="flex-1 space-y-1">
                    {[60, 80, 45, 90, 70, 85, 95].map((h, i) => (
                      <div key={i} className="flex items-end gap-1 h-4">
                        <div
                          className="bg-primary rounded-t w-full"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Explore by Interest
            </h2>
            <p className="text-muted-foreground">
              Find communities that match your passions
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Link key={category.id} href={`/events?category=${category.id}`}>
                <CategoryPill
                  categoryId={category.id}
                  categoryName={category.name}
                  size="lg"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4">
              <Shield className="h-4 w-4" />
              Safety First
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Your Safety is Our Priority
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We've built multiple layers of trust and safety into the platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyFeatures.map((feature) => (
              <Card key={feature.title} className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <feature.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Real Stories, Real Connections
            </h2>
            <p className="text-muted-foreground">
              Hear from our community members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <StarRating rating={testimonial.rating} showCount={false} />
                <p className="mt-4 text-muted-foreground italic">
                  "{testimonial.quote}"
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Start Building Your Community Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of people who have found their tribe through Garum.
            Your community is waiting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/events">
              <Button
                size="lg"
                className="text-base px-8"
                data-testid="button-discover-events-cta"
              >
                Discover Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/create">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8"
                data-testid="button-create-event-cta"
              >
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
