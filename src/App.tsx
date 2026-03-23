import { useState, useEffect } from "react";
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
    updateSchedule,
  } = useWorkTime();

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  return (
    <div className="app">
      <div className="app-toolbar">
        {!isFullscreen && (
          <SettingsPanel schedule={schedule} onUpdate={updateSchedule} />
        )}
        <button
          className="toolbar-btn"
          onClick={() => setIsFullscreen((f) => !f)}
        >
          {isFullscreen ? "exit fullscreen" : "fullscreen"}
        </button>
      </div>

      {!isFullscreen && (
        <>
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
        </>
      )}
      <BlockGrid
        schedule={schedule}
        elapsedMinutes={elapsedMinutes}
        isFullscreen={isFullscreen}
      />
    </div>
  );
}

export default App;
