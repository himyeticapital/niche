import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link, useSearch } from "wouter";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  Share2,
  Heart,
  Shield,
  ChevronLeft,
  MessageCircle,
  UserPlus,
  CreditCard,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/star-rating";
import { TrustBadge, VerifiedBadge } from "@/components/trust-badge";
import { getCategoryIcon } from "@/components/category-pill";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Event, Review } from "@shared/schema";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ["/api/events", id],
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/events", id, "reviews"],
    enabled: !!id,
  });

  // Handle payment success/cancel from URL params
  useEffect(() => {
    const payment = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (payment === "success" && sessionId) {
      setIsVerifying(true);
      // Verify payment and register attendee
      apiRequest("POST", `/api/events/${id}/verify-payment`, { sessionId })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            queryClient.invalidateQueries({ queryKey: ["/api/events", id] });
            toast({
              title: "Payment successful!",
              description: "You've been registered for this event. See you there!",
            });
          }
        })
        .catch(() => {
          toast({
            title: "Verification issue",
            description: "Your payment went through but we had trouble verifying. Please contact support.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsVerifying(false);
          // Clear URL params
          window.history.replaceState({}, "", `/events/${id}`);
        });
    } else if (payment === "cancelled") {
      toast({
        title: "Payment cancelled",
        description: "No worries! You can try again when you're ready.",
      });
      window.history.replaceState({}, "", `/events/${id}`);
    }
  }, [searchString, id, toast]);

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/events/${id}/checkout`, paymentForm);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast({
        title: "Failed to start checkout",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // For free events, direct join
  const joinMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/events/${id}/join`, {
        userName: paymentForm.userName || "Guest",
        userPhone: paymentForm.userPhone,
        paymentStatus: "completed",
        joinedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events", id] });
      setShowPaymentDialog(false);
      toast({
        title: "Successfully joined!",
        description: "You've been added to the event. See you there!",
      });
    },
    onError: () => {
      toast({
        title: "Failed to join",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleJoinClick = () => {
    if (event?.price === 0) {
      // For free events, show simple dialog then direct join
      setShowPaymentDialog(true);
    } else {
      // For paid events, show payment dialog
      setShowPaymentDialog(true);
    }
  };

  const handleSubmit = () => {
    if (!paymentForm.userName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue.",
        variant: "destructive",
      });
      return;
    }

    if (event?.price === 0) {
      joinMutation.mutate();
    } else {
      if (!paymentForm.userEmail.trim()) {
        toast({
          title: "Email required",
          description: "Please enter your email for payment confirmation.",
          variant: "destructive",
        });
        return;
      }
      checkoutMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-16">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="aspect-video w-full rounded-lg mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event not found</h2>
          <p className="text-muted-foreground mb-4">
            This event may have been removed or doesn't exist.
          </p>
          <Link href="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(event.category);
  const isFull = event.currentAttendees! >= event.maxCapacity;
  const spotsLeft = event.maxCapacity - (event.currentAttendees || 0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Back Button */}
        <Link href="/events">
          <Button variant="ghost" className="mb-6 -ml-2" data-testid="button-back">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Events
          </Button>
        </Link>

        {/* Cover Image */}
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-8">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <CategoryIcon className="h-24 w-24 text-primary/40" />
            </div>
          )}

          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              <CategoryIcon className="h-3 w-3 mr-1" />
              {event.category}
            </Badge>
            {event.isFeatured && (
              <Badge className="bg-amber-500 text-white">Trending</Badge>
            )}
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="icon" variant="secondary" className="bg-background/80 backdrop-blur-sm">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="bg-background/80 backdrop-blur-sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Rating */}
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <StarRating
                  rating={event.rating || 0}
                  reviewCount={event.reviewCount}
                  size="lg"
                />
                <span className="text-muted-foreground flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {event.currentAttendees} joined
                </span>
              </div>
            </div>

            {/* Event Details */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{formatDate(event.date)}</p>
                    <p className="text-muted-foreground">
                      {event.time} ({formatDuration(event.duration)})
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.locationName}</p>
                    <p className="text-muted-foreground">{event.locationAddress}</p>
                    <Button variant="link" className="p-0 h-auto text-primary">
                      View on Map
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {event.currentAttendees}/{event.maxCapacity} attendees
                    </p>
                    <p className="text-muted-foreground">
                      {spotsLeft <= 5 && spotsLeft > 0
                        ? `Only ${spotsLeft} spots left!`
                        : isFull
                        ? "This event is full"
                        : `${spotsLeft} spots available`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Safety Features */}
            {event.bringFriend && (
              <Card className="border-emerald-500/20 bg-emerald-500/5">
                <CardContent className="p-4 flex items-center gap-3">
                  <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="font-medium text-emerald-700 dark:text-emerald-300">
                      Bring a Friend Recommended
                    </p>
                    <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
                      First time attending? Consider bringing a friend for comfort.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Organizer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organizer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    {event.organizerAvatar ? (
                      <AvatarImage
                        src={event.organizerAvatar}
                        alt={event.organizerName}
                      />
                    ) : null}
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {event.organizerName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg">{event.organizerName}</p>
                      {event.organizerVerified && <VerifiedBadge />}
                    </div>
                    <StarRating
                      rating={event.organizerRating || 0}
                      reviewCount={event.organizerReviewCount}
                      size="sm"
                    />
                  </div>
                  <Button variant="outline" data-testid="button-message-organizer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {event.organizerVerified && <TrustBadge type="verified" size="sm" />}
                  <TrustBadge type="responsive" size="sm" />
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Reviews ({reviews.length})
                </h2>
              </div>

              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No reviews yet. Be the first to share your experience!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            {review.userAvatar ? (
                              <AvatarImage
                                src={review.userAvatar}
                                alt={review.userName}
                              />
                            ) : null}
                            <AvatarFallback className="text-sm bg-primary/10 text-primary">
                              {review.userName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold">{review.userName}</p>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <StarRating
                              rating={review.rating}
                              showCount={false}
                              size="sm"
                            />
                            {review.comment && (
                              <p className="mt-2 text-muted-foreground">
                                {review.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Join Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">
                      {event.price === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Free
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <IndianRupee className="h-6 w-6" />
                          {event.price}
                        </span>
                      )}
                    </span>
                    <span className="text-muted-foreground">per person</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDuration(event.duration)}</span>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Spots remaining</span>
                      <span className="font-medium">
                        {spotsLeft}/{event.maxCapacity}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${(event.currentAttendees! / event.maxCapacity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    disabled={isFull || isVerifying}
                    onClick={handleJoinClick}
                    data-testid="button-join-event"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verifying payment...
                      </>
                    ) : isFull ? (
                      "Event Full"
                    ) : event.price === 0 ? (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Join Free Event
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Book Now
                      </>
                    )}
                  </Button>

                  {!isFull && spotsLeft <= 5 && (
                    <p className="text-center text-sm text-amber-600 dark:text-amber-400 font-medium">
                      Only {spotsLeft} spots left!
                    </p>
                  )}

                  <div className="text-center text-xs text-muted-foreground">
                    <p>Free cancellation up to 24 hours before event</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Payment/Registration Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {event?.price === 0 ? (
                <>
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Join Free Event
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 text-primary" />
                  Complete Your Booking
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {event?.price === 0
                ? "Enter your details to reserve your spot."
                : `Pay ${event?.price} to secure your spot at ${event?.title}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Full Name *</Label>
              <Input
                id="userName"
                placeholder="Enter your name"
                value={paymentForm.userName}
                onChange={(e) =>
                  setPaymentForm((prev) => ({ ...prev, userName: e.target.value }))
                }
                data-testid="input-user-name"
              />
            </div>

            {event?.price !== 0 && (
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email *</Label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={paymentForm.userEmail}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({ ...prev, userEmail: e.target.value }))
                  }
                  data-testid="input-user-email"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="userPhone">Phone (optional)</Label>
              <Input
                id="userPhone"
                type="tel"
                placeholder="+91 98765 43210"
                value={paymentForm.userPhone}
                onChange={(e) =>
                  setPaymentForm((prev) => ({ ...prev, userPhone: e.target.value }))
                }
                data-testid="input-user-phone"
              />
            </div>

            {event?.price !== 0 && (
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Event Fee</span>
                  <span className="flex items-center font-semibold">
                    <IndianRupee className="h-4 w-4" />
                    {event?.price}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  You'll be redirected to our secure payment page.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowPaymentDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={checkoutMutation.isPending || joinMutation.isPending}
              data-testid="button-submit-booking"
            >
              {checkoutMutation.isPending || joinMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : event?.price === 0 ? (
                "Confirm Registration"
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Payment
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
