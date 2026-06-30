import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTimeClockData } from "@/features/time-clock/use-time-clock-data";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const auth = useAuth();
  const { data, isLoading } = useTimeClockData({ enabled: true });

  const activeCount = data?.employees.filter((e) => e.status === "active").length ?? 0;
  const totalRecords = data?.clockRecords.length ?? 0;
  const sitesCount = data?.workSites.length ?? 0;
  const outsideArea =
    data?.clockRecords.filter((r) => r.locationStatus === "outside").length ?? 0;

  const kpis = [
    { label: "Funcionários ativos", value: activeCount, icon: Users, accent: "primary" as const },
    { label: "Registros hoje", value: totalRecords, icon: Activity, accent: "success" as const },
    { label: "Locais cadastrados", value: sitesCount, icon: CheckCircle2, accent: "primary" as const },
    { label: "Fora da área", value: outsideArea, icon: AlertTriangle, accent: "warning" as const },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Olá, {auth.profile?.full_name?.split(" ")[0] ?? "admin"} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumo da operação em tempo real. Use o menu lateral para gerenciar funcionários,
          registros e locais.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Card className="surface-elevated overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {kpi.label}
                  </span>
                  <div
                    className={
                      kpi.accent === "warning"
                        ? "flex h-8 w-8 items-center justify-center rounded-md bg-warning/15 text-warning"
                        : kpi.accent === "success"
                          ? "flex h-8 w-8 items-center justify-center rounded-md bg-success/15 text-success"
                          : "flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary"
                    }
                  >
                    <kpi.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-semibold tabular-nums">
                  {isLoading ? <Skeleton className="h-9 w-16" /> : kpi.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="surface-elevated lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Atividade de hoje</span>
              <Badge variant="outline" className="font-normal">
                Em breve
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <Skeleton className="h-full w-full opacity-40" />
          </CardContent>
        </Card>

        <Card className="surface-elevated">
          <CardHeader>
            <CardTitle>Últimos registros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
              : (data?.clockRecords.slice(0, 5).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{r.employeeName}</div>
                      <div className="text-xs text-muted-foreground">{r.time}</div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {r.type}
                    </Badge>
                  </div>
                )) ?? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Nenhum registro ainda.
                  </div>
                ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
