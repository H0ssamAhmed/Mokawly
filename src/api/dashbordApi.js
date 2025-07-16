import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "@tanstack/react-query";

export function useGetStats() {
  const convex = useConvex();

  return useQuery({
    queryKey: ['getStats'],
    queryFn: async () => await convex.query(api.statistics.getStatistics),
  });
}
