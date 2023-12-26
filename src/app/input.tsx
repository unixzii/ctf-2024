import { useState } from "react";

export interface InputProps {
  placeholder?: string;
  buttonLabel: string;
  busy?: boolean;
  secret?: boolean;
  disabled?: boolean;
  value?: string;
  onSubmit?: (value: string) => void;
}

export default function Input(props: InputProps) {
  const { placeholder, buttonLabel, disabled, busy, secret, value, onSubmit } =
    props;
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex my-4 gap-2">
      <input
        className="w-52 px-2 py-1 border bg-zinc-800 border-transparent placeholder:text-zinc-500 hover:bg-zinc-700 focus:bg-zinc-900 focus:border-zinc-600 disabled:bg-transparent disabled:border-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed outline-none rounded-md transition-colors duration-200"
        placeholder={placeholder}
        type={secret ? "password" : "text"}
        autoComplete="off"
        disabled={disabled}
        data-1p-ignore
        value={value ? value : inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      <button
        className="relative px-4 py-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-800 disabled:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-md transition-colors duration-200"
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
