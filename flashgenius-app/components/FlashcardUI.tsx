"use client";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface FlashcardUIProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

import { debugStore } from "@/utils/debugStore";

export default function FlashcardUI({ card, isFlipped, onFlip }: FlashcardUIProps) {
  const handleFlip = () => {
    if (debugStore) {
      debugStore.recordFlip(card.id);
    }
    onFlip();
  };

  return (
    <div
      className="flip-container w-full max-w-[520px] h-[300px] mx-auto cursor-pointer"
      onClick={handleFlip}
    >
      <div className={`flip-inner ${isFlipped ? "flipped" : ""}`}>
        {/* Front — Question */}
        <div className="flip-face bg-white border border-[#E2E8F0] shadow-md hover:shadow-xl transition-shadow duration-200">
          <div className="text-center px-6">
            <span className="inline-block text-xs font-bold text-white bg-[#4F46E5] rounded-full px-3 py-1 mb-4">
              Q
            </span>
            <p className="text-xl font-semibold font-[family-name:var(--font-source-serif)] text-[#1A1A2E] leading-relaxed">
              {card.question}
            </p>
          </div>
        </div>

        {/* Back — Answer */}
        <div className="flip-face flip-back bg-[#EFF6FF] border border-[#E2E8F0] shadow-md">
          <div className="text-center px-6">
            <span className="inline-block text-xs font-bold text-white bg-[#16A34A] rounded-full px-3 py-1 mb-4">
              A
            </span>
            <p className="text-lg font-[family-name:var(--font-source-serif)] text-[#4A4A6A] leading-relaxed">
              {card.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
