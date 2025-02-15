import React from "react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
}) => (
  <div className="loading">
    <div className="spinner" />
    <p>{message}</p>
  </div>
);
