// ============================================================================
// Unterbesetzung muss sichtbar werden statt still zu passieren – egal ob sie
// vom Scheduler kommt oder von einer Änderung im Plan von Hand.
//
// Glory Duck: offen 12:00–22:30 durchgehend; abends (18:00–21:00) sollen
// mindestens 2 Leute da sein, freitags und samstags 3, und bis 22:30 bleibt
// immer mindestens eine Person.
// ============================================================================

import { describe, expect, it } from "vitest";
import { analyzeSchedule } from "../analyze";
import { DEFAULT_WORK_HOURS } from "../workHours";
import type { Employee, Shift } from "../../types";

const emp = (id: string): Employee => ({ id, name: id, employmentType: "TEILZEIT", targetMinutes: 60 * 60 });

const dienst = (id: string, date: string, from: number, to: number): Shift => ({
  id: `shift-${id}-${date}-${from}`,
  employeeId: id,
  date,
  startMinutes: from,
  endMinutes: to,
  pauseMinutes: 0,
  paidMinutes: to - from,
  shiftType: from >= 17 * 60 ? "LATE" : "EARLY",
  generated: true,
});

const analyse = (employees: Employee[], shifts: Shift[]) =>
  analyzeSchedule({ year: 2026, month: 8, workHours: DEFAULT_WORK_HOURS, employees, shifts });

const peaksOf = (employees: Employee[], shifts: Shift[], date: string) =>
  analyse(employees, shifts).peakViolations.find((d) => d.date === date)?.peaks ?? [];

describe("Glory Duck – Besetzung", () => {
  // 2026-08-04 ist ein Dienstag, 2026-08-07 ein Freitag.
  it("Dienstagabend mit 2 Leuten bis 22:30 ist in Ordnung", () => {
    const employees = [emp("a"), emp("b"), emp("c")];
    const shifts = [
      dienst("c", "2026-08-04", 12 * 60, 17 * 60),
      dienst("a", "2026-08-04", 17 * 60, 22 * 60 + 30),
      dienst("b", "2026-08-04", 17 * 60, 21 * 60),
    ];
    expect(peaksOf(employees, shifts, "2026-08-04").filter((p) => !p.ok)).toEqual([]);
  });

  it("Freitagabend braucht 3 Leute – mit 2 wird es gemeldet", () => {
    const employees = [emp("a"), emp("b"), emp("c")];
    const shifts = [
      dienst("c", "2026-08-07", 12 * 60, 17 * 60),
      dienst("a", "2026-08-07", 17 * 60, 22 * 60 + 30),
      dienst("b", "2026-08-07", 17 * 60, 21 * 60),
    ];
    const tot = peaksOf(employees, shifts, "2026-08-07").find((p) => !p.ok && p.label === "Tối T6–T7");
    expect(tot?.minStaff).toBe(2);
    expect(tot?.required).toBe(3);
  });

  it("meldet, wenn bis 22:30 niemand mehr da ist", () => {
    const employees = [emp("a"), emp("b")];
    const shifts = [dienst("a", "2026-08-04", 12 * 60, 20 * 60), dienst("b", "2026-08-04", 17 * 60, 22 * 60)];
    expect(peaksOf(employees, shifts, "2026-08-04").some((p) => !p.ok && p.label === "Đóng cửa")).toBe(true);
  });
});
