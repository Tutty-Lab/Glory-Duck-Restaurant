// ============================================================================
// Beispieldaten: die heutige Besetzung von VietHaus, Summe = 606 bezahlte Stunden.
// ============================================================================

import type { Employee, Schedule } from "../types";
import { DEFAULT_WORK_HOURS } from "./workHours";

export function makeEmployee(
  id: string,
  name: string,
  employmentType: Employee["employmentType"],
  targetHours: number,
): Employee {
  return { id, name, employmentType, targetMinutes: targetHours * 60 };
}

/** Beispielbelegschaft laut Angabe des Betriebs. Summe = 565 h. */
export const SAMPLE_EMPLOYEES: Employee[] = [
  makeEmployee("VZ1", "VZ1", "VOLLZEIT", 160),
  makeEmployee("VZ2", "VZ2", "VOLLZEIT", 160),
  makeEmployee("TZ1", "TZ1", "TEILZEIT", 90),
  makeEmployee("MJ1", "MJ1", "MINIJOB", 40),
  makeEmployee("MJ2", "MJ2", "MINIJOB", 40),
  makeEmployee("MJ3", "MJ3", "MINIJOB", 40),
  makeEmployee("MJ4", "MJ4", "MINIJOB", 35),
];

export function createSampleSchedule(): Schedule {
  return {
    companyName: "VietHaus Restaurant",
    address: "Herrengasse 19, 01744 Dippoldiswalde",
    year: 2026,
    month: 8, // August
    workHours: structuredClone(DEFAULT_WORK_HOURS),
    dateOverrides: [],
    employees: SAMPLE_EMPLOYEES.map((e) => ({ ...e })),
    shifts: [],
  };
}
