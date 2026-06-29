import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

import type { ClockEventType, ClockRecord, Employee, LocationStatus, WorkSite } from "./types";

type RegisterClockInput = {
  employee: Employee;
  nextEventType: ClockEventType;
  notes?: string;
  userId: string;
  workSite?: WorkSite;
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceInMeters(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
) {
  const earthRadiusMeters = 6371000;
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const startLatitude = toRadians(origin.latitude);
  const endLatitude = toRadians(destination.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function getBrowserInfo() {
  if (typeof navigator === "undefined") {
    return {
      browser: "indisponível",
      device: "indisponível",
      operatingSystem: "indisponível",
    };
  }

  const userAgent = navigator.userAgent;
  const browser = userAgent.includes("Edg")
    ? "Edge"
    : userAgent.includes("Chrome")
      ? "Chrome"
      : userAgent.includes("Safari")
        ? "Safari"
        : userAgent.includes("Firefox")
          ? "Firefox"
          : "Navegador";

  const operatingSystem = userAgent.includes("Windows")
    ? "Windows"
    : userAgent.includes("Mac")
      ? "macOS"
      : userAgent.includes("Android")
        ? "Android"
        : userAgent.includes("iPhone") || userAgent.includes("iPad")
          ? "iOS"
          : "Sistema";

  const device = /Mobi|Android|iPhone|iPad/i.test(userAgent) ? "Celular" : "Computador";

  return { browser, device, operatingSystem };
}

function getCurrentPosition() {
  return new Promise<GeolocationPosition | null>((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      () => resolve(null),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 12000,
      },
    );
  });
}

function getLocationStatus(position: GeolocationPosition | null, workSite?: WorkSite): LocationStatus {
  if (!position || !workSite) {
    return "unavailable";
  }

  const distance = getDistanceInMeters(
    {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    },
    {
      latitude: workSite.latitude,
      longitude: workSite.longitude,
    },
  );

  return distance <= workSite.radiusMeters ? "inside" : "outside";
}

export function getNextClockEvent(records: ClockRecord[]): ClockEventType | null {
  const eventOrder: ClockEventType[] = ["entry", "lunch_start", "lunch_end", "exit"];
  const today = new Date().toISOString().slice(0, 10);
  const todayEvents = new Set(records.filter((record) => record.date === today).map((record) => record.type));

  return eventOrder.find((eventType) => !todayEvents.has(eventType)) ?? null;
}

export function useClockRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ employee, nextEventType, notes, userId, workSite }: RegisterClockInput) => {
      const position = await getCurrentPosition();
      const locationStatus = getLocationStatus(position, workSite);
      const browserInfo = getBrowserInfo();

      const { error } = await supabase.from("clock_records").insert({
        accuracy_meters: position?.coords.accuracy ?? null,
        approximate_address: position ? "Endereço aproximado pendente" : "Localização não autorizada",
        browser: browserInfo.browser,
        device: browserInfo.device,
        employee_id: employee.id,
        event_type: nextEventType,
        latitude: position?.coords.latitude ?? null,
        location_status: locationStatus,
        longitude: position?.coords.longitude ?? null,
        notes,
        operating_system: browserInfo.operatingSystem,
        user_id: employee.userId ?? userId,
        work_site_id: employee.workSiteId || null,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-clock-dashboard"] });
    },
  });
}
