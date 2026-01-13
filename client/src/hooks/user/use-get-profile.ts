import { useQuery } from "@tanstack/react-query";

const fetchProfile = async () => {
  const res = await fetch("/api/user/profile", {
    credentials: "include",
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.message || JSON.stringify(data);
    } catch {
      const text = await res.text();
      if (text) message = text;
    }
    throw new Error(message);
  }
  return res.json();
};

export function useGetProfile({ staleTime }: { staleTime?: number } = {}) {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: fetchProfile,
    staleTime: staleTime ?? Infinity,
  });
}
