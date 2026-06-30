import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/calendario")({
  component: () => (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Calendário</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visualize seus dias trabalhados.
        </p>
      </header>
      <Card className="surface-elevated">
        <CardHeader>
          <CardTitle>Em breve</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Calendário com heatmap chega na próxima fase.
        </CardContent>
      </Card>
    </div>
  ),
});
