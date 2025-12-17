import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesUpdate } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type Trial = Tables<"trials">;
type TrialUpdate = TablesUpdate<"trials">;

// Query Keys
export const TRIALS_QUERY_KEYS = {
  all: ["trials"] as const,
  lists: () => [...TRIALS_QUERY_KEYS.all, "list"] as const,
  list: () => [...TRIALS_QUERY_KEYS.lists()] as const,
  detail: (id: string) => [...TRIALS_QUERY_KEYS.all, "detail", id] as const,
};

export function useTrials() {
  return useQuery({
    queryKey: TRIALS_QUERY_KEYS.list(),
    queryFn: async (): Promise<Trial[]> => {
      const { data, error } = await supabase
        .from("trials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useUpdateTrial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    Trial, // returned data type
    Error, // error type
    { trialId: string; updates: TrialUpdate }, // variables type
    { previousTrials?: Trial[] } // context type
  >({
    mutationFn: async ({ trialId, updates }) =>
      supabase
        .from("trials")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", trialId)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        }),

    // Optimistic update
    onMutate: async ({ trialId, updates }) => {
      await queryClient.cancelQueries({ queryKey: TRIALS_QUERY_KEYS.lists() });

      const previousTrials = queryClient.getQueryData<Trial[]>(
        TRIALS_QUERY_KEYS.lists()
      );

      // Optimistically update the list cache
      if (previousTrials) {
        queryClient.setQueryData<Trial[]>(TRIALS_QUERY_KEYS.lists(), (old) =>
          old?.map((t) =>
            t.id === trialId ? { ...t, ...updates } : t
          )
        );
      }

      return { previousTrials };
    },

    // Rollback if error
    onError: (err, variables, context) => {
      if (context?.previousTrials) {
        queryClient.setQueryData(TRIALS_QUERY_KEYS.lists(), context.previousTrials);
      }
      console.error("Error updating trial:", err);
      toast({
        title: "Error",
        description: "Failed to update trial. Please try again.",
        variant: "destructive",
      });
    },

    // On success, sync caches and show toast
    onSuccess: (updatedTrial) => {
      // Update detail cache
      queryClient.setQueryData(
        TRIALS_QUERY_KEYS.detail(updatedTrial.id),
        updatedTrial
      );

      // Invalidate lists to refetch fresh data
      queryClient.invalidateQueries({ queryKey: TRIALS_QUERY_KEYS.lists() });

      toast({
        title: "Trial updated",
        description: "The trial has been successfully updated.",
      });
    },
  });
}


// export interface Trial {
//   id: string;
//   name: string;
//   created_at: string;
//   // Add other trial fields as needed
// }

// export function useTrials() {
//   return useQuery({
//     queryKey: ["trials"],
//     queryFn: async (): Promise<Trial[]> => {
//       const { data, error } = await supabase
//         .from("trials")
//         .select("id, name, created_at")
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       return data || [];
//     },
//   });
// }


