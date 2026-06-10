"use client";

import React, { ClipboardEvent } from "react";

type LoadingState = "idle" | "loading" | "error";

interface TextInputEngineProps {
  inputText: string;
  setInputText: (text: string) => void;
  loadingState: LoadingState;
  errorMessage: string;
  onGenerate: () => void;
}

const MAX_CHARS = 10000;
const MIN_CHARS = 50;

export default function TextInputEngine({
  inputText,
  setInputText,
  loadingState,
  errorMessage,
  onGenerate,
}: TextInputEngineProps) {
  const trimmedLength = inputText.trim().length;
  const isValid = trimmedLength >= MIN_CHARS;
  const isMaxReached = inputText.length >= MAX_CHARS;
  const isLoading = loadingState === "loading";

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const plain = e.clipboardData.getData("text/plain");
    const merged = inputText + plain;
    setInputText(merged.length > MAX_CHARS ? merged.slice(0, MAX_CHARS) : merged);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) setInputText(val);
  };

  return (
    <div className="space-y-6">
      {/* Notes Textarea */}
      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium">
          Study Notes
        </label>
        <textarea
          id="notes"
          value={inputText}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder="Paste your notes here…"
          rows={8}
          spellCheck={false}
          autoComplete="off"
          className={`w-full px-4 py-3 border rounded-xl resize-y outline-none transition-all text-sm leading-relaxed ${
            trimmedLength > 0 && trimmedLength < MIN_CHARS
              ? "border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]"
              : isMaxReached
                ? "border-amber-500 focus:ring-2 focus:ring-amber-500"
                : "border-[#E2E8F0] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
          }`}
        />

        {/* Counter + Validation */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#DC2626] font-medium">
            {trimmedLength > 0 && trimmedLength < MIN_CHARS &&
              "Minimum 50 characters required."}
          </span>
          <span
            className={`font-mono ${
              trimmedLength < MIN_CHARS
                ? "text-[#DC2626]"
                : isMaxReached
                  ? "text-amber-500"
                  : "text-gray-400"
            }`}
          >
            {inputText.length} / {MAX_CHARS}
            {isMaxReached && (
              <span className="ml-2 font-sans text-amber-500">
                Maximum reached.
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-sm text-[#DC2626] bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {errorMessage}
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={!isValid || isLoading}
        title={
          !isValid
            ? "Enter at least 50 characters to generate flashcards."
            : ""
        }
        className={`w-full py-3 px-6 rounded-xl font-medium text-sm transition-all duration-150
                    flex items-center justify-center gap-2 ${
                      !isValid || isLoading
                        ? "bg-gray-400 text-white/60 cursor-not-allowed"
                        : "bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:shadow-md active:scale-[0.97] cursor-pointer"
                    }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating…
          </>
        ) : (
          "Generate Flashcards"
        )}
      </button>
    </div>
  );
}
