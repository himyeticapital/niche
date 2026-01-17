import { EventCard } from "@/components/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import useEventsByPreference, {
  EventsByPreferenceResponse,
} from "@/hooks/events/use-events-by-preference";
import { type Event } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { EventFilters } from "./components/EventFilters";
import { EventSkeletonGrid } from "./components/EventSkeletonGrid";
import useGetEvents from "@/hooks/events/use-get-events";
import usePagination from "@/hooks/common/usePagination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function EventsPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialCategory = searchParams.get("category") || "";
  const [paginationState, setPaginationState] = useState({
    limit: 10,
    offset: 0,
  });
  console.log("🚀 ~ EventsPage ~ paginationState:", paginationState);
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

  const { data: eventsData, isLoading } = useGetEvents({
    limit: paginationState.limit,
    offset: paginationState.offset,
  });

  const { data: recommendedEvents, isLoading: isLoadingRecommended } =
    useEventsByPreference();

  // const filteredEvents = events
  //   .filter((event) => {
  //     if (selectedCategory && event.category !== selectedCategory) return false;
  //     if (searchQuery) {
  //       const query = searchQuery.toLowerCase();
  //       if (
  //         !event.title.toLowerCase().includes(query) &&
  //         !event.description.toLowerCase().includes(query) &&
  //         !event.locationName.toLowerCase().includes(query)
  //       ) {
  //         return false;
  //       }
  //     }
  //     if (event.price! < priceRange[0] || event.price! > priceRange[1]) {
  //       return false;
  //     }
  //     return true;
  //   })
  //   .sort((a, b) => {
  //     switch (sortBy) {
  //       case "date":
  //         return new Date(a.date).getTime() - new Date(b.date).getTime();
  //       case "price-low":
  //         return (a.price || 0) - (b.price || 0);
  //       case "price-high":
  //         return (b.price || 0) - (a.price || 0);
  //       case "rating":
  //         return (b.rating || 0) - (a.rating || 0);
  //       case "distance":
  //         return Math.random() - 0.5;
  //       default:
  //         return 0;
  //     }
  //   });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMaxDistance([5]);
    setPriceRange([0, 2000]);
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(selectedCategory) ||
    maxDistance[0] !== 5 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 2000;

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
  console.log("🚀 ~ EventsPage ~ disablePrevPage:", isPrevActive);

  return (
    <div className="min-h-screen pb-16">
      <EventFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        userLocation={userLocation}
        isDetectingLocation={isDetectingLocation}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Recommended Events */}
        {recommendedEvents && recommendedEvents.data.length > 0 && (
          <RecommendedEvents
            viewMode={viewMode}
            recommendedEvents={recommendedEvents}
          />
        )}

        {/* Events Grid/List */}
        {isLoading ? (
          <EventSkeletonGrid viewMode={viewMode} count={6} />
        ) : eventsData?.data.length === 0 ? (
          <NoEvents clearFilters={clearFilters} />
        ) : viewMode === "map" ? (
          <div className="relative h-[600px] bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              {/* Map view coming soon icon */}
              <p className="text-muted-foreground">Map view coming soon</p>
              <p className="text-sm text-muted-foreground mt-2">
                {eventsData?.data.length} events in this area
              </p>
            </div>
          </div>
        ) : (
          <FilteredEvents
            viewMode={viewMode}
            filteredEvents={eventsData?.data || []}
            isLoading={isLoading}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            isPrevActive={isPrevActive}
            isNextActive={isNextActive}
          />
        )}
      </div>
    </div>
  );
}

const FilteredEvents = ({
  viewMode,
  filteredEvents,
  isLoading = false,
  onNextPage,
  onPrevPage,
  isNextActive = true,
  isPrevActive = true,
}: {
  isLoading: boolean;
  viewMode: string;
  filteredEvents: Event[];
  currentPage?: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  isNextActive: boolean;
  isPrevActive: boolean;
}) => {
  console.log("🚀 ~ FilteredEvents ~ isNextDisabled:", isNextActive);
  console.log("🚀 ~ FilteredEvents ~ isPrevDisabled:", isPrevActive);
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Recommended Events
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
            `${filteredEvents.length} events found`
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
      <h2 className="text-2xl font-bold mb-4 tracking-tight text-white">
        Recommended Events
      </h2>
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
