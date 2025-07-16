import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "@tanstack/react-query";



export function usePayments() {
  const convex = useConvex();
  return useQuery({
    queryKey: ['getPayments'],
    queryFn: async () => await convex.query(api.payment.getAllPayments),
  });
}