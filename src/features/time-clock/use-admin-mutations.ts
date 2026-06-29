import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

type CreateEmployeeInput = {
  email: string;
  fullName: string;
  position: string;
};

type CreateWorkSiteInput = {
  latitude: number;
  longitude: number;
  name: string;
  radiusMeters: number;
};

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, fullName, position }: CreateEmployeeInput) => {
      const { error } = await supabase.from("employees").insert({
        email,
        full_name: fullName,
        position,
        status: "active",
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-clock-dashboard"] });
    },
  });
}

export function useCreateWorkSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ latitude, longitude, name, radiusMeters }: CreateWorkSiteInput) => {
      const { error } = await supabase.from("work_sites").insert({
        latitude,
        longitude,
        name,
        radius_meters: radiusMeters,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-clock-dashboard"] });
    },
  });
}
