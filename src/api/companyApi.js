import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "@tanstack/react-query";



export function useCompanies() {
  const convex = useConvex();
  return useQuery({
    queryKey: ['getCompanies'],
    queryFn: async () => await convex.query(api.company.getCompanies),
  });
}
