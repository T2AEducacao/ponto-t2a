import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/admin/locais")({
  component: () => (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Locais (Geofence)</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie os locais autorizados para registro de ponto.
        </p>
      </header>
      <Card className="surface-elevated">
        <CardHeader>
          <CardTitle>Em breve</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Mapa interativo e cadastro de áreas permitidas serão adicionados na próxima fase.
        </CardContent>
      </Card>
    </div>
  ),
});
