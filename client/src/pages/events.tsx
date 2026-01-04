import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Grid3X3,
  List,
  Map,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { EventCard } from "@/components/event-card";
import { CategoryPill } from "@/components/category-pill";
import { Skeleton } from "@/components/ui/skeleton";
import { type Event } from "@shared/schema";
import { categories } from "@shared/utils/constants";

export default function EventsPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialCategory = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxDistance, setMaxDistance] = useState([5]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [sortBy, setSortBy] = useState("date");
  const [userLocation, setUserLocation] = useState({
    name: "Gangtok, Sikkim",
    lat: 27.3314,
    lng: 88.6138,
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setIsDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
            );
            const data = await response.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              "Your Location";
            const state = data.address?.state || "";
            setUserLocation({
              name: state ? `${city}, ${state}` : city,
              lat: latitude,
              lng: longitude,
            });
          } catch {
            setUserLocation({
              name: "Your Location",
              lat: latitude,
              lng: longitude,
            });
          }
          setIsDetectingLocation(false);
        },
        () => {
          setIsDetectingLocation(false);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    }
  }, []);

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const filteredEvents = events
    .filter((event) => {
      if (selectedCategory && event.category !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !event.title.toLowerCase().includes(query) &&
          !event.description.toLowerCase().includes(query) &&
          !event.locationName.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      if (event.price! < priceRange[0] || event.price! > priceRange[1]) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "distance":
          return Math.random() - 0.5;
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMaxDistance([5]);
    setPriceRange([0, 2000]);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory ||
    maxDistance[0] !== 5 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 2000;

  return (
    <div className="min-h-screen pb-16">
      {/* Search Header */}
      <div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events, locations, or activities..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-events"
              />
            </div>

            {/* Location */}
            <Button
              variant="outline"
              className="gap-2"
              data-testid="button-location"
            >
              {isDetectingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{userLocation.name}</span>
              <span className="text-muted-foreground">
                ({maxDistance[0]}km)
              </span>
            </Button>

            {/* Filters Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2"
                  data-testid="button-filters"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      !
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Events</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Distance */}
                  <div className="space-y-3">
                    <Label>Maximum Distance: {maxDistance[0]}km</Label>
                    <Slider
                      value={maxDistance}
                      onValueChange={setMaxDistance}
                      min={1}
                      max={15}
                      step={1}
                      data-testid="slider-distance"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1km</span>
                      <span>15km</span>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label>
                      Price Range: {priceRange[0]} - {priceRange[1]}
                    </Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={2000}
                      step={100}
                      data-testid="slider-price"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Free</span>
                      <span>2000</span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-3">
                    <Label>Category</Label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <CategoryPill
                          key={category.id}
                          categoryId={category.id}
                          categoryName={category.name}
                          selected={selectedCategory === category.id}
                          onClick={() =>
                            setSelectedCategory(
                              selectedCategory === category.id
                                ? ""
                                : category.id
                            )
                          }
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clearFilters}
                      data-testid="button-clear-filters"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="hidden md:flex items-center border rounded-md">
              <Button
                size="icon"
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                onClick={() => setViewMode("grid")}
                data-testid="button-view-grid"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant={viewMode === "list" ? "secondary" : "ghost"}
                onClick={() => setViewMode("list")}
                data-testid="button-view-list"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant={viewMode === "map" ? "secondary" : "ghost"}
                onClick={() => setViewMode("map")}
                data-testid="button-view-map"
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Pills (horizontal scroll) */}
          <div className="mt-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-2">
              <CategoryPill
                categoryId="all"
                categoryName="All"
                selected={!selectedCategory}
                onClick={() => setSelectedCategory("")}
                showIcon={false}
              />
              {categories.map((category) => (
                <CategoryPill
                  key={category.id}
                  categoryId={category.id}
                  categoryName={category.name}
                  selected={selectedCategory === category.id}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.id ? "" : category.id
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              `${filteredEvents.length} events found`
            )}
          </p>
        </div>

        {/* Events Grid/List */}
        {isLoading ? (
          <div
            className={
              viewMode === "list"
                ? "space-y-4"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            }
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : viewMode === "map" ? (
          <div className="relative h-[600px] bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Map view coming soon</p>
              <p className="text-sm text-muted-foreground mt-2">
                {filteredEvents.length} events in this area
              </p>
            </div>
          </div>
        ) : (
          <div
            className={
              viewMode === "list"
                ? "space-y-4"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            }
          >
            {filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                distance={1.2 + index * 0.5}
                variant={viewMode === "list" ? "list" : "default"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
