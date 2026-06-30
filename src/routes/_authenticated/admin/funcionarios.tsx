import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/admin/funcionarios")({
  component: () => (
    <Placeholder
      title="Funcionários"
      description="Cadastre, edite e gerencie funcionários. Em desenvolvimento na próxima fase."
    />
  ),
});

function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>
      <Card className="surface-elevated">
        <CardHeader>
          <CardTitle>Em breve</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Esta seção será construída na próxima fase com tabela moderna, busca, filtros,
          drawer de edição e ações rápidas.
        </CardContent>
      </Card>
    </div>
  );
}
