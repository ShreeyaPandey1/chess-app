import React from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const players = [
    { rank: 1, name: 'Magnus Carlsen', title: 'GM', rating: 2882, country: '🇳🇴', winRate: '78%' },
    { rank: 2, name: 'Hikaru Nakamura', title: 'GM', rating: 2875, country: '🇺🇸', winRate: '75%' },
    { rank: 3, name: 'Alireza Firouzja', title: 'GM', rating: 2805, country: '🇫🇷', winRate: '72%' },
    { rank: 4, name: 'Fabiano Caruana', title: 'GM', rating: 2795, country: '🇺🇸', winRate: '71%' },
    { rank: 5, name: 'Gukesh D', title: 'GM', rating: 2794, country: '🇮🇳', winRate: '70%' },
    { rank: 6, name: 'Nodirbek Abdusattorov', title: 'GM', rating: 2783, country: '🇺🇿', winRate: '69%' },
    { rank: 7, name: 'Praggnanandhaa R', title: 'GM', rating: 2778, country: '🇮🇳', winRate: '68%' },
  ];

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full flex flex-col overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Trophy className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Global Leaderboard</h2>
          <p className="text-sm text-gray-400">Top ranked players worldwide</p>
        </div>
      </div>

      <div className="bg-[#21201d] border border-[#312e2b] rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#262421] border-b border-[#312e2b] text-xs text-gray-400 font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Rank</th>
              <th className="py-4 px-6">Player</th>
              <th className="py-4 px-6">Title</th>
              <th className="py-4 px-6">Rating</th>
              <th className="py-4 px-6 text-right">Win Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d2b27] text-sm">
            {players.map((p) => (
              <tr key={p.rank} className="hover:bg-[#2b2926] transition">
                <td className="py-4 px-6 font-bold font-mono">
                  {p.rank === 1 ? (
                    <Crown className="w-5 h-5 text-amber-400" />
                  ) : p.rank === 2 ? (
                    <Medal className="w-5 h-5 text-slate-300" />
                  ) : p.rank === 3 ? (
                    <Medal className="w-5 h-5 text-amber-700" />
                  ) : (
                    <span className="text-gray-500">#{p.rank}</span>
                  )}
                </td>
                <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                  <span>{p.country}</span>
                  <span>{p.name}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="bg-amber-950 text-amber-400 border border-amber-500/30 text-[11px] font-extrabold px-2 py-0.5 rounded">
                    {p.title}
                  </span>
                </td>
                <td className="py-4 px-6 font-mono font-bold text-emerald-400">{p.rating}</td>
                <td className="py-4 px-6 text-right font-mono font-semibold text-gray-300">{p.winRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
