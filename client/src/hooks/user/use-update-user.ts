import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface UseUpdateUserParams {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const useUpdateUser = ({ onSuccess, onError }: UseUpdateUserParams) => {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/user", data);
      return response;
    },
    onSuccess: onSuccess,
    onError: onError,
  });
};

export default useUpdateUser;
