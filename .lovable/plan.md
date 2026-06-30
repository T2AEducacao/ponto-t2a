## Fase 1 — Fundação (auth + layout + navegação + base visual)

Vou estabelecer a base sólida do sistema antes de evoluir dashboards e telas detalhadas em fases futuras.

### 1. Autenticação (Supabase Auth)
- Login com email/senha em `/auth` (rota pública, design dark premium).
- Logout no header.
- Rota `/_authenticated/` protegida (integration-managed gate).
- Hook `useCurrentUser` carregando profile + role (admin/employee) via `has_role`.
- Redirecionamento pós-login conforme role:
  - admin → `/admin` (dashboard)
  - employee → `/ponto` (bater ponto)
- Tela de "primeiro acesso" forçando troca de senha (flag em `profiles`).

### 2. Banco de dados (ajustes mínimos nesta fase)
- Adicionar coluna `must_change_password boolean default true` em `profiles`.
- Adicionar coluna `avatar_url` em `profiles` (placeholder visual).
- Trigger para criar `profiles` automaticamente no signup (vinculando ao `auth.users`).
- Function RPC `admin_create_employee(email, password, full_name, position)` usando service role, restrita a admins via `has_role`. Vincula `employees.user_id` ao `auth.users.id` criado.
- Manter RLS já existente; revisar políticas de `employees` para garantir que admin vê tudo e funcionário vê só o próprio.

### 3. Layout e navegação
- `AppShell` com Sidebar (shadcn) + Topbar.
- Sidebar colapsável, com itens diferentes por role:
  - **Admin:** Dashboard, Funcionários, Registros, Locais (Geofence), Relatórios, Configurações.
  - **Funcionário:** Bater Ponto, Meu Histórico, Calendário, Perfil.
- Topbar: busca global (Command Palette ⌘K placeholder), avatar com menu, indicador de role.
- Breadcrumbs contextuais.
- Empty states e skeletons base reutilizáveis.

### 4. Identidade visual — Dark Premium (Linear/Vercel)
Tokens em `src/styles.css` (`oklch`):
- `--background` #0A0A0B, `--card` #151518, `--border` #1F1F23
- `--primary` violeta #8B5CF6 + `--primary-glow`
- `--foreground` #E4E4E7, `--muted-foreground` #71717A
- Gradientes sutis, shadows elegantes (`--shadow-elegant`), bordas arredondadas (rounded-xl).
- Tipografia: Geist Sans (display + body) via `@fontsource-variable/geist`.
- Animações discretas com framer-motion (fade/slide nos mounts).
- Foco em hierarquia, espaçamento generoso e microinterações.

### 5. Páginas-stub (estrutura pronta, conteúdo evolui nas próximas fases)
- `/admin` — dashboard com 4 KPI cards + skeleton de gráficos.
- `/admin/funcionarios` — tabela básica com dados reais (já existe lógica).
- `/admin/registros` — tabela básica.
- `/admin/locais` — lista de geofences.
- `/ponto` — botão grande de bater ponto + relógio + último registro.
- `/historico` — lista de registros do próprio funcionário.

A página atual `TimeClockDashboard` será reaproveitada/refatorada para alimentar essas rotas.

### Próximas fases (após aprovação desta)
- **Fase 2:** Dashboard admin premium (KPIs, gráficos Recharts, heatmap, timeline).
- **Fase 3:** Fluxo completo de bater ponto + geolocalização + dashboard funcionário.
- **Fase 4:** Página de registros com modal detalhado + mapa + filtros avançados.
- **Fase 5:** Cadastro/edição de funcionários e geofences com drawers.
- **Fase 6:** Relatórios, exportação, command palette funcional, notificações.

### Detalhes técnicos
- Stack mantida: TanStack Start, React 19, Tailwind v4, shadcn, Supabase.
- Server function `admin_create_employee` via `createServerFn` + `requireSupabaseAuth` chamando `supabaseAdmin` após checar role.
- Roteamento: `_authenticated/route.tsx` (gerenciado), com sublayouts `_authenticated/admin.tsx` (gate por role).
- Mapas/gráficos: instalar `recharts` (já presente) e `framer-motion`.

Confirma para eu começar pela Fase 1?
