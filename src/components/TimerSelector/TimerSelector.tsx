import React from "react";

export const TIME_OPTIONS = [
  { value: 0, label: "No Time Limit" },
  { value: 60, label: "1 Minute" },
  { value: 120, label: "2 Minutes" },
  { value: 180, label: "3 Minutes" },
  { value: 300, label: "5 Minutes" },
];

interface TimerSelectorProps {
  selectedTime: number;
  onChange: (time: number) => void;
}

export const TimerSelector: React.FC<TimerSelectorProps> = ({
  selectedTime,
  onChange,
}) => (
  <>
    <h2>Choose Time Limit</h2>
    <div className="select-wrapper">
      <select
        value={selectedTime}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {TIME_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  </>
);
