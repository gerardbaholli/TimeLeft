import { useWorkTime } from "./hooks/useWorkTime";
import { BlockGrid } from "./components/BlockGrid";
import { TimeDisplay } from "./components/TimeDisplay";
import { StatusMessage } from "./components/StatusMessage";
import { SettingsPanel } from "./components/SettingsPanel";
import "./App.css";

function App() {
  const {
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
    updateSchedule,
  } = useWorkTime();

  return (
    <div className="app">
      <SettingsPanel schedule={schedule} onUpdate={updateSchedule} />
      <header className="app-header">
        <h1>TimeLeft</h1>
      </header>
      <TimeDisplay
        remainingMinutes={remainingMinutes}
        percentage={percentage}
        phase={phase}
        minutesUntilLunch={minutesUntilLunch}
        minutesUntilEnd={minutesUntilEnd}
      />
      <StatusMessage
        phase={phase}
        remainingMinutes={remainingMinutes}
        totalMinutes={totalMinutes}
      />
      <BlockGrid
        schedule={schedule}
        elapsedMinutes={elapsedMinutes}
        elapsedLunchMinutes={elapsedLunchMinutes}
        lunchDuration={lunchDuration}
        phase={phase}
      />
    </div>
  );
}

export default App;
