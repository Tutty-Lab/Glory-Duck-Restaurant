// ============================================================================
// Reine Zeit-Hilfsfunktionen. Alles in Minuten seit Mitternacht (Integer).
// ============================================================================

/** "13:30" -> 810. Wirft bei ungültigem Format. */
export function timeToMinutes(time: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) {
    throw new Error(`Ungültiges Zeitformat: "${time}" (erwartet HH:mm)`);
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Ungültige Uhrzeit: "${time}"`);
  }
  return hours * 60 + minutes;
}

/** 810 -> "13:30". Immer zweistellig, 24h-Format. */
export function minutesToTime(totalMinutes: number): string {
  const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Pausenregel. Angabe des Betriebs: "Pause 30-60phút", nachgereicht
 * präzisiert: "ca 8h und 9h = 60 Minuten".
 *
 * Daraus wird: über 6 Stunden 30 Minuten, ab 8 Stunden 60 Minuten. Das liegt
 * über der gesetzlichen Staffel (ArbZG § 4 verlangt bei 8 h nur 30 min) –
 * mehr Pause zu geben ist erlaubt, weniger nicht.
 *
 * Vorher galt die 60-Minuten-Stufe erst ab 9 Stunden; die 8-Stunden-Schicht
 * der Vollzeitkräfte bekam damit nur 30 Minuten, also eine halbe Stunde zu
 * wenig.
 *
 * Die Pause wird NICHT von der Arbeitszeit abgezogen, sondern verlängert die
 * Anwesenheit: presence = paid + pause. Eine 8-Stunden-Schicht belegt also
 * 9 Stunden im Fenster 12:00-22:30 (10,5 h).
 *
 * Einzige Stelle für Zeitrechnung dieser Art – alles andere leitet sich hier
 * ab.
 */
export function calculatePause(paidMinutes: number): number {
  if (paidMinutes >= 8 * 60) return 60;
  if (paidMinutes > 6 * 60) return 30;
  return 0;
}

/**
 * Bezahlte Minuten aus Anwesenheit und Pause.
 * paidMinutes = presenceMinutes - pauseMinutes
 */
export function calculatePaidMinutes(
  startMinutes: number,
  endMinutes: number,
  pauseMinutes: number,
): number {
  return endMinutes - startMinutes - pauseMinutes;
}

/** Anwesenheit (inkl. Pause) aus bezahlter Zeit. */
export function presenceFromPaid(paidMinutes: number): number {
  return paidMinutes + calculatePause(paidMinutes);
}

/** Minuten -> Stunden als deutsche Dezimalzahl, z.B. 450 -> "7,50". */
export function minutesToDecimalHours(totalMinutes: number, fractionDigits = 2): string {
  const hours = totalMinutes / 60;
  return hours.toLocaleString("de-DE", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/** Minuten -> kompakte Stundenangabe, z.B. 480 -> "8h", 450 -> "7,5h". */
export function minutesToShortHours(totalMinutes: number): string {
  const hours = totalMinutes / 60;
  const text = Number.isInteger(hours)
    ? String(hours)
    : hours.toLocaleString("de-DE", { maximumFractionDigits: 2 });
  return `${text}h`;
}
