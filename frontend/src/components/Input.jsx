// frontend/src/components/Input.jsx
import { useId } from "react";

export default function Input({ id, label, hint, error, className = "", ...props }) {
  const autoId = useId();
  const inputId = id || `in-${autoId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="block">
      {label && (
        <label htmlFor={inputId} className="block text-sm text-gray-700">
          {label}
        </label>
      )}

      {hint && (
        <small id={hintId} className="mt-0.5 block text-xs text-gray-500">
          {hint}
        </small>
      )}

      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        {...props}
        className={`mt-1 w-full rounded-xl border p-2
          focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
          ${error ? "border-red-500" : "border-gray-300"} ${className}`}
      />

      {error && (
        <span id={errorId} role="alert" className="mt-1 block text-sm text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}

