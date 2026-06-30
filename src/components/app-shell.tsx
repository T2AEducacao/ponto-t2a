import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarDays,
  Clock,
  History,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Timer,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

type NavItem = { title: string; to: string; icon: typeof Clock };

const adminNav: NavItem[] = [
  { title: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { title: "Funcionários", to: "/admin/funcionarios", icon: Users },
  { title: "Registros", to: "/admin/registros", icon: Timer },
  { title: "Locais", to: "/admin/locais", icon: MapPin },
  { title: "Relatórios", to: "/admin/relatorios", icon: BarChart3 },
];

const employeeNav: NavItem[] = [
  { title: "Bater ponto", to: "/ponto", icon: Clock },
  { title: "Meu histórico", to: "/historico", icon: History },
  { title: "Calendário", to: "/calendario", icon: CalendarDays },
];

export function AppShell({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const isAdmin = auth.isAdmin;
  const items = isAdmin ? adminNav : employeeNav;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar items={items} isAdmin={isAdmin} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <motion.main
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 px-4 py-6 sm:px-6 lg:px-8"
          >
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar({ items, isAdmin }: { items: NavItem[]; isAdmin: boolean }) {
  const auth = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Clock className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">Ponto T2A</div>
              <div className="truncate text-[11px] text-muted-foreground">
                {isAdmin ? "Painel administrativo" : "Área do funcionário"}
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{isAdmin ? "Administração" : "Operação"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active =
                  item.to === "/admin" || item.to === "/ponto"
                    ? pathname === item.to
                    : pathname.startsWith(item.to);
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.to} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Sistema</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Configurações">
                    <Link to="/admin/configuracoes" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Configurações</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5",
            collapsed && "justify-center",
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
              {initials(auth.profile?.full_name ?? auth.user?.email ?? "?")}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                {auth.profile?.full_name ?? auth.user?.email}
              </div>
              <div className="truncate text-[11px] text-muted-foreground">
                {auth.profile?.email}
              </div>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function Topbar() {
  const auth = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <SidebarTrigger className="-ml-2">
        <Menu className="h-4 w-4" />
      </SidebarTrigger>

      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar funcionários, registros..."
          className="h-9 pl-9"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:flex">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {auth.isAdmin ? (
          <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
            <ShieldCheck className="h-3 w-3" /> Admin
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" /> Funcionário
          </Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
                  {initials(auth.profile?.full_name ?? auth.user?.email ?? "?")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">{auth.profile?.full_name}</div>
              <div className="truncate text-xs text-muted-foreground">{auth.profile?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void handleSignOut()}>
              <LogOut className="h-4 w-4" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
