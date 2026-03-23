import { formatTime } from "../utils/timeUtils";
import { type WorkPhase } from "../utils/timeUtils";
import "./TimeDisplay.css";

interface TimeDisplayProps {
  remainingMinutes: number;
  percentage: number;
  phase: WorkPhase;
  minutesUntilLunch: number;
  minutesUntilEnd: number;
}

export function TimeDisplay({
  remainingMinutes,
  percentage,
  phase,
  minutesUntilLunch,
  minutesUntilEnd,
}: TimeDisplayProps) {
  let countdownText: React.ReactNode;
  let subtitle = "";

  switch (phase) {
    case "before-work":
      countdownText = "Non ancora...";
      break;
    case "after-work":
      countdownText = "Finito!";
      break;
    case "lunch-break":
      countdownText = "Pausa pranzo";
      subtitle = `Ripresa tra ${formatTime(minutesUntilEnd - (remainingMinutes > 0 ? remainingMinutes : 0))}... no aspetta, godi il pranzo!`;
      break;
    case "morning":
      countdownText = (
        <>
          <span className="time-number">{formatTime(minutesUntilLunch)}</span>
          <span className="time-label"> alla pausa pranzo</span>
        </>
      );
      break;
    case "afternoon":
      countdownText = (
        <>
          <span className="time-number">{formatTime(minutesUntilEnd)}</span>
          <span className="time-label"> alla libertà</span>
        </>
      );
      break;
  }

  return (
    <div className="time-display">
      <div className="time-countdown">{countdownText}</div>
      {subtitle && <div className="time-subtitle">{subtitle}</div>}
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
        <span className="progress-bar-text">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}
