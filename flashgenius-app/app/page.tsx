"use client";

import { useState, useEffect, useCallback } from "react";
import TextInputEngine from "@/components/TextInputEngine";
import FlashcardUI from "@/components/FlashcardUI";
import NavigationOverlay from "@/components/NavigationOverlay";
import SavedDeckPrompt from "@/components/SavedDeckPrompt";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  loadDecks,
  saveDeck,
  canSave,
} from "@/utils/storage";
import { generateFlashcards } from "@/utils/apiService";
import Link from "next/link";
import { debugStore } from "@/utils/debugStore";

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

export type LoadingState = "idle" | "loading" | "error";

type AppView = "checking" | "input" | "deck";

export default function Page() {
  const [inputText, setInputText] = useState("");
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [deckTopic, setDeckTopic] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [appView, setAppView] = useState<AppView>("checking");

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );

  const [hasDecks, setHasDecks] = useState(false);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      setToastMessage(message);
      setToastType(type);
      setToastVisible(true);
    },
    []
  );

  // On mount: check for saved decks
  useEffect(() => {
    const saved = loadDecks();
    setHasDecks(saved.length > 0);
    
    // Update dashboard metrics on mount
    if (debugStore) {
      debugStore.update({
        localStorageStatus: canSave() ? "Available" : "Unavailable",
        savedDeckPresence: saved.length > 0 ? "Yes" : "No",
      });
    }

    setAppView("input");
  }, []);

  // Keyboard navigation for deck view
  useEffect(() => {
    if (appView !== "deck" || deck.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentCardIndex > 0) {
        setCurrentCardIndex((i) => i - 1);
        setIsFlipped(false);
      } else if (
        e.key === "ArrowRight" &&
        currentCardIndex < deck.length - 1
      ) {
        setCurrentCardIndex((i) => i + 1);
        setIsFlipped(false);
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (debugStore) debugStore.recordFlip(deck[currentCardIndex].id);
        setIsFlipped((f) => !f);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appView, deck, currentCardIndex]);

  const handleGenerate = async () => {
    setLoadingState("loading");
    setErrorMessage("");
    const startTime = Date.now();

    try {
      const result = await generateFlashcards(inputText.trim());
      const cards = result.cards;
      const topic = result.topic;
      
      const durationSecs = (Date.now() - startTime) / 1000;
      if (debugStore) {
        debugStore.update({
          generationHealth: durationSecs > 3 ? "Yellow" : "Green",
          lastGenerationDuration: durationSecs,
          cardsGenerated: (debugStore.metrics.cardsGenerated || 0) + cards.length,
        });
      }

      setDeck(cards);
      setDeckTopic(topic);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setLoadingState("idle");
      setAppView("deck");
    } catch (err) {
      if (debugStore) {
        debugStore.update({
          generationHealth: "Red",
          lastGenerationDuration: (Date.now() - startTime) / 1000,
        });
      }
      setErrorMessage(
        err instanceof Error ? err.message : "Generation failed. Please retry."
      );
      setLoadingState("error");
    }
  };

  const handleSaveDeck = () => {
    if (!canSave()) {
      showToast(
        "Saving is not available in your current browser mode.",
        "error"
      );
      return;
    }

    try {
      saveDeck(deck, deckTopic);
      setHasDecks(true);
      if (debugStore) {
        debugStore.update({
          savedDeckPresence: "Yes",
          decksSaved: (debugStore.metrics.decksSaved || 0) + 1,
        });
      }
      showToast("Deck saved successfully!", "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to save deck.",
        "error"
      );
    }
  };



  const handleNewDeck = () => {
    setDeck([]);
    setDeckTopic("");
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setInputText("");
    setLoadingState("idle");
    setErrorMessage("");
    setAppView("input");
  };

  const handleNavigate = (index: number) => {
    setCurrentCardIndex(index);
    setIsFlipped(false);
  };

  // Don't render until we've checked localStorage
  if (appView === "checking") {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="animate-pulse text-sm text-[#4A4A6A]">Loading…</div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="relative text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-1">
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
                Flash
              </span>
              <span className="text-[#1A1A2E]">Genius</span>
            </h1>
            <p className="text-[#4A4A6A] text-sm">
              Paste your notes. Generate flashcards. Study smarter.
            </p>
            {hasDecks && (
              <div className="absolute top-0 right-0">
                <Link
                  href="/decks"
                  className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
                >
                  My Decks →
                </Link>
              </div>
            )}
          </div>

          {/* View: Text Input */}
          {appView === "input" && (
            <div className="deck-prompt-enter bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-8">
              <TextInputEngine
                inputText={inputText}
                setInputText={setInputText}
                loadingState={loadingState}
                errorMessage={errorMessage}
                onGenerate={handleGenerate}
              />
            </div>
          )}

          {/* View: Deck Review */}
          {appView === "deck" && deck.length > 0 && (
            <div className="space-y-6 deck-prompt-enter">
              <FlashcardUI
                card={deck[currentCardIndex]}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped((f) => !f)}
              />

              <NavigationOverlay
                currentIndex={currentCardIndex}
                total={deck.length}
                onNavigate={handleNavigate}
              />

              {/* Keyboard hint */}
              <p className="text-center text-xs text-gray-400">
                Use ← → arrow keys to navigate · Space or Enter to flip
              </p>

              {/* Save & New Deck Buttons */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  id="save-deck-btn"
                  onClick={handleSaveDeck}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                             bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md
                             active:scale-[0.97] transition-all cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Deck
                </button>
                <button
                  id="new-deck-btn"
                  onClick={handleNewDeck}
                  className="text-sm text-[#4F46E5] hover:text-[#4338CA] underline underline-offset-2
                             transition-colors cursor-pointer"
                >
                  ← Generate New Deck
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />

    </>
  );
}
