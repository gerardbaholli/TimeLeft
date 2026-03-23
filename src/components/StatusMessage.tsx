import type { WorkPhase } from "../utils/timeUtils";
import "./StatusMessage.css";

interface StatusMessageProps {
  phase: WorkPhase;
  remainingMinutes: number;
  totalMinutes: number;
}

function getMessage(
  phase: WorkPhase,
  remainingMinutes: number,
  totalMinutes: number
): string {
  if (phase === "before-work") {
    return "Goditi gli ultimi minuti di libertà...";
  }

  if (phase === "after-work") {
    return "LIBERTÀ! Ci vediamo domani!";
  }

  if (phase === "lunch-break") {
    return "Buon appetito! Ricarica le energie";
  }

  const elapsed = totalMinutes - remainingMinutes;
  const pct = (elapsed / totalMinutes) * 100;

  if (remainingMinutes <= 10) return "Ci siamo quasi! Countdown finale!";
  if (remainingMinutes <= 30) return "Meno di mezz'ora... Resisti!";
  if (remainingMinutes <= 60) return "Ultimo sprint! Ce la fai!";
  if (pct < 10) return `${totalMinutes} blocchetti da eliminare. Si parte!`;
  if (pct < 25) return "La mattinata è appena iniziata, forza!";
  if (pct < 40) return "Stai andando forte, continua così!";
  if (pct < 50) return "Il pranzo si avvicina, resisti!";
  if (pct < 65) return "Secondo tempo! Ultima spinta";
  if (pct < 80) return "Più di metà giornata alle spalle, grande!";
  return "Il traguardo è vicino, non mollare!";
}

export function StatusMessage({
  phase,
  remainingMinutes,
  totalMinutes,
}: StatusMessageProps) {
  const message = getMessage(phase, remainingMinutes, totalMinutes);

  return (
    <div className="status-message">
      <span className="status-quote">&ldquo;{message}&rdquo;</span>
    </div>
  );
}
