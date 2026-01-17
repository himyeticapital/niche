import { useQuery } from "@tanstack/react-query";
import { type Event } from "@shared/schema";
import axios from "axios";

export interface EventResponse {
  success: boolean;
  data: Event[];
  totalRows: number;
}

const useGetEvents = ({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}) => {
  return useQuery<EventResponse>({
    queryKey: ["events", limit, offset],
    queryFn: async () => {
      const response = await axios.get("/api/events", {
        params: {
          ...(limit !== undefined && { limit }),
          ...(offset !== undefined && { offset }),
        },
      });
      return response.data;
    },
  });
};

export default useGetEvents;
