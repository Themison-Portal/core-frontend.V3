import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesUpdate } from "@/integrations/supabase/types";

export type Trial = Tables<"trials">;
export type TrialUpdate = TablesUpdate<"trials">;

class TrialService {
  async updateTrial(
    trialId: string,
    updates: TrialUpdate
  ): Promise<Trial> {
    const { data, error } = await supabase
      .from("trials")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", trialId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const trialService = new TrialService();
