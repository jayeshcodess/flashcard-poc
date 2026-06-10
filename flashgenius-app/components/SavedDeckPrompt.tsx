"use client";

import type { SavedDeck } from "@/utils/storage";

interface SavedDeckPromptProps {
  savedDeck: SavedDeck;
  onLoad: () => void;
  onCreateNew: () => void;
}

export default function SavedDeckPrompt({
  savedDeck,
  onLoad,
  onCreateNew,
}: SavedDeckPromptProps) {
  const savedDate = new Date(savedDeck.saved_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="deck-prompt-enter bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 mb-2">
          <svg className="w-7 h-7 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-[#1A1A2E]">Welcome Back!</h2>
        <p className="text-sm text-[#4A4A6A]">
          You have a saved deck from a previous session.
        </p>
      </div>

      {/* Saved Deck Preview */}
      <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#1A1A2E]">{savedDeck.title}</span>
          <span className="text-xs text-[#4A4A6A] bg-white px-2 py-0.5 rounded-full border border-[#E2E8F0]">
            {savedDeck.cards.length} cards
          </span>
        </div>
        <p className="text-xs text-[#4A4A6A]">Saved on {savedDate}</p>
        <p className="text-xs text-[#4A4A6A] italic truncate">
          &quot;{savedDeck.cards[0]?.question}&quot;
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onLoad}
          className="py-3 px-5 rounded-xl text-sm font-medium bg-[#4F46E5] text-white
                     hover:bg-[#4338CA] hover:shadow-md active:scale-[0.97] transition-all cursor-pointer
                     flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Load Saved Deck
        </button>
        <button
          onClick={onCreateNew}
          className="py-3 px-5 rounded-xl text-sm font-medium border border-[#E2E8F0]
                     text-[#4A4A6A] hover:bg-gray-50 hover:border-gray-300 active:scale-[0.97]
                     transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create New Deck
        </button>
      </div>
    </div>
  );
}
