import { useState } from "react";
import { type WorkSchedule } from "../utils/timeUtils";
import settingsIcon from "/settings_24dp_646464_FILL0_wght400_GRAD0_opsz24.svg";
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
    const clean = value.replace(/[^0-9:]/g, "");
    const updated = {
      ...local,
      [period]: { ...local[period], [field]: clean },
    };
    setLocal(updated);

    if (/^\d{2}:\d{2}$/.test(clean)) {
      onUpdate(updated);
    }
  };

  return (
    <div className={`settings${open ? " settings--open" : ""}`}>
      <button
        className="settings-icon-btn"
        onClick={() => setOpen(!open)}
      >
        <img
          src={settingsIcon}
          alt="settings"
          width={24}
          height={24}
        />
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
