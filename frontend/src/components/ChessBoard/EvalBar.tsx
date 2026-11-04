import React from 'react';

interface EvalBarProps {
  score: number; // positive = white advantage, negative = black advantage
  orientation: 'white' | 'black';
}

export const EvalBar: React.FC<EvalBarProps> = ({ score, orientation }) => {
  // Sigmoid-like scaling: map centipawn/material score to percentage (5% to 95%)
  // Score +8 gives ~85%, +15 gives ~95%, -8 gives ~15%, 0 gives 50%
  const normalizedAdvantage = Math.max(-15, Math.min(15, score));
  const whitePercent = Math.max(
    5,
    Math.min(95, 50 + (normalizedAdvantage / (Math.abs(normalizedAdvantage) + 6)) * 50)
  );

  const displayPercent = orientation === 'white' ? whitePercent : 100 - whitePercent;

  // Format label: e.g. +1.5, -2.0, 0.0
  const formattedScore = score === 0 ? '0.0' : score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1);

  return (
    <div
      className="relative w-6 h-full min-h-[300px] bg-[#262421] rounded-lg overflow-hidden border border-[#363431] flex flex-col justify-end select-none shadow-md"
      title={`Evaluation: ${formattedScore}`}
    >
      {/* Black part (top when white oriented) */}
      <div className="absolute inset-0 bg-[#2b2926]" />

      {/* White part (bottom when white oriented) */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#eeeed2] transition-all duration-500 ease-out"
        style={{ height: `${displayPercent}%` }}
      />

      {/* Score Text Badge */}
      <div
        className={`relative z-10 w-full text-[10px] font-mono font-bold text-center py-1 transition-all ${
          (orientation === 'white' && score >= 0) || (orientation === 'black' && score <= 0)
            ? 'text-gray-900 mt-auto'
            : 'text-gray-100 mb-auto'
        }`}
      >
        {formattedScore}
      </div>
    </div>
  );
};
