"use client";

interface NavigationOverlayProps {
  currentIndex: number;
  total: number;
  onNavigate: (index: number) => void;
}

export default function NavigationOverlay({
  currentIndex,
  total,
  onNavigate,
}: NavigationOverlayProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  return (
    <div className="flex items-center justify-center gap-6">
      <button
        onClick={() => onNavigate(currentIndex - 1)}
        disabled={isFirst}
        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
          isFirst
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:shadow-md active:scale-[0.97] cursor-pointer"
        }`}
      >
        ← Previous
      </button>

      <span className="text-sm font-medium text-[#4A4A6A] min-w-[90px] text-center">
        Card {currentIndex + 1} of {total}
      </span>

      <button
        onClick={() => onNavigate(currentIndex + 1)}
        disabled={isLast}
        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
          isLast
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:shadow-md active:scale-[0.97] cursor-pointer"
        }`}
      >
        Next →
      </button>
    </div>
  );
}
