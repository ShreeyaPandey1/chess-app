import React, { useEffect, useRef } from 'react';
import { Copy, FileText, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { MoveRecord } from '../../types/chess';

interface MoveHistoryProps {
  moveHistory: MoveRecord[];
  gameFen: string;
  previewIndex?: number | null;
  onNavigateHistory?: (target: 'first' | 'prev' | 'next' | 'live' | number) => void;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  moveHistory,
  gameFen,
  previewIndex = null,
  onNavigateHistory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedFen, setCopiedFen] = React.useState(false);

  useEffect(() => {
    if (scrollRef.current && previewIndex === null) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moveHistory, previewIndex]);

  const copyFenToClipboard = () => {
    navigator.clipboard.writeText(gameFen);
    setCopiedFen(true);
    setTimeout(() => setCopiedFen(false), 1500);
  };

  return (
    <div className="bg-[#21201d] border border-[#312e2b] rounded-xl flex flex-col h-full overflow-hidden">
      {/* Table Header */}
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

      {/* Move Rows */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-sm">
        {moveHistory.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-xs italic">
            No moves played yet. Drag a piece to start the game!
          </div>
        ) : (
          moveHistory.map((record, index) => {
            const whitePosIndex = index * 2 + 1;
            const blackPosIndex = index * 2 + 2;

            const isWhiteActive = previewIndex === whitePosIndex;
            const isBlackActive = previewIndex === blackPosIndex;

            return (
              <div
                key={record.moveNumber}
                className="grid grid-cols-7 px-3 py-1.5 rounded hover:bg-[#2b2926] transition text-xs items-center"
              >
                <span className="col-span-1 text-gray-500 font-bold">{record.moveNumber}.</span>
                <span
                  onClick={() => onNavigateHistory && onNavigateHistory(whitePosIndex)}
                  className={`col-span-3 font-semibold cursor-pointer px-1.5 py-0.5 rounded transition ${
                    isWhiteActive
                      ? 'bg-emerald-600/50 text-white font-bold ring-1 ring-emerald-400'
                      : 'text-slate-200 hover:text-emerald-300 hover:bg-[#363431]'
                  }`}
                  title="Click to view position"
                >
                  {record.white || ''}
                </span>
                <span
                  onClick={() => record.black && onNavigateHistory && onNavigateHistory(blackPosIndex)}
                  className={`col-span-3 cursor-pointer px-1.5 py-0.5 rounded transition ${
                    isBlackActive
                      ? 'bg-emerald-600/50 text-white font-bold ring-1 ring-emerald-400'
                      : 'text-slate-400 hover:text-emerald-300 hover:bg-[#363431]'
                  }`}
                  title={record.black ? 'Click to view position' : ''}
                >
                  {record.black || ''}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Playback Navigation Bar */}
      {onNavigateHistory && (
        <div className="border-t border-[#312e2b] bg-[#262421] px-3 py-2 flex items-center justify-between text-gray-300">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigateHistory('first')}
              className="p-1.5 hover:bg-[#363431] hover:text-white rounded transition"
              title="First move"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateHistory('prev')}
              className="p-1.5 hover:bg-[#363431] hover:text-white rounded transition"
              title="Previous move"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateHistory('next')}
              className="p-1.5 hover:bg-[#363431] hover:text-white rounded transition"
              title="Next move"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateHistory('live')}
              className="p-1.5 hover:bg-[#363431] hover:text-white rounded transition"
              title="Latest / Live move"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onNavigateHistory('live')}
            className={`text-xs px-2.5 py-1 rounded font-semibold transition ${
              previewIndex === null
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                : 'bg-[#312e2b] text-gray-300 hover:text-white'
            }`}
          >
            {previewIndex === null ? '● Live' : 'Go to Live'}
          </button>
        </div>
      )}
    </div>
  );
};
