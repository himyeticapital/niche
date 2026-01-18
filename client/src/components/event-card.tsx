import { Link } from "wouter";
import { MapPin, Calendar, Users, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/star-rating";
import { VerifiedBadge } from "@/components/trust-badge";
import { getCategoryIcon } from "@/components/category-pill";
import { cn } from "@/lib/utils";
import type { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
  distance?: number;
  variant?: "default" | "featured" | "list" | "compact";
}

export function EventCard({
  event,
  distance,
  variant = "default",
}: EventCardProps) {
  const CategoryIcon = getCategoryIcon(event.category);
  const isFull = event.currentAttendees! >= event.maxCapacity;
  const spotsLeft = event.maxCapacity - (event.currentAttendees || 0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (variant === "list") {
    return (
      <Link href={`/events/${event.id}`} className={"block"}>
        <Card
          className="overflow-visible hover-elevate transition-transform cursor-pointer"
          data-testid={`event-card-${event.id}`}
        >
          <div className="flex gap-4 p-4">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
              {event.coverImage ? (
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <CategoryIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {event.category}
                  </Badge>
                  {distance !== undefined && (
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />
                      {distance.toFixed(1)}km
                    </span>
                  )}
                </div>
                <h3 className="font-semibold line-clamp-1">{event.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {event.locationName}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {event.price === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Free
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <IndianRupee className="h-3 w-3" />
                      {event.price}
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(event.date)} at {event.time}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/events/${event.id}`}>
        <Card
          className="overflow-visible hover-elevate transition-transform cursor-pointer group w-48"
          data-testid={`event-card-compact-${event.id}`}
        >
          <div className="relative aspect-video overflow-hidden rounded-t-lg bg-muted">
            {event.coverImage ? (
              <img
                src={event.coverImage}
                alt={event.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <CategoryIcon className="h-10 w-10 text-primary/40" />
              </div>
            )}
          </div>
          <CardContent className="p-3 space-y-1">
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight mb-1">
              {event.title}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="line-clamp-1">{event.locationName}</span>
            </p>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(event.date)} at {event.time}
            </span>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/events/${event.id}`}>
      <Card
        className={cn(
          "overflow-visible hover-elevate transition-transform cursor-pointer group",
          variant === "featured" && "md:col-span-2",
        )}
        data-testid={`event-card-${event.id}`}
      >
        <div className="relative aspect-video overflow-hidden rounded-t-lg bg-muted">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <CategoryIcon className="h-16 w-16 text-primary/40" />
            </div>
          )}

          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur-sm"
            >
              <CategoryIcon className="h-3 w-3 mr-1" />
              {event.category}
            </Badge>
          </div>

          {distance !== undefined && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-background/80 backdrop-blur-sm text-foreground font-semibold">
                <MapPin className="h-3 w-3 mr-1" />
                {distance.toFixed(1)}km
              </Badge>
            </div>
          )}

          {event.isFeatured && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-amber-500 text-white">Trending</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
              {event.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="line-clamp-1">{event.locationName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              {event.organizerAvatar ? (
                <AvatarImage
                  src={event.organizerAvatar}
                  alt={event.organizerName}
                />
              ) : null}
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {event.organizerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{event.organizerName}</span>
            {event.organizerVerified && (
              <VerifiedBadge className="h-3.5 w-3.5" />
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(event.date)} at {event.time}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-3">
              <span className="font-semibold">
                {event.price === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Free
                  </span>
                ) : (
                  <span className="flex items-center">
                    <IndianRupee className="h-4 w-4" />
                    {event.price}
                  </span>
                )}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" />
                {event.currentAttendees}/{event.maxCapacity}
              </span>
            </div>
            <StarRating
              rating={event.rating || 0}
              reviewCount={event.reviewCount || 0}
              size="sm"
            />
          </div>

          <Button
            className="w-full"
            variant={isFull ? "secondary" : "default"}
            disabled={isFull}
            data-testid={`button-join-${event.id}`}
          >
            {isFull
              ? "Event Full"
              : spotsLeft <= 5
                ? `Join (${spotsLeft} spots left)`
                : "Join Event"}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
