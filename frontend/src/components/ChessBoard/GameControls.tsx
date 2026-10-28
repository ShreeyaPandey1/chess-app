import React from 'react';
import { RotateCcw, RefreshCw, Volume2, VolumeX, Flag, Play } from 'lucide-react';
import { TIME_CONTROLS } from '../../hooks/useChessGame';

interface GameControlsProps {
  resetGame: (tcKey?: string) => void;
  flipBoard: () => void;
  undoMove: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  timeControlKey: string;
  setTimeControlKey: (key: string) => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  resetGame,
  flipBoard,
  undoMove,
  soundEnabled,
  setSoundEnabled,
  timeControlKey,
  setTimeControlKey,
}) => {
  return (
    <div className="bg-[#21201d] border border-[#312e2b] p-3 rounded-xl space-y-3">
      <div className="flex items-center gap-2">
        <select
          value={timeControlKey}
          onChange={(e) => {
            setTimeControlKey(e.target.value);
            resetGame(e.target.value);
          }}
          className="flex-1 bg-[#2b2926] border border-[#363431] text-white text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
        >
          {Object.entries(TIME_CONTROLS).map(([key, tc]) => (
            <option key={key} value={key}>
              ⚡ {tc.name} {tc.incrementSeconds > 0 ? `(+${tc.incrementSeconds}s)` : ''}
            </option>
          ))}
        </select>

        <button
          onClick={() => resetGame()}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-md shadow-emerald-950/40"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>New Game</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={flipBoard}
          className="flex flex-col items-center justify-center gap-1 bg-[#2b2926] hover:bg-[#363431] text-gray-300 hover:text-white p-2 rounded-lg text-[11px] font-medium transition border border-[#363431]"
          title="Flip board orientation"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>Flip</span>
        </button>

        <button
          onClick={undoMove}
          className="flex flex-col items-center justify-center gap-1 bg-[#2b2926] hover:bg-[#363431] text-gray-300 hover:text-white p-2 rounded-lg text-[11px] font-medium transition border border-[#363431]"
          title="Undo last move"
        >
          <RotateCcw className="w-4 h-4 text-blue-400" />
          <span>Undo</span>
        </button>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex flex-col items-center justify-center gap-1 bg-[#2b2926] hover:bg-[#363431] text-gray-300 hover:text-white p-2 rounded-lg text-[11px] font-medium transition border border-[#363431]"
          title="Toggle move audio effects"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-amber-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-red-400" />
          )}
          <span>Sound</span>
        </button>

        <button
          onClick={() => resetGame()}
          className="flex flex-col items-center justify-center gap-1 bg-[#2b2926] hover:bg-[#363431] text-gray-300 hover:text-red-400 p-2 rounded-lg text-[11px] font-medium transition border border-[#363431]"
          title="Resign current match"
        >
          <Flag className="w-4 h-4 text-red-500" />
          <span>Resign</span>
        </button>
      </div>
    </div>
  );
};
