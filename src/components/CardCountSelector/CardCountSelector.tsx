import React from "react";
import { CardOption } from "@/types/game";

interface CardCountSelectorProps {
  options: CardOption[];
  selectedCount: number;
  onChange: (count: number) => void;
}

export const CardCountSelector: React.FC<CardCountSelectorProps> = ({
  options,
  selectedCount,
  onChange,
}) => (
  <>
    <h2>Choose Number of Cards</h2>
    <div className="select-wrapper">
      <select
        value={selectedCount}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  </>
);
