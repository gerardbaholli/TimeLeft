import { useState, useEffect, useCallback } from "react";
import {
  type WorkSchedule,
  type WorkPhase,
  loadSchedule,
  saveSchedule,
  getTotalWorkMinutes,
  getElapsedWorkMinutes,
  getRemainingWorkMinutes,
  getCurrentPhase,
  getMinutesUntilLunch,
  getMinutesUntilEnd,
  getElapsedLunchMinutes,
  getLunchDuration,
} from "../utils/timeUtils";

export interface WorkTimeState {
  schedule: WorkSchedule;
  totalMinutes: number;
  elapsedMinutes: number;
  remainingMinutes: number;
  phase: WorkPhase;
  percentage: number;
  minutesUntilLunch: number;
  minutesUntilEnd: number;
  elapsedLunchMinutes: number;
  lunchDuration: number;
  currentSeconds: number;
  updateSchedule: (schedule: WorkSchedule) => void;
}

export function useWorkTime(): WorkTimeState {
  const [schedule, setSchedule] = useState<WorkSchedule>(loadSchedule);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const updateSchedule = useCallback((newSchedule: WorkSchedule) => {
    setSchedule(newSchedule);
    saveSchedule(newSchedule);
  }, []);

  const totalMinutes = getTotalWorkMinutes(schedule);
  const elapsedMinutes = getElapsedWorkMinutes(now, schedule);
  const remainingMinutes = getRemainingWorkMinutes(now, schedule);
  const phase = getCurrentPhase(now, schedule);
  const percentage =
    totalMinutes > 0 ? Math.min(100, (elapsedMinutes / totalMinutes) * 100) : 0;
  const minutesUntilLunch = getMinutesUntilLunch(now, schedule);
  const minutesUntilEnd = getMinutesUntilEnd(now, schedule);
  const elapsedLunchMinutes = getElapsedLunchMinutes(now, schedule);
  const lunchDuration = getLunchDuration(schedule);

  return {
    schedule,
    totalMinutes,
    elapsedMinutes,
    remainingMinutes,
    phase,
    percentage,
    minutesUntilLunch,
    minutesUntilEnd,
    elapsedLunchMinutes,
    lunchDuration,
    currentSeconds: now.getSeconds(),
    updateSchedule,
  };
}
