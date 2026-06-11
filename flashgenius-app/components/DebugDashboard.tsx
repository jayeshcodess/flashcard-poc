"use client";

import { useEffect, useState } from "react";
import { debugStore } from "@/utils/debugStore";

export default function DebugDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState(debugStore?.metrics);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle with Ctrl+Shift+D or Cmd+Shift+D
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setIsVisible((v) => !v);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!debugStore) return;
    const unsubscribe = debugStore.subscribe(() => {
      if (debugStore) {
        setMetrics({ ...debugStore.metrics });
      }
    });
    
    // Update session duration every minute
    const interval = setInterval(() => {
      if (debugStore) debugStore.notify();
    }, 60000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  if (!isVisible || !metrics) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-xl shadow-2xl z-50 text-xs font-mono w-80 border border-gray-700">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-700">
        <h3 className="font-bold text-sm">Debug Dashboard</h3>
        <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Status Flags */}
        <div>
          <div className="font-semibold text-gray-400 mb-1">Status Flags</div>
          <div className="flex justify-between">
            <span>Gen Health:</span>
            <span className={
              metrics.generationHealth === "Green" ? "text-emerald-400" :
              metrics.generationHealth === "Yellow" ? "text-amber-400" : "text-red-400"
            }>{metrics.generationHealth}</span>
          </div>
          <div className="flex justify-between">
            <span>localStorage:</span>
            <span className={metrics.localStorageStatus === "Available" ? "text-emerald-400" : "text-red-400"}>
              {metrics.localStorageStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Saved Deck:</span>
            <span>{metrics.savedDeckPresence}</span>
          </div>
        </div>

        {/* Counters */}
        <div>
          <div className="font-semibold text-gray-400 mb-1">Counters (Session)</div>
          <div className="flex justify-between">
            <span>Cards Generated:</span>
            <span>{metrics.cardsGenerated}</span>
          </div>
          <div className="flex justify-between">
            <span>Cards Flipped:</span>
            <span>{metrics.cardsFlipped}</span>
          </div>
          <div className="flex justify-between">
            <span>Decks Saved:</span>
            <span>{metrics.decksSaved}</span>
          </div>
        </div>

        {/* Timing Metrics */}
        <div>
          <div className="font-semibold text-gray-400 mb-1">Timing Metrics</div>
          <div className="flex justify-between">
            <span>Last Gen Time:</span>
            <span>{metrics.lastGenerationDuration.toFixed(2)}s</span>
          </div>
          <div className="flex justify-between">
            <span>Session Length:</span>
            <span>{metrics.sessionDuration}m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
