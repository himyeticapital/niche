import { useQuery } from "@tanstack/react-query";
import { Link, Redirect } from "wouter";
import {
  IndianRupee,
  Calendar,
  Users,
  Star,
  TrendingUp,
  Download,
  Plus,
  ChevronRight,
  Eye,
  MoreHorizontal,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Event, DashboardStats, Attendee } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/organizer/dashboard", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/organizer/dashboard?organizerId=${user?.id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return res.json();
    },
    enabled: !!user?.id,
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    enabled: !!user?.id,
  });

  const { data: allAttendees = [] } = useQuery<Attendee[]>({
    queryKey: ["/api/organizer/attendees", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/organizer/attendees?organizerId=${user?.id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch attendees");
      return res.json();
    },
    enabled: !!user?.id,
  });

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect to="/login" replace />;
  }

  // Filter events by the actual logged-in user
  const myEvents = events.filter((e) => e.organizerId === user?.id);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  };

  const metricCards = [
    {
      title: "Total Revenue",
      value: stats?.totalRevenue || 0,
      icon: IndianRupee,
      format: (v: number) => `${v.toLocaleString()}`,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Events",
      value: stats?.totalEvents || 0,
      icon: Calendar,
      format: (v: number) => v.toString(),
      trend: "+3",
      trendUp: true,
    },
    {
      title: "Total Attendees",
      value: stats?.totalAttendees || 0,
      icon: Users,
      format: (v: number) => v.toString(),
      trend: "+24",
      trendUp: true,
    },
    {
      title: "Average Rating",
      value: stats?.averageRating || 0,
      icon: Star,
      format: (v: number) => v.toFixed(1),
      trend: "+0.2",
      trendUp: true,
    },
  ];

  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">
              Organizer Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your events and track your community growth
            </p>
          </div>
          <Link href="/create">
            <Button data-testid="button-create-event">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metricCards.map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="h-5 w-5 text-muted-foreground" />
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      metric.trendUp
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    <TrendingUp className="h-3 w-3" />
                    {metric.trend}
                  </div>
                </div>
                {statsLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl md:text-3xl font-bold">
                    {metric.format(metric.value)}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  {metric.title}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Events Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle>Your Events</CardTitle>
                <Button variant="outline" size="sm" data-testid="button-export-events">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming">
                  <TabsList className="mb-4">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="drafts">Drafts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming">
                    {eventsLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : myEvents.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                          No upcoming events yet
                        </p>
                        <Link href="/create">
                          <Button>Create Your First Event</Button>
                        </Link>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Attendees</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {myEvents.map((event) => (
                            <TableRow key={event.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium line-clamp-1">
                                      {event.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {event.category}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="font-medium">{formatDate(event.date)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {event.time}
                                </p>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {event.currentAttendees}/{event.maxCapacity}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-medium">
                                  {((event.currentAttendees || 0) *
                                    (event.price || 0) *
                                    0.9).toLocaleString()}
                                </span>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                      Cancel Event
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>

                  <TabsContent value="past">
                    <div className="text-center py-8 text-muted-foreground">
                      No past events
                    </div>
                  </TabsContent>

                  <TabsContent value="drafts">
                    <div className="text-center py-8 text-muted-foreground">
                      No draft events
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Revenue Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg flex items-end justify-center p-6">
                  <div className="flex items-end gap-2 w-full max-w-md">
                    {[40, 60, 35, 80, 55, 90, 75, 95, 60, 85, 70, 100].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-primary rounded-t transition-all hover:bg-primary/80"
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                  <span>Jan</span>
                  <span>Dec</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Events hosted</span>
                  <span className="font-semibold">{myEvents.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total attendees</span>
                  <span className="font-semibold">{allAttendees.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Avg per event</span>
                  <span className="font-semibold">
                    {myEvents.length > 0 ? Math.round(allAttendees.length / myEvents.length) : 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Attendees */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-base">Recent Attendees</CardTitle>
              </CardHeader>
              <CardContent>
                {allAttendees.length === 0 ? (
                  <div className="text-center py-4">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No attendees yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allAttendees.slice(0, 4).map((attendee, i) => {
                      const event = myEvents.find(e => e.id === attendee.eventId);
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {attendee.userName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{attendee.userName}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {event?.title || "Event"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phone verified</span>
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email verified</span>
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ID verification</span>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Complete Verification
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
