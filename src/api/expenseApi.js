import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "@tanstack/react-query";



export function useWorkerExpenses() {
  const convex = useConvex();
  return useQuery({
    queryKey: ['workerExpenses'],
    queryFn: async () => await convex.query(api.expenses.getWorkerExpenses),
  });
}
export function useJobExpenses() {
  const convex = useConvex();
  return useQuery({
    queryKey: ['jobExpenses'],
    queryFn: async () => await convex.query(api.expenses.getJobExpenses),
  });
}
