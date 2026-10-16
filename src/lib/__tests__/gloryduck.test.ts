// Glory Duck: Startbelegschaft, Öffnungszeiten und Tagesgewichte im Planer.
import { describe, expect, it } from "vitest";
import { generateSchedule } from "../scheduler";
import { storeById } from "../stores";
import { parseIsoDate, weekdayKeyOf } from "../demand";
import { DEFAULT_WORK_HOURS } from "../workHours";

const store = storeById("gloryduck");

describe("Glory Duck", () => {
  const employees = store.sampleEmployees();
  const shifts = generateSchedule({
    year: 2026, month: 9, workHours: DEFAULT_WORK_HOURS, employees,
    rules: store.staffingRules, weights: store.dayWeights, storeTag: store.id,
  });

  it("Startbelegschaft: 7 Leute, 565 h", () => {
    expect(employees).toHaveLength(7);
    expect(employees.reduce((sum, e) => sum + e.targetMinutes, 0) / 60).toBe(565);
  });

  it("jeder Dienst liegt in 12:00–22:30", () => {
    for (const s of shifts) {
      expect(s.startMinutes).toBeGreaterThanOrEqual(12 * 60);
      expect(s.endMinutes).toBeLessThanOrEqual(22 * 60 + 30);
    }
  });

  it("Freitag und Samstag bekommen mehr Stunden als Montag und Dienstag", () => {
    const perDay = new Map<string, number>();
    for (const s of shifts) {
      const key = weekdayKeyOf(parseIsoDate(s.date));
      perDay.set(key, (perDay.get(key) ?? 0) + s.paidMinutes);
    }
    const strong = (perDay.get("friday") ?? 0) + (perDay.get("saturday") ?? 0);
    const weak = (perDay.get("monday") ?? 0) + (perDay.get("tuesday") ?? 0);
    expect(strong).toBeGreaterThan(weak);
  });
});
