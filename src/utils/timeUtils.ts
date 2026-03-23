export interface WorkSchedule {
  morning: { start: string; end: string };
  afternoon: { start: string; end: string };
}

export type WorkPhase =
  | "before-work"
  | "morning"
  | "lunch-break"
  | "afternoon"
  | "after-work";

export const DEFAULT_SCHEDULE: WorkSchedule = {
  morning: { start: "09:00", end: "13:00" },
  afternoon: { start: "14:00", end: "18:00" },
};

/** Convert "HH:MM" to minutes since midnight */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Get total working minutes for a schedule */
export function getTotalWorkMinutes(schedule: WorkSchedule): number {
  const morningMinutes =
    timeToMinutes(schedule.morning.end) - timeToMinutes(schedule.morning.start);
  const afternoonMinutes =
    timeToMinutes(schedule.afternoon.end) -
    timeToMinutes(schedule.afternoon.start);
  return morningMinutes + afternoonMinutes;
}

/** Get current phase of the workday */
export function getCurrentPhase(
  now: Date,
  schedule: WorkSchedule
): WorkPhase {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const ms = timeToMinutes(schedule.morning.start);
  const me = timeToMinutes(schedule.morning.end);
  const as = timeToMinutes(schedule.afternoon.start);
  const ae = timeToMinutes(schedule.afternoon.end);

  if (currentMinutes < ms) return "before-work";
  if (currentMinutes < me) return "morning";
  if (currentMinutes < as) return "lunch-break";
  if (currentMinutes < ae) return "afternoon";
  return "after-work";
}

/** Get elapsed work minutes (only counting work time, not lunch) */
export function getElapsedWorkMinutes(
  now: Date,
  schedule: WorkSchedule
): number {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const ms = timeToMinutes(schedule.morning.start);
  const me = timeToMinutes(schedule.morning.end);
  const as = timeToMinutes(schedule.afternoon.start);
  const ae = timeToMinutes(schedule.afternoon.end);

  const morningDuration = me - ms;

  if (currentMinutes <= ms) return 0;
  if (currentMinutes <= me) return currentMinutes - ms;
  if (currentMinutes <= as) return morningDuration;
  if (currentMinutes <= ae) return morningDuration + (currentMinutes - as);
  return morningDuration + (ae - as);
}

/** Get remaining work minutes */
export function getRemainingWorkMinutes(
  now: Date,
  schedule: WorkSchedule
): number {
  const total = getTotalWorkMinutes(schedule);
  const elapsed = getElapsedWorkMinutes(now, schedule);
  return Math.max(0, total - elapsed);
}

/** Format minutes to "Xh Ym" */
export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Get the time string (HH:MM) for a given work-minute index (0-based) */
export function getTimeForMinuteIndex(
  index: number,
  schedule: WorkSchedule
): string {
  const ms = timeToMinutes(schedule.morning.start);
  const me = timeToMinutes(schedule.morning.end);
  const as = timeToMinutes(schedule.afternoon.start);
  const morningDuration = me - ms;

  let absoluteMinute: number;
  if (index < morningDuration) {
    absoluteMinute = ms + index;
  } else {
    absoluteMinute = as + (index - morningDuration);
  }

  const h = Math.floor(absoluteMinute / 60);
  const m = absoluteMinute % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/** Check if a minute index falls in the morning or afternoon block */
export function getBlockPhase(
  index: number,
  schedule: WorkSchedule
): "morning" | "afternoon" {
  const ms = timeToMinutes(schedule.morning.start);
  const me = timeToMinutes(schedule.morning.end);
  const morningDuration = me - ms;
  return index < morningDuration ? "morning" : "afternoon";
}

/** Load schedule from localStorage */
export function loadSchedule(): WorkSchedule {
  try {
    const saved = localStorage.getItem("timeleft-schedule");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return DEFAULT_SCHEDULE;
}

/** Save schedule to localStorage */
export function saveSchedule(schedule: WorkSchedule): void {
  localStorage.setItem("timeleft-schedule", JSON.stringify(schedule));
}

/** Get minutes remaining until lunch break (from current time) */
export function getMinutesUntilLunch(
  now: Date,
  schedule: WorkSchedule
): number {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const me = timeToMinutes(schedule.morning.end);
  return Math.max(0, me - currentMinutes);
}

/** Get minutes remaining until end of day (from current time) */
export function getMinutesUntilEnd(
  now: Date,
  schedule: WorkSchedule
): number {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const ae = timeToMinutes(schedule.afternoon.end);
  return Math.max(0, ae - currentMinutes);
}

/** Get elapsed lunch minutes */
export function getElapsedLunchMinutes(
  now: Date,
  schedule: WorkSchedule
): number {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const me = timeToMinutes(schedule.morning.end);
  const as = timeToMinutes(schedule.afternoon.start);
  if (currentMinutes <= me) return 0;
  if (currentMinutes >= as) return as - me;
  return currentMinutes - me;
}

/** Get total lunch duration in minutes */
export function getLunchDuration(schedule: WorkSchedule): number {
  return timeToMinutes(schedule.afternoon.start) - timeToMinutes(schedule.morning.end);
}
