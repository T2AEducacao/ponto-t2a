import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

import {
  attendanceSeries,
  clockRecords as mockClockRecords,
  employees as mockEmployees,
  entryDistribution,
  workSites as mockWorkSites,
} from "./mock-data";
import type { ClockRecord, Employee, WorkSite } from "./types";

function mapEmployee(row: {
  id: string;
  full_name: string;
  position: string;
  email: string;
  status: "active" | "inactive";
  user_id: string | null;
  work_site_id: string | null;
}): Employee {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.full_name,
    role: row.position,
    email: row.email,
    status: row.status,
    workSiteId: row.work_site_id ?? "",
    lastClockLabel: "Sem registro hoje",
    todayWorkedMinutes: 0,
    dayStatus: row.status === "active" ? "pending-entry" : "absent",
  };
}

function mapWorkSite(row: {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
}): WorkSite {
  return {
    id: row.id,
    name: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
    radiusMeters: row.radius_meters,
  };
}

function mapClockRecord(row: {
  id: string;
  employee_id: string;
  event_type: ClockRecord["type"];
  recorded_at: string;
  latitude: number | null;
  longitude: number | null;
  accuracy_meters: number | null;
  approximate_address: string | null;
  ip_address: string | null;
  browser: string | null;
  operating_system: string | null;
  device: string | null;
  notes: string | null;
  location_status: ClockRecord["locationStatus"];
  employees: { full_name: string } | null;
}): ClockRecord {
  const recordedAt = new Date(row.recorded_at);

  return {
    id: row.id,
    employeeId: row.employee_id,
    employeeName: row.employees?.full_name ?? "Funcionário",
    date: recordedAt.toISOString().slice(0, 10),
    time: recordedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    type: row.event_type,
    latitude: row.latitude,
    longitude: row.longitude,
    accuracyMeters: row.accuracy_meters,
    approximateAddress: row.approximate_address ?? "Localização indisponível",
    ipAddress: row.ip_address ?? "indisponível",
    browser: row.browser ?? "indisponível",
    operatingSystem: row.operating_system ?? "indisponível",
    device: row.device ?? "indisponível",
    notes: row.notes ?? undefined,
    locationStatus: row.location_status,
  };
}

export function useTimeClockData() {
  return useQuery({
    queryKey: ["time-clock-dashboard"],
    queryFn: async () => {
      const [employeesResult, workSitesResult, recordsResult] = await Promise.all([
        supabase.from("employees").select("*").order("full_name"),
        supabase.from("work_sites").select("*").eq("active", true).order("name"),
        supabase
          .from("clock_records")
          .select("*, employees(full_name)")
          .order("recorded_at", { ascending: false })
          .limit(20),
      ]);

      if (employeesResult.error || workSitesResult.error || recordsResult.error) {
        return {
          employees: mockEmployees,
          workSites: mockWorkSites,
          clockRecords: mockClockRecords,
          attendanceSeries,
          entryDistribution,
          source: "mock" as const,
        };
      }

      return {
        employees: employeesResult.data.map(mapEmployee),
        workSites: workSitesResult.data.map(mapWorkSite),
        clockRecords: recordsResult.data.map(mapClockRecord),
        attendanceSeries,
        entryDistribution,
        source: "supabase" as const,
      };
    },
  });
}
