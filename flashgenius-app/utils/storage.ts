const STORAGE_KEY = "flashgenius_saved_deck";

export interface SavedDeck {
  deck_id: string;
  title: string;
  cards: { id: string; question: string; answer: string }[];
  saved_at: string;
}

/**
 * Check whether localStorage is available and writable.
 */
function isStorageAvailable(): boolean {
  try {
    const testKey = "__flashgenius_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieve the saved deck from localStorage, or null if none exists.
 */
export function loadDeck(): SavedDeck | null {
  if (!isStorageAvailable()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: SavedDeck = JSON.parse(raw);
    // Basic shape validation
    if (
      !parsed.deck_id ||
      !Array.isArray(parsed.cards) ||
      parsed.cards.length === 0
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Check if a saved deck already exists in localStorage.
 */
export function hasSavedDeck(): boolean {
  return loadDeck() !== null;
}

/**
 * Persist a deck to localStorage. Overwrites any existing deck.
 */
export function saveDeck(
  cards: { id: string; question: string; answer: string }[],
  title?: string
): SavedDeck {
  if (!isStorageAvailable()) {
    throw new Error(
      "Saving is not available in your current browser mode. Local storage is disabled or full."
    );
  }

  const deck: SavedDeck = {
    deck_id: `deck-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: title ?? `Study Deck — ${new Date().toLocaleDateString()}`,
    cards,
    saved_at: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
  } catch {
    throw new Error(
      "Storage is full. Could not save the deck. Try clearing browser data."
    );
  }

  return deck;
}

/**
 * Remove the saved deck from localStorage.
 */
export function deleteDeck(): void {
  if (!isStorageAvailable()) return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if localStorage is available (for UI hints).
 */
export function canSave(): boolean {
  return isStorageAvailable();
}
