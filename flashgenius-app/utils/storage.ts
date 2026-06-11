const STORAGE_KEY = "flashgenius_saved_decks";
const OLD_STORAGE_KEY = "flashgenius_saved_deck"; // Legacy key for migration

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
 * Retrieve all saved decks from localStorage.
 */
export function loadDecks(): SavedDeck[] {
  if (!isStorageAvailable()) return [];
  
  let decks: SavedDeck[] = [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      decks = JSON.parse(raw);
      if (!Array.isArray(decks)) decks = [];
    }
  } catch {
    decks = [];
  }

  // Legacy migration
  try {
    const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldRaw) {
      const oldDeck = JSON.parse(oldRaw);
      if (oldDeck && oldDeck.deck_id && !decks.some(d => d.deck_id === oldDeck.deck_id)) {
        decks.push(oldDeck);
        // Persist migration and remove old key
        localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
        localStorage.removeItem(OLD_STORAGE_KEY);
      }
    }
  } catch {}

  // Basic validation
  return decks.filter(
    (deck) => deck.deck_id && Array.isArray(deck.cards) && deck.cards.length > 0
  );
}

/**
 * Retrieve a specific saved deck by ID.
 */
export function loadDeck(deck_id: string): SavedDeck | null {
  const decks = loadDecks();
  return decks.find(d => d.deck_id === deck_id) || null;
}

/**
 * Check if any saved deck exists.
 */
export function hasSavedDeck(): boolean {
  return loadDecks().length > 0;
}

/**
 * Persist a deck to localStorage. Maximum of 10 decks allowed.
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

  const decks = loadDecks();
  
  if (decks.length >= 10) {
    throw new Error(
      "You can only save up to 10 decks. Please delete an old deck first."
    );
  }

  const deck: SavedDeck = {
    deck_id: `deck-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: title ?? `Study Deck — ${new Date().toLocaleDateString()}`,
    cards,
    saved_at: new Date().toISOString(),
  };

  decks.push(deck);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  } catch {
    throw new Error(
      "Storage is full. Replace an existing deck to save this one?"
    );
  }

  return deck;
}

/**
 * Remove a specific saved deck from localStorage.
 */
export function deleteDeck(deck_id: string): void {
  if (!isStorageAvailable()) return;
  const decks = loadDecks().filter(d => d.deck_id !== deck_id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

/**
 * Check if localStorage is available (for UI hints).
 */
export function canSave(): boolean {
  return isStorageAvailable();
}
