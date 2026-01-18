import { useQuery } from "@tanstack/react-query";
import { type Event } from "@shared/schema";
import axios from "axios";

export interface EventResponse {
  success: boolean;
  data: Event[];
  totalRows: number;
}

export interface EventFilters {
  searchQuery?: string;
  category?: string;
  maxDistance?: number[];
  priceRange?: number[];
  sortBy?: string;
  organizerRating?: number;
  ageRequirement?: number;
  fromDate?: string;
  toDate?: string;
  startTime?: string;
  limit?: number;
  offset?: number;
}

const useGetEvents = (filters: EventFilters) => {
  return useQuery<EventResponse>({
    queryKey: ["events", filters],
    queryFn: async () => {
      const params: Record<string, any> = { ...filters };
      // Flatten arrays for maxDistance and priceRange if present
      if (filters.maxDistance) params.maxDistance = filters.maxDistance[0];
      if (filters.priceRange) {
        params.minPrice = filters.priceRange[0];
        // params.priceMax = filters.priceRange[1];
        delete params.priceRange;
      }
      const response = await axios.get("/api/events", {
        params,
      });
      return response.data;
    },
  });
};

export default useGetEvents;
