import React, { useEffect, useRef } from 'react';
import { Copy, FileText, Check } from 'lucide-react';
import type { MoveRecord } from '../../types/chess';

interface MoveHistoryProps {
  moveHistory: MoveRecord[];
  gameFen: string;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moveHistory, gameFen }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedFen, setCopiedFen] = React.useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moveHistory]);

  const copyFenToClipboard = () => {
    navigator.clipboard.writeText(gameFen);
    setCopiedFen(true);
    setTimeout(() => setCopiedFen(false), 1500);
  };

  return (
    <div className="bg-[#21201d] border border-[#312e2b] rounded-xl flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#312e2b] bg-[#262421]">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-500" />
          Move History
        </h3>
        <button
          onClick={copyFenToClipboard}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-[#312e2b] hover:bg-[#3d3a36] px-2.5 py-1 rounded transition"
          title="Copy current FEN position"
        >
          {copiedFen ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy FEN</span>
            </>
          )}
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-sm">
        {moveHistory.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-xs italic">
            No moves played yet. Drag a piece to start the game!
          </div>
        ) : (
          moveHistory.map((record) => (
            <div
              key={record.moveNumber}
              className="grid grid-cols-7 px-3 py-1.5 rounded hover:bg-[#2b2926] transition text-xs"
            >
              <span className="col-span-1 text-gray-500 font-bold">{record.moveNumber}.</span>
              <span className="col-span-3 text-slate-200 font-semibold">{record.white || ''}</span>
              <span className="col-span-3 text-slate-400">{record.black || ''}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
