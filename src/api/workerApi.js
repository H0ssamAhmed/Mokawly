import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "@tanstack/react-query";



export function useWorkers() {
  const convex = useConvex();
  return useQuery({
    queryKey: ['getWorkers'],
    queryFn: async () => await convex.query(api.worker.getWorkers),
  });
}

export function useAddWorker() {
  const convex = useConvex();
  return useMutation({
    mutationKey: ['addWorker'],
    mutationFn: async ({ worker }) => {
      const res = await convex.mutation(api.worker.addWorker, { ...worker })
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ['getWorkers'] });

      }

    },

  });
}