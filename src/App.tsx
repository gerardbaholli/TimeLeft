import { useEffect } from "react";
import { useWorkTime } from "./hooks/useWorkTime";
import { BlockGrid } from "./components/BlockGrid";
import { SettingsPanel } from "./components/SettingsPanel";
import "./App.css";

function App() {
  const { schedule, elapsedMinutes, remainingMinutes, currentSeconds, updateSchedule } = useWorkTime();

  useEffect(() => {
    const h = Math.floor(remainingMinutes / 60);
    const m = remainingMinutes % 60;
    document.title = `${h}h ${m}m`;
  }, [remainingMinutes]);

  return (
    <div className="app">
      <BlockGrid schedule={schedule} elapsedMinutes={elapsedMinutes} remainingMinutes={remainingMinutes} currentSeconds={currentSeconds} />
      <SettingsPanel schedule={schedule} onUpdate={updateSchedule} />
    </div>
  );
}

export default App;
