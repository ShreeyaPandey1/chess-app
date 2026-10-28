import React from 'react';
import { Timer, User, Bot } from 'lucide-react';
import type { PlayerInfo } from '../../types/chess';

interface PlayerCardProps {
  player: PlayerInfo;
  isActiveTurn: boolean;
  capturedPieces: Record<string, number>;
  advantageScore?: number;
}

const PIECE_SYMBOLS: Record<string, string> = {
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛',
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isActiveTurn,
  capturedPieces,
  advantageScore = 0,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = player.timeLeft <= 10 && player.timeLeft > 0;

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
        isActiveTurn
          ? 'bg-[#2b2824] border-2 border-emerald-500/80 shadow-lg shadow-emerald-900/20'
          : 'bg-[#21201d] border border-[#312e2b]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${
              player.color === 'w'
                ? 'bg-slate-200 text-gray-900 border-white'
                : 'bg-slate-800 text-slate-100 border-slate-700'
            }`}
          >
            {player.isBot ? (
              <Bot className="w-5 h-5 text-blue-400" />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </div>
          {isActiveTurn && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#161512] animate-ping" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">{player.name}</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#312e2b] text-gray-400 font-mono">
              {player.rating}
            </span>
          </div>

          <div className="flex items-center gap-1 min-h-[20px] text-xs text-gray-400 mt-0.5">
            {Object.entries(capturedPieces).map(([piece, count]) => (
              <span key={piece} className="font-mono text-sm leading-none tracking-tighter">
                {PIECE_SYMBOLS[piece]?.repeat(count)}
              </span>
            ))}
            {advantageScore > 0 && (
              <span className="text-[11px] font-bold text-emerald-400 ml-1">
                +{advantageScore}
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-lg transition-all ${
          isLowTime
            ? 'bg-red-950/80 text-red-400 border border-red-500/50 animate-pulse'
            : isActiveTurn
            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
            : 'bg-[#181715] text-gray-400 border border-[#2b2926]'
        }`}
      >
        <Timer className={`w-4 h-4 ${isActiveTurn ? 'text-emerald-400' : 'text-gray-500'}`} />
        <span>{formatTime(player.timeLeft)}</span>
      </div>
    </div>
  );
};
