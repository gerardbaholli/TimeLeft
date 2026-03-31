import { useWorkTime } from "./hooks/useWorkTime";
import { BlockGrid } from "./components/BlockGrid";
import { SettingsPanel } from "./components/SettingsPanel";
import "./App.css";

function App() {
  const { schedule, elapsedMinutes, remainingMinutes, currentSeconds, updateSchedule } = useWorkTime();

  return (
    <div className="app">
      <BlockGrid schedule={schedule} elapsedMinutes={elapsedMinutes} remainingMinutes={remainingMinutes} currentSeconds={currentSeconds} />
      <SettingsPanel schedule={schedule} onUpdate={updateSchedule} />
    </div>
  );
}

export default App;
