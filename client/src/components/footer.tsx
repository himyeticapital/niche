import { Link } from "wouter";
import { MapPin, Mail, Shield, CreditCard } from "lucide-react";
import { SiInstagram, SiX, SiFacebook, SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const categories = [
    { href: "/events?category=running", label: "Running" },
    { href: "/events?category=hiking", label: "Hiking" },
    { href: "/events?category=dog-parents", label: "Dog Parents" },
    { href: "/events?category=board-games", label: "Board Games" },
    { href: "/events?category=yoga", label: "Yoga" },
  ];

  const organizer = [
    { href: "/create", label: "Create Event" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "#", label: "Pricing" },
    { href: "#", label: "Success Stories" },
  ];

  const support = [
    { href: "#", label: "Help Center" },
    { href: "#", label: "Safety Guidelines" },
    { href: "#", label: "Community Guidelines" },
    { href: "#", label: "Contact Us" },
  ];

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">Jum</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Combat urban loneliness through hyperlocal niche events. Find your
              community near you and build genuine connections.
            </p>

            <div className="space-y-3">
              <p className="font-medium text-sm">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-xs"
                  data-testid="input-newsletter-email"
                />
                <Button data-testid="button-newsletter-subscribe">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Button size="icon" variant="ghost" data-testid="link-social-instagram">
                <SiInstagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" data-testid="link-social-twitter">
                <SiX className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" data-testid="link-social-facebook">
                <SiFacebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" data-testid="link-social-linkedin">
                <SiLinkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Organizers</h4>
            <ul className="space-y-2">
              {organizer.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {support.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2025 Niche. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Verified Platform</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
