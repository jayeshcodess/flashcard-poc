"use client";

import { useState, useEffect, useCallback } from "react";
import TextInputEngine from "@/components/TextInputEngine";
import FlashcardUI from "@/components/FlashcardUI";
import NavigationOverlay from "@/components/NavigationOverlay";
import SavedDeckPrompt from "@/components/SavedDeckPrompt";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  loadDeck,
  saveDeck,
  hasSavedDeck,
  canSave,
  type SavedDeck,
} from "@/utils/storage";

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

export type LoadingState = "idle" | "loading" | "error";

type AppView = "checking" | "saved-prompt" | "input" | "deck";

export default function Page() {
  const [inputText, setInputText] = useState("");
  const [deck, setDeck] = useState<Flashcard[]>([]);
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

  // Confirm dialog state
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Saved deck reference (for prompt)
  const [savedDeckData, setSavedDeckData] = useState<SavedDeck | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      setToastMessage(message);
      setToastType(type);
      setToastVisible(true);
    },
    []
  );

  // On mount: check for saved deck
  useEffect(() => {
    const saved = loadDeck();
    if (saved) {
      setSavedDeckData(saved);
      setAppView("saved-prompt");
    } else {
      setAppView("input");
    }
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
        setIsFlipped((f) => !f);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appView, deck.length, currentCardIndex]);

  const handleGenerate = async () => {
    setLoadingState("loading");
    setErrorMessage("");

    try {
      const { generateFlashcards } = await import("@/utils/apiService");
      const cards = await generateFlashcards(inputText.trim());
      setDeck(cards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setLoadingState("idle");
      setAppView("deck");
    } catch (err) {
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

    // Check if a deck already exists
    if (hasSavedDeck()) {
      setConfirmVisible(true);
      return;
    }

    performSave();
  };

  const performSave = () => {
    try {
      saveDeck(deck);
      showToast("Deck saved successfully!", "success");
      setConfirmVisible(false);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to save deck.",
        "error"
      );
      setConfirmVisible(false);
    }
  };

  const handleLoadSaved = () => {
    if (savedDeckData) {
      setDeck(savedDeckData.cards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setAppView("deck");
      showToast("Saved deck loaded!", "info");
    }
  };

  const handleCreateNew = () => {
    setAppView("input");
  };

  const handleNewDeck = () => {
    setDeck([]);
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-1">
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
                Flash
              </span>
              <span className="text-[#1A1A2E]">Genius</span>
            </h1>
            <p className="text-[#4A4A6A] text-sm">
              Paste your notes. Generate flashcards. Study smarter.
            </p>
          </div>

          {/* View: Saved Deck Prompt */}
          {appView === "saved-prompt" && savedDeckData && (
            <SavedDeckPrompt
              savedDeck={savedDeckData}
              onLoad={handleLoadSaved}
              onCreateNew={handleCreateNew}
            />
          )}

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

      {/* Replace Existing Deck Confirmation */}
      <ConfirmDialog
        visible={confirmVisible}
        title="Replace Existing Deck?"
        message="You already have a saved deck. Saving this new deck will replace the previous one. This action cannot be undone."
        confirmLabel="Replace Existing Deck"
        cancelLabel="Cancel"
        onConfirm={performSave}
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
}
