import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/admin/registros")({
  component: () => (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Registros</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visualize todos os registros de ponto com filtros e detalhes de localização.
        </p>
      </header>
      <Card className="surface-elevated">
        <CardHeader>
          <CardTitle>Em breve</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Tabela completa com filtros, modal detalhado e mapa virá na próxima fase.
        </CardContent>
      </Card>
    </div>
  ),
});
