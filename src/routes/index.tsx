import { createFileRoute } from "@tanstack/react-router";

import { TimeClockDashboard } from "@/features/time-clock/TimeClockDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Controle de Ponto T2A" },
      {
        name: "description",
        content: "Sistema interno para registro e acompanhamento de ponto da equipe T2A.",
      },
      { property: "og:title", content: "Controle de Ponto T2A" },
      {
        property: "og:description",
        content: "Registro de entrada, saida, geolocalizacao e acompanhamento administrativo.",
      },
    ],
  }),
  component: TimeClockDashboard,
});
