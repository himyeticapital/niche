import { useQuery } from "@tanstack/react-query";
import { type Event } from "@shared/schema";
interface EventsByPreferenceResponse {
  success: boolean;
  data: Event[];
  count: number;
}
const useEventsByPreference = () => {
  return useQuery<EventsByPreferenceResponse>({
    queryKey: ["events-by-preference"],
    queryFn: async () => {
      const response = await fetch("/api/events/recommended");
      if (!response.ok) {
        let message = response.statusText;
        try {
          const data = await response.json();
          message = data.message || JSON.stringify(data);
        } catch {
          const text = await response.text();
          if (text) message = text;
        }
        throw new Error(message);
      }
      return response.json();
    },
    staleTime: Infinity,
  });
};

export default useEventsByPreference;
