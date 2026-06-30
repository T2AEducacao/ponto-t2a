import { createFileRoute, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    // Decide destination based on app_metadata role
    const role = (data.user.app_metadata as { role?: string } | null)?.role;
    throw redirect({ to: role === "admin" ? "/admin" : "/ponto" });
  },
  component: () => null,
});
