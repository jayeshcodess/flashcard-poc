"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadDecks, deleteDeck, type SavedDeck } from "@/utils/storage";

export default function DecksPage() {
  const [decks, setDecks] = useState<SavedDeck[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDecks(loadDecks());
    setMounted(true);
  }, []);

  const handleDelete = (id: string) => {
    deleteDeck(id);
    setDecks(loadDecks());
  };

  if (!mounted) {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="animate-pulse text-sm text-[#4A4A6A]">Loading…</div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 text-[#1A1A2E]">
              My Decks
            </h1>
            <p className="text-[#4A4A6A] text-sm">
              {decks.length} / 10 decks saved
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
          >
            + New Deck
          </Link>
        </div>

        {decks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-12 text-center">
            <h3 className="text-lg font-medium text-[#1A1A2E] mb-2">No decks yet</h3>
            <p className="text-[#4A4A6A] text-sm mb-6">
              Generate some flashcards from your study notes to save them here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-all"
            >
              Generate Flashcards
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {decks.map((deck) => {
              const savedDate = new Date(deck.saved_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              
              return (
                <div key={deck.deck_id} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-[#1A1A2E] truncate pr-2">
                      {deck.title}
                    </h3>
                    <span className="text-xs font-medium text-[#4A4A6A] bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                      {deck.cards.length} cards
                    </span>
                  </div>
                  <p className="text-xs text-[#4A4A6A] mb-4">Saved on {savedDate}</p>
                  
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                    <Link
                      href={`/study?id=${deck.deck_id}`}
                      className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                    >
                      Study Deck →
                    </Link>
                    <button
                      onClick={() => handleDelete(deck.deck_id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      title="Delete deck"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
