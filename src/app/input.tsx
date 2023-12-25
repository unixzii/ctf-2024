import { useState } from "react";

export interface InputProps {
  placeholder?: string;
  buttonLabel: string;
  busy?: boolean;
  disabled?: boolean;
  value?: string;
  onSubmit?: (value: string) => void;
}

export default function Input(props: InputProps) {
  const { buttonLabel, disabled, busy, value, onSubmit } = props;
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex my-4 gap-2">
      <input
        className="w-52 px-2 py-1 border bg-transparent border-zinc-800 focus:border-zinc-600 disabled:text-zinc-500 outline-none rounded-md transition-colors duration-150"
        disabled={disabled}
        value={value ? value : inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      <button
        className="relative px-3 py-1 bg-white text-black border border-transparent disabled:bg-zinc-900 disabled:text-zinc-700 disabled:border-zinc-700 disabled:opacity-80 disabled:cursor-not-allowed active:bg-zinc-400 font-medium rounded-md transition-colors duration-150"
        disabled={inputValue.length === 0 || disabled || busy}
        onClick={() => {
          onSubmit?.(inputValue);
        }}
      >
        <span className={busy ? "opacity-0" : ""}>{buttonLabel}</span>

        {busy ? (
          <div className="absolute flex left-0 top-0 w-full h-full items-center justify-center">
            <svg
              className="animate-spin h-4 w-4 mx-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : null}
      </button>
    </div>
  );
}
