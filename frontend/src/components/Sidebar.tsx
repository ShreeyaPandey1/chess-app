import React from 'react';
import { Swords, Bot, Trophy, Puzzle, Settings, Shield, Flame } from 'lucide-react';
import type { GameMode } from '../types/chess';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  resetGame: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  gameMode,
  setGameMode,
  resetGame,
}) => {
  return (
    <aside className="w-64 bg-[#262421] border-r border-[#312e2b] flex flex-col justify-between p-4 select-none shrink-0">
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-[#363431]">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-700 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-none tracking-wide">CHESS<span className="text-emerald-500">.CORE</span></h1>
            <p className="text-xs text-gray-400 mt-1">Full-Stack Platform</p>
          </div>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('play')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'play'
                ? 'bg-[#363431] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-[#2b2926]'
            }`}
          >
            <Swords className="w-5 h-5 text-emerald-500" />
            <span>Play Arena</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('play');
              setGameMode('vs-computer');
              resetGame();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              gameMode === 'vs-computer' && activeTab === 'play'
                ? 'bg-[#363431] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-[#2b2926]'
            }`}
          >
            <Bot className="w-5 h-5 text-blue-400" />
            <span>VS Stockfish Bot</span>
          </button>

          <button
            onClick={() => setActiveTab('puzzles')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'puzzles'
                ? 'bg-[#363431] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-[#2b2926]'
            }`}
          >
            <Puzzle className="w-5 h-5 text-amber-400" />
            <span>Daily Puzzles</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-[#363431] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-[#2b2926]'
            }`}
          >
            <Trophy className="w-5 h-5 text-purple-400" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-[#363431] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-[#2b2926]'
            }`}
          >
            <Settings className="w-5 h-5 text-gray-400" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      <div className="bg-[#1e1d1b] p-3 rounded-xl border border-[#312e2b] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-700/40 border border-emerald-500/30 rounded-full flex items-center justify-center font-bold text-emerald-400 text-sm">
            US
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Grandmaster</div>
            <div className="text-[11px] text-gray-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
              1540 Elo
            </div>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
      </div>
    </aside>
  );
};
