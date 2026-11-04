import React from 'react';
import { Settings, Palette, Volume2, ShieldCheck, Check } from 'lucide-react';
import type { BoardTheme } from '../types/chess';

interface SettingsViewProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  boardTheme: BoardTheme;
  setBoardTheme: (theme: BoardTheme) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  soundEnabled,
  setSoundEnabled,
  boardTheme,
  setBoardTheme,
}) => {
  return (
    <div className="flex-1 p-6 max-w-3xl mx-auto w-full flex flex-col overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <Settings className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Board & Game Settings</h2>
          <p className="text-sm text-gray-400">Customize your playing experience</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Audio Effects */}
        <div className="bg-[#21201d] border border-[#312e2b] p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-400" />
            Audio & Sound Effects
          </h3>

          <div className="flex items-center justify-between py-2 border-t border-[#2d2b27]">
            <div>
              <div className="font-semibold text-sm text-white">Piece Move & Capture Sounds</div>
              <div className="text-xs text-gray-400">Play real-time synthesized audio on moves & captures</div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                soundEnabled ? 'bg-emerald-600' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Board themes */}
        <div className="bg-[#21201d] border border-[#312e2b] p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-400" />
            Board Colors & Theme
          </h3>

          <div className="grid grid-cols-3 gap-4 pt-2">
            {/* Classic Green */}
            <div
              onClick={() => setBoardTheme('classic')}
              className={`p-3 bg-[#262421] rounded-xl cursor-pointer transition border-2 ${
                boardTheme === 'classic'
                  ? 'border-emerald-500 shadow-md shadow-emerald-950/40 ring-2 ring-emerald-500/20'
                  : 'border-[#363431] hover:border-gray-500'
              }`}
            >
              <div className="grid grid-cols-2 aspect-square rounded overflow-hidden mb-2 relative">
                <div className="bg-[#eeeed2]" />
                <div className="bg-[#769656]" />
                <div className="bg-[#769656]" />
                <div className="bg-[#eeeed2]" />
                {boardTheme === 'classic' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                )}
              </div>
              <div className="text-center font-bold text-xs text-white">Classic Green</div>
            </div>

            {/* Warm Wood */}
            <div
              onClick={() => setBoardTheme('wood')}
              className={`p-3 bg-[#262421] rounded-xl cursor-pointer transition border-2 ${
                boardTheme === 'wood'
                  ? 'border-emerald-500 shadow-md shadow-emerald-950/40 ring-2 ring-emerald-500/20'
                  : 'border-[#363431] hover:border-gray-500'
              }`}
            >
              <div className="grid grid-cols-2 aspect-square rounded overflow-hidden mb-2 relative">
                <div className="bg-[#f0d9b5]" />
                <div className="bg-[#b58863]" />
                <div className="bg-[#b58863]" />
                <div className="bg-[#f0d9b5]" />
                {boardTheme === 'wood' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                )}
              </div>
              <div className="text-center font-bold text-xs text-white">Warm Wood</div>
            </div>

            {/* Ice Blue / Ocean */}
            <div
              onClick={() => setBoardTheme('ocean')}
              className={`p-3 bg-[#262421] rounded-xl cursor-pointer transition border-2 ${
                boardTheme === 'ocean'
                  ? 'border-emerald-500 shadow-md shadow-emerald-950/40 ring-2 ring-emerald-500/20'
                  : 'border-[#363431] hover:border-gray-500'
              }`}
            >
              <div className="grid grid-cols-2 aspect-square rounded overflow-hidden mb-2 relative">
                <div className="bg-[#c4d6e0]" />
                <div className="bg-[#4e7894]" />
                <div className="bg-[#4e7894]" />
                <div className="bg-[#c4d6e0]" />
                {boardTheme === 'ocean' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                )}
              </div>
              <div className="text-center font-bold text-xs text-white">Ice Blue</div>
            </div>
          </div>
        </div>

        {/* Engine status */}
        <div className="bg-[#21201d] border border-[#312e2b] p-6 rounded-2xl space-y-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Rules & Engine Verification
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Rule engine powered strictly by <code className="text-emerald-400 font-mono">chess.js</code>. All moves,
            captures, pawn promotions, and checkmate situations are verified client- and server-side.
          </p>
        </div>
      </div>
    </div>
  );
};
