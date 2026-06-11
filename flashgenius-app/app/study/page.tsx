"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FlashcardUI from "@/components/FlashcardUI";
import NavigationOverlay from "@/components/NavigationOverlay";
import { loadDeck, type SavedDeck } from "@/utils/storage";
import { debugStore } from "@/utils/debugStore";

function StudyContent() {
  const searchParams = useSearchParams();
  const deck_id = searchParams.get("id");
  
  const [deck, setDeck] = useState<SavedDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (deck_id) {
      setDeck(loadDeck(deck_id));
    }
    setMounted(true);
  }, [deck_id]);

  useEffect(() => {
    if (!deck || deck.cards.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentCardIndex > 0) {
        setCurrentCardIndex((i) => i - 1);
        setIsFlipped(false);
      } else if (e.key === "ArrowRight" && currentCardIndex < deck.cards.length - 1) {
        setCurrentCardIndex((i) => i + 1);
        setIsFlipped(false);
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (debugStore) debugStore.recordFlip(deck.cards[currentCardIndex].id);
        setIsFlipped((f) => !f);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deck, currentCardIndex]);

  const handleNavigate = (index: number) => {
    setCurrentCardIndex(index);
    setIsFlipped(false);
  };

  if (!mounted) {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="animate-pulse text-sm text-[#4A4A6A]">Loading…</div>
      </main>
    );
  }

  if (!deck) {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">Deck not found</h2>
          <p className="text-[#4A4A6A] text-sm mb-6">
            This deck may have been deleted or doesn't exist.
          </p>
          <Link
            href="/decks"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-all"
          >
            ← Back to My Decks
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E] truncate pr-4">
            {deck.title}
          </h1>
          <Link
            href="/decks"
            className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] shrink-0 transition-colors"
          >
            ← Back to My Decks
          </Link>
        </div>

        {/* Deck Review */}
        <div className="space-y-6 deck-prompt-enter">
          <FlashcardUI
            card={deck.cards[currentCardIndex]}
            isFlipped={isFlipped}
            onFlip={() => {
              if (debugStore) debugStore.recordFlip(deck.cards[currentCardIndex].id);
              setIsFlipped((f) => !f);
            }}
          />

          <NavigationOverlay
            currentIndex={currentCardIndex}
            total={deck.cards.length}
            onNavigate={handleNavigate}
          />

          {/* Keyboard hint */}
          <p className="text-center text-xs text-gray-400">
            Use ← → arrow keys to navigate · Space or Enter to flip
          </p>
        </div>
      </div>
    </main>
  );
}

export default function StudyDeckPage() {
  return (
    <Suspense fallback={
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="animate-pulse text-sm text-[#4A4A6A]">Loading…</div>
      </main>
    }>
      <StudyContent />
    </Suspense>
  );
}
