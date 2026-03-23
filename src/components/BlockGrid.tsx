import { useMemo } from "react";
import {
  type WorkSchedule,
  getTimeForMinuteIndex,
  getTotalWorkMinutes,
  timeToMinutes,
} from "../utils/timeUtils";
import "./BlockGrid.css";

interface BlockGridProps {
  schedule: WorkSchedule;
  elapsedMinutes: number;
  elapsedLunchMinutes: number;
  lunchDuration: number;
}

interface RowData {
  type: "work" | "lunch";
  label: string;
  minutes: { index: number; time: string; isElapsed: boolean; hue: number }[];
}

export function BlockGrid({
  schedule,
  elapsedMinutes,
  elapsedLunchMinutes,
  lunchDuration,
}: BlockGridProps) {
  const totalMinutes = getTotalWorkMinutes(schedule);
  const morningDuration =
    timeToMinutes(schedule.morning.end) - timeToMinutes(schedule.morning.start);
  const afternoonDuration =
    timeToMinutes(schedule.afternoon.end) - timeToMinutes(schedule.afternoon.start);

  const rows = useMemo(() => {
    const result: RowData[] = [];

    // Morning rows (60 blocks each)
    for (let row = 0; row < Math.ceil(morningDuration / 60); row++) {
      const startIdx = row * 60;
      const endIdx = Math.min(startIdx + 60, morningDuration);
      const hourStart = timeToMinutes(schedule.morning.start) + startIdx;
      const h = Math.floor(hourStart / 60);
      const minutes: RowData["minutes"] = [];

      for (let i = startIdx; i < endIdx; i++) {
        minutes.push({
          index: i,
          time: getTimeForMinuteIndex(i, schedule),
          isElapsed: i < elapsedMinutes,
          hue: 120 + (i / (totalMinutes - 1)) * 120,
        });
      }

      result.push({
        type: "work",
        label: `${h.toString().padStart(2, "0")}:00`,
        minutes,
      });
    }

    // Lunch row
    const lunchStart = timeToMinutes(schedule.morning.end);
    const lunchMinutes: RowData["minutes"] = [];
    for (let i = 0; i < lunchDuration; i++) {
      const absMin = lunchStart + i;
      const hh = Math.floor(absMin / 60);
      const mm = absMin % 60;
      lunchMinutes.push({
        index: i,
        time: `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`,
        isElapsed: i < elapsedLunchMinutes,
        hue: 45, // golden hue for lunch
      });
    }
    result.push({
      type: "lunch",
      label: `${Math.floor(lunchStart / 60).toString().padStart(2, "0")}:00`,
      minutes: lunchMinutes,
    });

    // Afternoon rows (60 blocks each)
    for (let row = 0; row < Math.ceil(afternoonDuration / 60); row++) {
      const startIdx = row * 60;
      const endIdx = Math.min(startIdx + 60, afternoonDuration);
      const globalIdx = morningDuration + startIdx;
      const hourStart = timeToMinutes(schedule.afternoon.start) + startIdx;
      const h = Math.floor(hourStart / 60);
      const minutes: RowData["minutes"] = [];

      for (let i = 0; i < endIdx - startIdx; i++) {
        const gi = globalIdx + i;
        minutes.push({
          index: gi,
          time: getTimeForMinuteIndex(gi, schedule),
          isElapsed: gi < elapsedMinutes,
          hue: 120 + (gi / (totalMinutes - 1)) * 120,
        });
      }

      result.push({
        type: "work",
        label: `${h.toString().padStart(2, "0")}:00`,
        minutes,
      });
    }

    return result;
  }, [
    schedule,
    morningDuration,
    afternoonDuration,
    totalMinutes,
    elapsedMinutes,
    elapsedLunchMinutes,
    lunchDuration,
  ]);

  return (
    <div className="block-grid">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className={`block-row ${row.type === "lunch" ? "block-row-lunch" : ""}`}>
          <span className="block-row-label">{row.label}</span>
          <div className="block-row-blocks">
            {row.minutes.map((block, i) => (
              <div
                key={i}
                className={`block ${block.isElapsed ? "block-elapsed" : "block-active"} ${row.type === "lunch" ? "block-lunch" : ""}`}
                style={
                  block.isElapsed
                    ? ({ "--block-hue": `${block.hue}` } as React.CSSProperties)
                    : undefined
                }
                title={block.time}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
