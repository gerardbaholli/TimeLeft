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
  currentSeconds: number;
}

interface RowData {
  label: string;
  endLabel: string;
  minutes: { index: number; time: string; isElapsed: boolean; hue: number }[];
}

export function BlockGrid({ schedule, elapsedMinutes, currentSeconds }: BlockGridProps) {
  const totalMinutes = getTotalWorkMinutes(schedule);
  const morningDuration =
    timeToMinutes(schedule.morning.end) - timeToMinutes(schedule.morning.start);
  const afternoonDuration =
    timeToMinutes(schedule.afternoon.end) -
    timeToMinutes(schedule.afternoon.start);

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

      const endH = h + 1;
      result.push({
        label: `${h.toString().padStart(2, "0")}:00`,
        endLabel: `${endH.toString().padStart(2, "0")}:00`,
        minutes,
      });
    }

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

      const endH = h + 1;
      result.push({
        label: `${h.toString().padStart(2, "0")}:00`,
        endLabel: `${endH.toString().padStart(2, "0")}:00`,
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
  ]);

  const morningRowCount = Math.ceil(morningDuration / 60);

  return (
    <div className="block-grid">
      {rows.map((row, rowIdx) => (
        <>
          {rowIdx === morningRowCount && (
            <div key="lunch" className="lunch-separator">
              <span className="lunch-separator-text">pausa pranzo</span>
            </div>
          )}
          <div key={rowIdx} className="block-row">
            <span className="block-row-label block-row-label-left">
              {row.label}
            </span>
            <div className="block-row-blocks">
              {row.minutes.map((block, i) => (
                <div
                  key={i}
                  className={`block ${block.isElapsed ? "block-elapsed" : block.index === elapsedMinutes ? "block-current" : "block-active"}`}
                  style={
                    block.isElapsed
                      ? ({ "--block-hue": `${block.hue}` } as React.CSSProperties)
                      : block.index === elapsedMinutes
                      ? ({
                          "--fill": `${(currentSeconds / 60) * 100}%`,
                        } as React.CSSProperties)
                      : undefined
                  }
                  title={block.time}
                />
              ))}
            </div>
            <span className="block-row-label block-row-label-right">
              {row.endLabel}
            </span>
          </div>
        </>
      ))}
    </div>
  );
}
