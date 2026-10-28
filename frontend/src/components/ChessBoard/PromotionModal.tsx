import React from 'react';

interface PromotionModalProps {
  color: 'w' | 'b';
  onSelect: (piece: string) => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({ color, onSelect }) => {
  const pieces = [
    { key: 'q', label: 'Queen', symbol: color === 'w' ? '♕' : '♛' },
    { key: 'r', label: 'Rook', symbol: color === 'w' ? '♖' : '♜' },
    { key: 'b', label: 'Bishop', symbol: color === 'w' ? '♗' : '♝' },
    { key: 'n', label: 'Knight', symbol: color === 'w' ? '♘' : '♞' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-[#21201d] border border-[#363431] p-5 rounded-2xl shadow-2xl max-w-xs w-full text-center">
        <h3 className="font-bold text-white text-base mb-1">Pawn Promotion</h3>
        <p className="text-xs text-gray-400 mb-4">Choose your replacement piece</p>

        <div className="grid grid-cols-4 gap-3">
          {pieces.map((p) => (
            <button
              key={p.key}
              onClick={() => onSelect(p.key)}
              className="flex flex-col items-center justify-center p-3 bg-[#2b2926] hover:bg-emerald-600 hover:text-white rounded-xl transition group border border-[#363431]"
            >
              <span className="text-3xl leading-none group-hover:scale-110 transition-transform">
                {p.symbol}
              </span>
              <span className="text-[10px] text-gray-400 group-hover:text-white mt-1 font-medium">
                {p.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
