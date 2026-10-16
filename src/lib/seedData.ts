// ============================================================================
// Test-Belegschaften für drei Monate.
//
// Angaben des Betriebs (Glory Duck, Berlin):
//   - 7 Beschäftigte, Monats-Soll: 160, 160, 90, 40, 40, 40, 35 = 565 h
//   - Vollzeit arbeitet 8 Stunden am Tag
//   - Arbeitszeit 12:00-22:30 durchgehend, KEINE Mittagsschließung
//   - Pause 30-60 Minuten (Pause der Mitarbeiter, nicht des Ladens)
//   - Freitag und Samstag machen den doppelten Umsatz eines Montags und
//     brauchen mehr Leute
//   - kein fester Ruhetag genannt
//
// Zuordnung der Anstellungsart (vom Betrieb nicht ausdrücklich gesagt, aus den
// Stundenzahlen abgeleitet): 160 h ist Vollzeit, 90 h Teilzeit, alles um die
// 40 h im Monat liegt im Minijob-Bereich (rund 9 Stunden die Woche).
//
// Hinweis zum Datenmodell: Schedule hält immer GENAU EINEN Monat. Diese drei
// Monate existieren nebeneinander nur hier als Fixture.
// ============================================================================

import type { Employee, Schedule } from "../types";
import { COMPANY_ADDRESS, COMPANY_NAME } from "./company";
import { makeEmployee } from "./sampleData";
import { DEFAULT_WORK_HOURS } from "./workHours";

export type SeedMonth = {
  year: number;
  month: number; // 1-basiert
  label: string;
  employees: Employee[];
  /**
   * Wie viele Tage dürfen die Stoßzeit verfehlen? Normalfall 0.
   *
   * Bewusst hier sichtbar statt in der Prüfung versteckt: der Scheduler ist
   * eine Heuristik, keine vollständige Suche. Ein Wert > 0 heißt, dass die
   * Stundensumme rechnerisch reichen würde, der greedy Lauf die Verteilung
   * aber nicht findet - eine bekannte Schwäche, kein akzeptierter Zustand.
   */
  maxPeakGaps?: number;
};

/** Juni 2026 – volle Besetzung, alle sieben. */
const JUNE_2026: Employee[] = [
  makeEmployee("vz-1", "Vollzeit 1", "VOLLZEIT", 160),
  makeEmployee("vz-2", "Vollzeit 2", "VOLLZEIT", 160),
  makeEmployee("tz-1", "Teilzeit 1", "TEILZEIT", 90),
  makeEmployee("mini-1", "Mini 1", "MINIJOB", 40),
  makeEmployee("mini-2", "Mini 2", "MINIJOB", 40),
  makeEmployee("mini-3", "Mini 3", "MINIJOB", 40),
  makeEmployee("mini-4", "Mini 4", "MINIJOB", 35),
];

/** Juli 2026 – zwei Minijob-Kräfte im Urlaub, deren Stunden fallen weg. */
const JULY_2026: Employee[] = [
  makeEmployee("vz-1", "Vollzeit 1", "VOLLZEIT", 160),
  makeEmployee("vz-2", "Vollzeit 2", "VOLLZEIT", 160),
  makeEmployee("tz-1", "Teilzeit 1", "TEILZEIT", 90),
  makeEmployee("mini-1", "Mini 1", "MINIJOB", 40),
  makeEmployee("mini-2", "Mini 2", "MINIJOB", 40),
];

/** August 2026 – eine Vollzeitkraft weniger, dafür die Teilzeit aufgestockt. */
const AUGUST_2026: Employee[] = [
  makeEmployee("vz-1", "Vollzeit 1", "VOLLZEIT", 160),
  makeEmployee("tz-1", "Teilzeit 1", "TEILZEIT", 120),
  makeEmployee("tz-2", "Teilzeit 2", "TEILZEIT", 90),
  makeEmployee("mini-1", "Mini 1", "MINIJOB", 40),
  makeEmployee("mini-2", "Mini 2", "MINIJOB", 40),
  makeEmployee("mini-3", "Mini 3", "MINIJOB", 40),
  makeEmployee("mini-4", "Mini 4", "MINIJOB", 35),
];

export const SEED_MONTHS: SeedMonth[] = [
  { year: 2026, month: 6, label: "Juni 2026", employees: JUNE_2026 },
  { year: 2026, month: 7, label: "Juli 2026", employees: JULY_2026 },
  { year: 2026, month: 8, label: "August 2026", employees: AUGUST_2026 },
];


/** Baut einen leeren Schedule (ohne Schichten) für einen Seed-Monat. */
export function scheduleForSeed(seed: SeedMonth): Schedule {
  return {
    companyName: COMPANY_NAME,
    address: COMPANY_ADDRESS,
    year: seed.year,
    month: seed.month,
    workHours: structuredClone(DEFAULT_WORK_HOURS),
    dateOverrides: [],
    employees: seed.employees.map((e) => ({ ...e })),
    shifts: [],
  };
}

/** Summe der Sollstunden eines Seed-Monats (für Kapazitäts-Checks). */
export function totalTargetHours(seed: SeedMonth): number {
  return seed.employees.reduce((sum, e) => sum + e.targetMinutes, 0) / 60;
}
