import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/admin/configuracoes")({
  component: () => (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Preferências do sistema e do espaço de trabalho.
        </p>
      </header>
      <Card className="surface-elevated">
        <CardHeader>
          <CardTitle>Em breve</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Configurações avançadas chegarão em uma próxima fase.
        </CardContent>
      </Card>
    </div>
  ),
});
