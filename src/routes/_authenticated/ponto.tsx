import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, LogIn, LogOut, Sandwich, Utensils } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/ponto")({
  component: PontoPage,
});

function PontoPage() {
  const auth = useAuth();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const date = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const actions = [
    { key: "entry", label: "Entrada", icon: LogIn },
    { key: "lunch_start", label: "Saída almoço", icon: Utensils },
    { key: "lunch_end", label: "Volta almoço", icon: Sandwich },
    { key: "exit", label: "Saída final", icon: LogOut },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-muted-foreground capitalize">{date}</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Olá, {auth.profile?.full_name?.split(" ")[0] ?? ""} 👋
        </h1>
      </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="surface-elevated overflow-hidden">
          <CardContent className="relative p-8 sm:p-12">
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%)",
              }}
            />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <Clock className="h-3 w-3" /> Agora
                </div>
                <div className="mt-2 font-display text-6xl font-semibold tabular-nums tracking-tight sm:text-7xl">
                  {time}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-success/40 text-success">
                    Pronto para bater ponto
                  </Badge>
                </div>
              </div>

              <Button size="lg" className="h-14 px-8 text-base shadow-glow">
                <LogIn className="h-5 w-5" /> Registrar entrada
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((a) => (
          <Button
            key={a.key}
            variant="outline"
            className="h-20 flex-col gap-2 text-sm"
            disabled
          >
            <a.icon className="h-5 w-5" />
            {a.label}
          </Button>
        ))}
      </section>

      <p className="text-xs text-muted-foreground">
        Fluxo completo (geolocalização, validações e histórico em tempo real) chega na próxima fase.
      </p>
    </div>
  );
}
