import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, Loader2, LogIn, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: AuthPage,
});

function AuthPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect when authenticated
  useEffect(() => {
    if (auth.isLoading || !auth.user) return;
    const target =
      search.redirect && search.redirect.startsWith("/") && !search.redirect.startsWith("/auth")
        ? search.redirect
        : auth.isAdmin
          ? "/admin"
          : "/ponto";
    navigate({ to: target, replace: true });
  }, [auth.isLoading, auth.user, auth.isAdmin, search.redirect, navigate]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await auth.signIn(email.trim(), password);
      toast.success("Bem-vindo de volta!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao entrar.";
      toast.error("Não foi possível entrar", { description: message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative grid min-h-screen w-full grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <section className="relative hidden overflow-hidden border-r border-border bg-card lg:flex">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 30% 20%, color-mix(in oklab, var(--primary) 30%, transparent), transparent 70%), radial-gradient(ellipse 50% 40% at 80% 90%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%)",
          }}
        />
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-10">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-foreground">Ponto T2A</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <h2 className="text-balance text-4xl font-semibold tracking-tight">
              Controle de ponto, <span className="text-gradient-primary">simples e elegante.</span>
            </h2>
            <p className="max-w-md text-base text-muted-foreground">
              Acompanhe presenças, registros, geolocalização e produtividade da equipe em um
              único painel pensado para a sua operação.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4">
              {[
                { icon: ShieldCheck, label: "Geofence inteligente" },
                { icon: Sparkles, label: "Dashboards em tempo real" },
                { icon: Clock, label: "Registro em 1 toque" },
                { icon: LogIn, label: "Acesso por perfil" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2 text-sm text-muted-foreground backdrop-blur"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} T2A Educação — Sistema interno
          </div>
        </div>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <span className="font-medium">Ponto T2A</span>
            </div>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">Entrar na sua conta</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesse com o e-mail e senha fornecidos pela administração.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Entrando...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Entrar
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-xs text-muted-foreground">
            Não tem acesso? Solicite credenciais ao administrador do sistema.
          </p>
        </motion.div>
      </section>
    </main>
  );
}

// Avoid unused import lint
export { redirect };
