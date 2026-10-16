// ============================================================================
// Beispieldaten von Glory Duck (Berlin). Monatsstunden, nicht je Woche.
// ============================================================================

import type { Employee, Schedule } from "../types";
import { DEFAULT_WORK_HOURS } from "./workHours";

export function makeEmployee(
  id: string,
  name: string,
  employmentType: Employee["employmentType"],
  targetHours: number,
): Employee {
  return { id, name, employmentType, targetMinutes: Math.round(targetHours * 60) };
}

/** Mitarbeiter mit WOCHENvertrag (hier nicht im Einsatz, bleibt für die Oberfläche). */
export function makeWeekly(
  id: string,
  name: string,
  employmentType: Employee["employmentType"],
  weeklyHours: number,
): Employee {
  return { id, name, employmentType, targetMinutes: 0, weeklyHours };
}

/**
 * Kunden-Demo („Demo Restaurant"): 10 erfundene Personen – 5 Vollzeit, 3 Teilzeit,
 * 2 Minijob, 6 Bồi und 4 Bếp (1.196 h im Monat).
 */
/**
 * Glory Duck, Sonntagstr. 31, 10245 Berlin – Angabe des Betriebs: 7 Leute,
 * Monats-Soll 160, 160, 90, 40, 40, 40, 35 = 565 h. 160 h = Vollzeit, 90 h =
 * Teilzeit, um 40 h = Minijob (aus den Stunden abgeleitet).
 */
export function gloryDuckEmployees(): Employee[] {
  return [
    makeEmployee("VZ1", "VZ1", "VOLLZEIT", 160),
    makeEmployee("VZ2", "VZ2", "VOLLZEIT", 160),
    makeEmployee("TZ1", "TZ1", "TEILZEIT", 90),
    makeEmployee("MJ1", "MJ1", "MINIJOB", 40),
    makeEmployee("MJ2", "MJ2", "MINIJOB", 40),
    makeEmployee("MJ3", "MJ3", "MINIJOB", 40),
    makeEmployee("MJ4", "MJ4", "MINIJOB", 35),
  ];
}

/** Belegschaft der Standard-Filiale – für Tests und Altaufrufe. */
export const SAMPLE_EMPLOYEES: Employee[] = gloryDuckEmployees();

export function createSampleSchedule(): Schedule {
  return {
    companyName: "Glory Duck",
    address: "Sonntagstr. 31, 10245 Berlin",
    year: 2026,
    month: 8, // August
    workHours: structuredClone(DEFAULT_WORK_HOURS),
    dateOverrides: [],
    employees: gloryDuckEmployees(),
    shifts: [],
  };
}
