import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface UseUpdateUserParams {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const useUpdateUser = ({ onSuccess, onError }: UseUpdateUserParams) => {
  return useMutation({
    mutationFn: async (data: FormData | Record<string, any>) => {
      let response;
      if (data instanceof FormData) {
        // For FormData, do NOT set Content-Type
        response = await fetch("/api/user", {
          method: "PUT",
          body: data,
          credentials: "include",
        });
      } else {
        // For JSON, stringify and set Content-Type
        response = await fetch("/api/user", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        });
      }

      if (!response.ok) {
        let message = response.statusText;
        try {
          const resData = await response.json();
          message = resData.message || JSON.stringify(resData);
        } catch {
          const text = await response.text();
          if (text) message = text;
        }
        throw new Error(message);
      }
      return response;
    },
    onSuccess: onSuccess,
    onError: onError,
  });
};

export default useUpdateUser;
