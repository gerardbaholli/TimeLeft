import { useWorkTime } from "./hooks/useWorkTime";
import { BlockGrid } from "./components/BlockGrid";
import { SettingsPanel } from "./components/SettingsPanel";
import "./App.css";

function App() {
  const { schedule, elapsedMinutes, currentSeconds, updateSchedule } = useWorkTime();

  return (
    <div className="app">
      <BlockGrid schedule={schedule} elapsedMinutes={elapsedMinutes} currentSeconds={currentSeconds} />
      <SettingsPanel schedule={schedule} onUpdate={updateSchedule} />
    </div>
  );
}

export default App;
