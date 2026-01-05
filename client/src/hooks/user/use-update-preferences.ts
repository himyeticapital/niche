import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface UseUpdatePreferencesParams {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface UserPreferences {
  id?: string;
  categoryPreference: string[] | null;
  minRating: number | null;
  maxRating: number | null;
  lat: number | null;
  lng: number | null;
  radiusKm: number | null;
  price: number | null;
  ageRequirement: string | null;
}

const useUpdatePreferences = ({
  onSuccess,
  onError,
}: UseUpdatePreferencesParams) => {
  return useMutation({
    mutationFn: (params: UserPreferences) => {
      return apiRequest("PUT", "/api/user/preferences", params);
    },
    onSuccess: onSuccess,
    onError: onError,
  });
};

export default useUpdatePreferences;
