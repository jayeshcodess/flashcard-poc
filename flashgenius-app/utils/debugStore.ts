export type DebugMetrics = {
  generationHealth: "Green" | "Yellow" | "Red";
  localStorageStatus: "Available" | "Unavailable";
  savedDeckPresence: "Yes" | "No";
  cardsGenerated: number;
  cardsFlipped: number;
  decksSaved: number;
  lastGenerationDuration: number;
  sessionDuration: number;
  sessionStart: number;
  flippedCardIds: Set<string>;
};

class DebugStore {
  metrics: DebugMetrics = {
    generationHealth: "Green",
    localStorageStatus: "Available",
    savedDeckPresence: "No",
    cardsGenerated: 0,
    cardsFlipped: 0,
    decksSaved: 0,
    lastGenerationDuration: 0,
    sessionDuration: 0,
    sessionStart: Date.now(),
    flippedCardIds: new Set(),
  };

  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.metrics.sessionDuration = Math.floor(
      (Date.now() - this.metrics.sessionStart) / 60000
    );
    this.listeners.forEach((l) => l());
  }

  update(partial: Partial<Omit<DebugMetrics, "flippedCardIds" | "sessionStart">>) {
    Object.assign(this.metrics, partial);
    this.notify();
  }

  recordFlip(cardId: string) {
    if (!this.metrics.flippedCardIds.has(cardId)) {
      this.metrics.flippedCardIds.add(cardId);
      this.metrics.cardsFlipped = this.metrics.flippedCardIds.size;
      this.notify();
    }
  }
}

export const debugStore = typeof window !== "undefined" ? new DebugStore() : null;
