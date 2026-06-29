import {
  AlertTriangle,
  CalendarDays,
  Clock3,
  Download,
  Filter,
  LogIn,
  LogOut,
  MapPin,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  Users,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

import {
  attendanceSeries as mockAttendanceSeries,
  clockRecords as mockClockRecords,
  employees as mockEmployees,
  entryDistribution as mockEntryDistribution,
  workSites as mockWorkSites,
} from "./mock-data";
import {
  formatWorkedTime,
  getClockEventLabel,
  getLocationStatusLabel,
} from "./time-utils";
import type {
  AttendanceSeriesPoint,
  ClockRecord,
  Employee,
  HourDistributionPoint,
  LocationStatus,
  WorkSite,
} from "./types";
import { useAuth } from "./use-auth";
import { getNextClockEvent, useClockRegistration } from "./use-clock-registration";
import { useTimeClockData } from "./use-time-clock-data";

type DashboardData = {
  employees: Employee[];
  workSites: WorkSite[];
  clockRecords: ClockRecord[];
  attendanceSeries: AttendanceSeriesPoint[];
  entryDistribution: HourDistributionPoint[];
  source: "mock" | "supabase";
};

const fallbackDashboardData: DashboardData = {
  employees: mockEmployees,
  workSites: mockWorkSites,
  clockRecords: mockClockRecords,
  attendanceSeries: mockAttendanceSeries,
  entryDistribution: mockEntryDistribution,
  source: "mock",
};

export function TimeClockDashboard() {
  const auth = useAuth();
  const timeClockQuery = useTimeClockData();
  const dashboardData = timeClockQuery.data ?? fallbackDashboardData;
  const currentEmployee =
    dashboardData.employees.find((employee) => employee.userId === auth.user?.id) ??
    dashboardData.employees[0] ??
    mockEmployees[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <AppHeader
          employees={dashboardData.employees}
          source={dashboardData.source}
          userEmail={auth.user?.email}
          onSignOut={auth.signOut}
          workSites={dashboardData.workSites}
        />

        <Tabs defaultValue="admin" className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
            <TabsList className="grid h-11 w-full grid-cols-2 rounded-md bg-muted p-1 md:w-[340px]">
              <TabsTrigger value="admin" className="rounded-sm">
                Administrador
              </TabsTrigger>
              <TabsTrigger value="employee" className="rounded-sm">
                Funcionário
              </TabsTrigger>
            </TabsList>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>

          <TabsContent value="admin" className="m-0">
            <AdminDashboard data={dashboardData} />
          </TabsContent>
          <TabsContent value="employee" className="m-0">
            <EmployeeDashboard
              clockRecords={dashboardData.clockRecords}
              employee={currentEmployee}
              entryDistribution={dashboardData.entryDistribution}
              isAuthLoading={auth.isLoading}
              sessionUserId={auth.user?.id}
              signIn={auth.signIn}
              workSites={dashboardData.workSites}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function AppHeader({
  employees,
  onSignOut,
  source,
  userEmail,
  workSites,
}: {
  employees: Employee[];
  onSignOut: () => Promise<void>;
  source: DashboardData["source"];
  userEmail?: string;
  workSites: WorkSite[];
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const activeEmployees = employees.filter((employee) => employee.status === "active");

  return (
    <header className="flex flex-col gap-4 rounded-md border border-border bg-card px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Controle interno T2A
        </div>
        <h1 className="mt-1 text-2xl font-semibold text-foreground md:text-3xl">
          Controle de ponto
        </h1>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <HeaderStat label="Agora" value="10:15" />
          <HeaderStat label="Hoje" value="29/06" />
          <HeaderStat label="Ativos" value={String(activeEmployees.length)} />
          <HeaderStat label="Locais" value={String(workSites.length)} />
        </div>
        <Badge variant="secondary">{source === "supabase" ? "Supabase" : "Demo"}</Badge>
        {userEmail ? (
          <Button size="sm" variant="outline" onClick={() => void onSignOut()}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        ) : null}
        <Button
          aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
          size="icon"
          variant="outline"
          onClick={toggleTheme}
          title={isDark ? "Modo claro" : "Modo escuro"}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}

function HeaderStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-24 rounded-md border border-border bg-background px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-base font-semibold text-foreground">{value}</div>
    </div>
  );
}

function AdminDashboard({ data }: { data: DashboardData }) {
  const activeEmployees = data.employees.filter((employee) => employee.status === "active");
  const presentEmployees = activeEmployees.filter((employee) => employee.dayStatus === "present");
  const pendingEntryEmployees = activeEmployees.filter(
    (employee) => employee.dayStatus === "pending-entry",
  );
  const missingExitEmployees = activeEmployees.filter(
    (employee) => employee.dayStatus === "missing-exit",
  );
  const locationSummary = [
    {
      name: "Dentro",
      value: data.clockRecords.filter((record) => record.locationStatus === "inside").length,
      color: "#16a34a",
    },
    {
      name: "Fora",
      value: data.clockRecords.filter((record) => record.locationStatus === "outside").length,
      color: "#dc2626",
    },
    {
      name: "Sem local",
      value: data.clockRecords.filter((record) => record.locationStatus === "unavailable").length,
      color: "#94a3b8",
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Funcionários presentes"
          value={String(presentEmployees.length)}
          helper={`${pendingEntryEmployees.length} ainda sem entrada`}
          tone="green"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Funcionários ausentes"
          value={String(pendingEntryEmployees.length)}
          helper={`${missingExitEmployees.length} com saída pendente`}
          tone="amber"
        />
        <MetricCard
          icon={Clock3}
          label="Registros hoje"
          value={String(data.clockRecords.length)}
          helper="Atualização em tempo real"
          tone="blue"
        />
        <MetricCard
          icon={MapPin}
          label="Alertas de localização"
          value={String(locationSummary[1].value + locationSummary[2].value)}
          helper="Fora da área ou sem local"
          tone="red"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.9fr]">
        <Card className="rounded-md shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4 p-5">
            <div>
              <CardTitle className="text-base">Presença por dia</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Resumo dos últimos dias úteis.</p>
            </div>
            <Badge variant="secondary">Semana</Badge>
          </CardHeader>
          <CardContent className="h-72 p-5 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.attendanceSeries} margin={{ left: -24, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="presentes" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="presentes"
                  stroke="#16a34a"
                  fill="url(#presentes)"
                  strokeWidth={2}
                />
                <Area type="monotone" dataKey="ausentes" stroke="#f59e0b" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-sm">
          <CardHeader className="p-5">
            <CardTitle className="text-base">Geolocalização</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Dentro x fora da área permitida.</p>
          </CardHeader>
          <CardContent className="grid gap-5 p-5 pt-0">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={locationSummary} dataKey="value" innerRadius={48} outerRadius={72}>
                    {locationSummary.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-2">
              {locationSummary.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <EmployeesTable employees={data.employees} />
        <RecordsTable clockRecords={data.clockRecords} />
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  tone,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  helper: string;
  tone: "green" | "amber" | "blue" | "red";
}) {
  const toneClass = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    blue: "bg-sky-50 text-sky-700 border-sky-100",
    red: "bg-rose-50 text-rose-700 border-rose-100",
  }[tone];

  return (
    <Card className="rounded-md shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
        </div>
        <div className={cn("rounded-md border p-2", toneClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmployeesTable({ employees }: { employees: Employee[] }) {
  return (
    <Card className="rounded-md shadow-sm">
      <CardHeader className="gap-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Funcionários</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Status, último ponto e horas de hoje.</p>
          </div>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4" />
            Buscar
          </Button>
        </div>
        <Input placeholder="Pesquisar funcionário" className="h-10" />
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hoje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-xs text-muted-foreground">{employee.role}</div>
                </TableCell>
                <TableCell>
                  <EmployeeStatusBadge employee={employee} />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{formatWorkedTime(employee.todayWorkedMinutes)}</div>
                  <div className="text-xs text-muted-foreground">{employee.lastClockLabel}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function EmployeeStatusBadge({ employee }: { employee: Employee }) {
  if (employee.status === "inactive") {
    return <Badge variant="secondary">Inativo</Badge>;
  }

  const variants: Record<Employee["dayStatus"], string> = {
    present: "border-emerald-200 bg-emerald-50 text-emerald-700",
    absent: "border-slate-200 bg-slate-50 text-slate-700",
    "pending-entry": "border-amber-200 bg-amber-50 text-amber-700",
    "missing-exit": "border-rose-200 bg-rose-50 text-rose-700",
  };

  const labels: Record<Employee["dayStatus"], string> = {
    present: "Presente",
    absent: "Ausente",
    "pending-entry": "Sem entrada",
    "missing-exit": "Saída pendente",
  };

  return (
    <Badge className={cn("border", variants[employee.dayStatus])}>
      {labels[employee.dayStatus]}
    </Badge>
  );
}

function RecordsTable({ clockRecords }: { clockRecords: ClockRecord[] }) {
  return (
    <Card className="rounded-md shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-5">
        <div>
          <CardTitle className="text-base">Registros recentes</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Pontos com localização, dispositivo e IP.</p>
        </div>
        <Button variant="outline" size="sm">
          <CalendarDays className="h-4 w-4" />
          Período
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead>Localização</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clockRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <div className="font-medium">{record.employeeName}</div>
                  <div className="text-xs text-muted-foreground">{record.device}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{getClockEventLabel(record.type)}</div>
                  <div className="text-xs text-muted-foreground">
                    {record.date} às {record.time}
                  </div>
                </TableCell>
                <TableCell>
                  <LocationBadge status={record.locationStatus} />
                  <div className="mt-1 max-w-48 truncate text-xs text-muted-foreground">
                    {record.approximateAddress}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function LocationBadge({ status }: { status: LocationStatus }) {
  const classes: Record<LocationStatus, string> = {
    inside: "border-emerald-200 bg-emerald-50 text-emerald-700",
    outside: "border-rose-200 bg-rose-50 text-rose-700",
    unavailable: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <Badge className={cn("border", classes[status])}>
      <span className="mr-1.5 h-2 w-2 rounded-full bg-current" />
      {getLocationStatusLabel(status)}
    </Badge>
  );
}

function LoginPanel({ signIn }: { signIn: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signIn(email, password);
    } catch {
      setErrorMessage("Não foi possível entrar com essas credenciais.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <Card className="rounded-md shadow-sm">
        <CardHeader className="p-5">
          <CardTitle className="text-base">Entrar como funcionário</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Use seu e-mail corporativo para registrar e acompanhar seus pontos.
          </p>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-medium">
              E-mail
              <Input
                autoComplete="email"
                inputMode="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@t2a.com.br"
                type="email"
                value={email}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Senha
              <Input
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Sua senha"
                type="password"
                value={password}
              />
            </label>
            {errorMessage ? (
              <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}
            <Button className="h-11" disabled={isSubmitting || !email || !password} type="submit">
              <LogIn className="h-4 w-4" />
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-md shadow-sm">
        <CardHeader className="p-5">
          <CardTitle className="text-base">Registro protegido</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Após o login, o botão de ponto captura localização, navegador, dispositivo e valida a
            sequência do dia.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 p-5 pt-0 text-sm text-muted-foreground">
          <div className="rounded-md border border-border p-3">Entrada</div>
          <div className="rounded-md border border-border p-3">Saída para almoço</div>
          <div className="rounded-md border border-border p-3">Volta do almoço</div>
          <div className="rounded-md border border-border p-3">Saída final</div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmployeeDashboard({
  clockRecords,
  employee,
  entryDistribution,
  isAuthLoading,
  sessionUserId,
  signIn,
  workSites,
}: {
  clockRecords: ClockRecord[];
  employee: Employee;
  entryDistribution: HourDistributionPoint[];
  isAuthLoading: boolean;
  sessionUserId?: string;
  signIn: (email: string, password: string) => Promise<void>;
  workSites: WorkSite[];
}) {
  const employeeRecords = clockRecords.filter((record) => record.employeeId === employee.id);
  const nextEventType = getNextClockEvent(employeeRecords);
  const registration = useClockRegistration();
  const workSite = workSites.find((site) => site.id === employee.workSiteId);

  if (isAuthLoading) {
    return (
      <Card className="rounded-md shadow-sm">
        <CardContent className="p-6 text-sm text-muted-foreground">Carregando sessão...</CardContent>
      </Card>
    );
  }

  if (!sessionUserId) {
    return <LoginPanel signIn={signIn} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="grid gap-6">
        <Card className="rounded-md shadow-sm">
          <CardContent className="grid gap-5 p-6">
            <div>
              <p className="text-sm text-muted-foreground">Horário atual</p>
              <div className="mt-1 text-5xl font-semibold">10:15</div>
            </div>
            <Button
              className="h-20 justify-center rounded-md text-lg"
              disabled={registration.isPending || !nextEventType}
              onClick={() =>
                nextEventType
                  ? registration.mutate({
                      employee,
                      nextEventType,
                      userId: sessionUserId,
                      workSite,
                    })
                  : undefined
              }
            >
              <LogIn className="h-6 w-6" />
              {registration.isPending
                ? "Registrando..."
                : nextEventType
                  ? `Registrar ${getClockEventLabel(nextEventType)}`
                  : "Dia completo"}
            </Button>
            {registration.error ? (
              <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                Não foi possível registrar agora. Verifique se a migration foi aplicada e tente novamente.
              </p>
            ) : null}
            {registration.isSuccess ? (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Ponto registrado com sucesso.
              </p>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <MiniInfo label="Último registro" value={employee.lastClockLabel} />
              <MiniInfo label="Horas trabalhadas" value={formatWorkedTime(employee.todayWorkedMinutes)} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-sm">
          <CardHeader className="p-5">
            <CardTitle className="text-base">Distribuição de entradas</CardTitle>
          </CardHeader>
          <CardContent className="h-56 p-5 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={entryDistribution} margin={{ left: -24, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="registros" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6">
        <Card className="rounded-md shadow-sm">
          <CardHeader className="p-5">
            <CardTitle className="text-base">Status do dia</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 p-5 pt-0">
            <TimelineItem icon={LogIn} title="Entrada" value="08:04" status="done" />
            <TimelineItem icon={LogOut} title="Saída para almoço" value="Pendente" status="current" />
            <TimelineItem icon={LogIn} title="Volta do almoço" value="Aguardando" status="pending" />
            <TimelineItem icon={LogOut} title="Saída final" value="Aguardando" status="pending" />
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-sm">
          <CardHeader className="p-5">
            <CardTitle className="text-base">Histórico recente</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 p-5 pt-0">
            {employeeRecords.map((record) => (
              <RecordDetail key={record.id} record={record} />
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}

function TimelineItem({
  icon: Icon,
  title,
  value,
  status,
}: {
  icon: typeof LogIn;
  title: string;
  value: string;
  status: "done" | "current" | "pending";
}) {
  const classes = {
    done: "border-emerald-200 bg-emerald-50 text-emerald-700",
    current: "border-sky-200 bg-sky-50 text-sky-700",
    pending: "border-slate-200 bg-slate-50 text-slate-600",
  }[status];

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
      <div className="flex items-center gap-3">
        <span className={cn("rounded-md border p-2", classes)}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="font-medium">{title}</span>
      </div>
      <span className="text-sm text-muted-foreground">{value}</span>
    </div>
  );
}

function RecordDetail({ record }: { record: ClockRecord }) {
  return (
    <div className="rounded-md border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-medium">{getClockEventLabel(record.type)}</div>
          <div className="text-sm text-muted-foreground">
            {record.date} às {record.time}
          </div>
        </div>
        <LocationBadge status={record.locationStatus} />
      </div>
      <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <span>Precisão: {record.accuracyMeters ? `${record.accuracyMeters}m` : "indisponível"}</span>
        <span>IP: {record.ipAddress}</span>
        <span>Navegador: {record.browser}</span>
        <span>Sistema: {record.operatingSystem}</span>
      </div>
    </div>
  );
}
