import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/admin/relatorios")({
  component: () => (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Relatórios</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Exporte e visualize relatórios consolidados.
        </p>
      </header>
      <Card className="surface-elevated">
        <CardHeader>
          <CardTitle>Em breve</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Relatórios com exportação CSV/PDF chegarão em fase posterior.
        </CardContent>
      </Card>
    </div>
  ),
});
