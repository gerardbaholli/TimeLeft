import { useState } from "react";
import { type WorkSchedule } from "../utils/timeUtils";
import "./SettingsPanel.css";

interface SettingsPanelProps {
  schedule: WorkSchedule;
  onUpdate: (schedule: WorkSchedule) => void;
}

export function SettingsPanel({ schedule, onUpdate }: SettingsPanelProps) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(schedule);

  const handleChange = (
    period: "morning" | "afternoon",
    field: "start" | "end",
    value: string
  ) => {
    // Allow only digits and colon, auto-format
    const clean = value.replace(/[^0-9:]/g, "");
    const updated = {
      ...local,
      [period]: { ...local[period], [field]: clean },
    };
    setLocal(updated);

    // Only propagate if valid HH:MM
    if (/^\d{2}:\d{2}$/.test(clean)) {
      onUpdate(updated);
    }
  };

  return (
    <div className="settings">
      <button
        className="settings-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Impostazioni"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        )}
      </button>
      {open && (
        <div className="settings-panel">
          <h3>Orario lavorativo</h3>
          <div className="settings-row">
            <label>Mattina</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="09:00"
              value={local.morning.start}
              onChange={(e) => handleChange("morning", "start", e.target.value)}
            />
            <span>—</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="13:00"
              value={local.morning.end}
              onChange={(e) => handleChange("morning", "end", e.target.value)}
            />
          </div>
          <div className="settings-row">
            <label>Pomeriggio</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="14:00"
              value={local.afternoon.start}
              onChange={(e) =>
                handleChange("afternoon", "start", e.target.value)
              }
            />
            <span>—</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="18:00"
              value={local.afternoon.end}
              onChange={(e) => handleChange("afternoon", "end", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
