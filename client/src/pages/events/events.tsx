import { CategoryPill } from "@/components/category-pill";
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import useEventsByPreference, {
  EventsByPreferenceResponse,
} from "@/hooks/events/use-events-by-preference";
import useGetEvents from "@/hooks/events/use-get-events";
import { type Event } from "@shared/schema";
import { categories } from "@shared/utils/constants";
import {
  Grid3X3,
  Info,
  List,
  Loader2,
  Map,
  MapPin,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { EventFiltersSheet } from "./components/EventFiltersSheet";
import { EventFiltersWrapper } from "./components/EventFiltersWrapper";
import { EventSkeletonGrid } from "./components/EventSkeletonGrid";
import { useDebounce } from "@/hooks/common/useDebounce";
import EventsMapView from "./components/EventsMapView";
import { MapMarker } from "@/types/map";
const initialFilterState = {
  searchQuery: "",
  category: "",
  maxDistance: [5],
  priceRange: [0],
  sortBy: "date",
  organizerRating: 0,
  ageRequirement: 0,
  fromDate: "",
  toDate: "",
  startTime: "",
};
export default function EventsPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialCategory = searchParams.get("category") || "";
  const [paginationState, setPaginationState] = useState({
    limit: 10,
    offset: 0,
  });
  const [filters, setFilters] = useState({
    ...initialFilterState,
    category: initialCategory,
  });

  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
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
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
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
        { timeout: 5000, enableHighAccuracy: false },
      );
    }
  }, []);

  const debouncedSearchQuery = useDebounce<string>(filters.searchQuery, 300);
  const debouncedPriceRange = useDebounce<number[]>(filters.priceRange, 300);
  const debouncedMaxDistance = useDebounce<number[]>(filters.maxDistance, 300);
  const { data: eventsData, isLoading } = useGetEvents({
    searchQuery: debouncedSearchQuery,
    category: filters.category,
    maxDistance: debouncedMaxDistance,
    priceRange: debouncedPriceRange,
    sortBy: filters.sortBy,
    organizerRating: filters.organizerRating,
    ageRequirement:
      filters.ageRequirement === 0 ? undefined : filters.ageRequirement,
    fromDate: filters.fromDate,
    toDate: filters.toDate,
    startTime: filters.startTime,
    limit: paginationState.limit,
    offset: paginationState.offset,
  });

  const { data: recommendedEvents, isLoading: isLoadingRecommended } =
    useEventsByPreference();

  const mapMarkers: MapMarker[] = useMemo(() => {
    if (!eventsData) return [];
    return eventsData.data.map((event) => ({
      geocode: [event.latitude, event.longitude],
      title: event.title,
    }));
  }, [eventsData]);

  function handleFilterChange(type: string, value: any) {
    setFilters((prev) => ({ ...prev, [type]: value }));
  }

  const clearFilters = () => {
    setFilters(initialFilterState);
  };

  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    Boolean(filters.category) ||
    filters.maxDistance[0] !== 5 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 2000;

  function handleNextPage() {
    setPaginationState((prev) => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }));
  }

  function handlePrevPage() {
    setPaginationState((prev) => ({
      ...prev,
      offset: prev.offset - prev.limit,
    }));
  }

  const isNextActive =
    paginationState.offset + paginationState.limit >=
    (eventsData?.totalRows || 0);
  const isPrevActive = paginationState.offset === 0;

  return (
    <div className="min-h-screen pb-16">
      <EventFiltersWrapper>
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events, locations, or activities..."
                className="pl-9"
                value={filters.searchQuery}
                onChange={(e) =>
                  handleFilterChange("searchQuery", e.target.value)
                }
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
                ({filters.maxDistance[0]}km)
              </span>
            </Button>

            {/* Filters Sheet */}
            <EventFiltersSheet
              filters={filters}
              categories={categories}
              handleFilterChange={handleFilterChange}
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
            />

            {/* Sort */}
            <SortFilter
              value={filters.sortBy}
              onChange={(value) => handleFilterChange("sortBy", value)}
            />

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
          <div className="mt-4 -mx-4 px-4 overflow-x-auto custom-scrollbar">
            <div className="flex gap-2 pb-2">
              <CategoryPill
                categoryId="all"
                categoryName="All"
                selected={!filters.category}
                onClick={() => handleFilterChange("category", "")}
                showIcon={false}
              />
              {categories.map((category) => (
                <CategoryPill
                  key={category.id}
                  categoryId={category.id}
                  categoryName={category.name}
                  selected={filters.category === category.id}
                  onClick={() => handleFilterChange("category", category.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </EventFiltersWrapper>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Events Grid/List */}
        {isLoading ? (
          <EventSkeletonGrid viewMode={viewMode} count={6} />
        ) : eventsData?.data.length === 0 ? (
          <NoEvents clearFilters={clearFilters} />
        ) : viewMode === "map" ? (
          <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center">
            <EventsMapView markers={mapMarkers} />
          </div>
        ) : (
          <>
            {/* Recommended Events */}
            {recommendedEvents && recommendedEvents.data.length > 0 && (
              <RecommendedEvents
                viewMode={viewMode}
                recommendedEvents={recommendedEvents}
              />
            )}
            {/* Filtered Events */}
            <FilteredEvents
              viewMode={viewMode}
              filteredEvents={eventsData?.data || []}
              totalEventsCount={eventsData?.totalRows || 0}
              isLoading={isLoading}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              isPrevActive={isPrevActive}
              isNextActive={isNextActive}
            />
          </>
        )}
      </div>
    </div>
  );
}

const FilteredEvents = ({
  viewMode,
  filteredEvents,
  totalEventsCount = 0,
  isLoading = false,
  onNextPage,
  onPrevPage,
  isNextActive = true,
  isPrevActive = true,
}: {
  isLoading: boolean;
  viewMode: string;
  filteredEvents: Event[];
  totalEventsCount: number;
  currentPage?: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  isNextActive: boolean;
  isPrevActive: boolean;
}) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          All Events
        </h2>
        <Pagination className="flex justify-center" unstyled>
          <PaginationContent>
            {/* Prev */}
            <PaginationItem>
              <PaginationPrevious
                onClick={onPrevPage}
                isActive={isPrevActive}
              />
            </PaginationItem>
            {/* Next */}
            <PaginationItem>
              <PaginationNext onClick={onNextPage} isActive={isNextActive} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      {/* Results Count */}
      <div className="flex items-center justify-between my-6">
        <p className="text-muted-foreground">
          {isLoading ? (
            <Skeleton className="h-5 w-32" />
          ) : (
            `${totalEventsCount} events found`
          )}
        </p>
      </div>

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
    </div>
  );
};

const RecommendedEvents = ({
  viewMode,
  recommendedEvents,
}: {
  viewMode: string;
  recommendedEvents: EventsByPreferenceResponse;
}) => {
  return (
    <div>
      <div className="flex items-center gap-1 mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Recommended Events
        </h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={"ghost"}
              size={"icon"}
              className="rounded-full "
              aria-label="Info about recommended events"
            >
              <Info className="h-1 w-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-xs text-sm" align="start">
            Recommended based on your preferences. Update them anytime from your
            profile for better results.
          </PopoverContent>
        </Popover>
      </div>
      <div
        className={
          viewMode === "list"
            ? "space-y-4"
            : "flex gap-4 overflow-x-auto pb-2 mb-6 custom-scrollbar scroll-smooth"
        }
      >
        {recommendedEvents.data.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            variant={viewMode === "list" ? "list" : "compact"}
          />
        ))}
      </div>
    </div>
  );
};

const NoEvents = ({ clearFilters }: { clearFilters: () => void }) => {
  return (
    <div className="text-center py-16">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        {/* No events icon */}
      </div>
      <h3 className="text-lg font-semibold mb-2">No events found</h3>
      <p className="text-muted-foreground mb-4">
        Try adjusting your filters or search query
      </p>
      <button className="btn btn-outline" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  );
};

function SortFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
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
  );
}
