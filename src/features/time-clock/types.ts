export type ClockEventType = "entry" | "lunch_start" | "lunch_end" | "exit";

export type LocationStatus = "inside" | "outside" | "unavailable";

export type EmployeeStatus = "active" | "inactive";

export type WorkDayStatus = "present" | "absent" | "pending-entry" | "missing-exit";

export type Employee = {
  id: string;
  userId?: string | null;
  name: string;
  role: string;
  email: string;
  status: EmployeeStatus;
  workSiteId: string;
  lastClockLabel: string;
  todayWorkedMinutes: number;
  dayStatus: WorkDayStatus;
};

export type WorkSite = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
};

export type ClockRecord = {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  time: string;
  type: ClockEventType;
  latitude: number | null;
  longitude: number | null;
  accuracyMeters: number | null;
  approximateAddress: string;
  ipAddress: string;
  browser: string;
  operatingSystem: string;
  device: string;
  notes?: string;
  locationStatus: LocationStatus;
};

export type AttendanceSeriesPoint = {
  label: string;
  presentes: number;
  ausentes: number;
};

export type HourDistributionPoint = {
  label: string;
  registros: number;
};
