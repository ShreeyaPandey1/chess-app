import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import {
  Puzzle,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Flame,
  Award,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { soundEngine } from '../utils/sound';
import type { BoardTheme, PuzzleItem } from '../types/chess';
import { BOARD_THEMES } from './ChessBoard/ChessBoardContainer';

const PUZZLE_COLLECTION: PuzzleItem[] = [
  {
    id: 'p1',
    title: "Scholar's Mate Finish",
    theme: 'Mate in 1',
    rating: 850,
    description: 'The Black king has no defenders. Strike down on the weak f7 square for immediate checkmate!',
    hint: 'Look at the battery between your Queen on f3 and Bishop on c4 pointing at f7.',
    fen: 'r1bqk2r/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/R1B1K2R w KQkq - 0 1',
    turn: 'w',
    solution: [{ from: 'f3', to: 'f7' }],
  },
  {
    id: 'p2',
    title: 'Deadly Royal Fork',
    theme: 'Knight Fork',
    rating: 1200,
    description: 'Black left c7 unguarded with both their King and Rook on the same diagonal files. Fork them!',
    hint: 'Move your knight to c7 with check.',
    fen: 'r3kb1r/pp1npppp/2p5/8/3N4/8/PPPP1PPP/R1B1K2R w KQkq - 0 1',
    turn: 'w',
    solution: [{ from: 'd4', to: 'c7' }],
  },
  {
    id: 'p3',
    title: 'Back-Rank Decimation',
    theme: 'Back-Rank Mate',
    rating: 1350,
    description: 'Black king is completely trapped behind their own pawns on the 8th rank. Deliver checkmate!',
    hint: 'Your Rook on d1 has a clear open file straight to the 8th rank.',
    fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
    turn: 'w',
    solution: [{ from: 'd1', to: 'd8' }],
  },
  {
    id: 'p4',
    title: 'Smothered King Strike',
    theme: 'Smothered Mate',
    rating: 1500,
    description: 'The enemy king is completely surrounded by friendly pieces in the corner. Leap in with the Knight!',
    hint: 'The knight on e5 can jump to f7 delivering an unblockable check.',
    fen: '6rk/5Npp/8/4N3/8/8/8/6K1 w - - 0 1',
    turn: 'w',
    solution: [{ from: 'e5', to: 'f7' }],
  },
  {
    id: 'p5',
    title: "Anastasia's Mate Network",
    theme: 'Checkmate Pattern',
    rating: 1650,
    description: 'Your Knight blocks the escape squares g8 and g6. Slide your Rook over to finish the king!',
    hint: 'Check on the open h-file with your Rook.',
    fen: '7k/5N1p/8/7R/8/8/8/6K1 w - - 0 1',
    turn: 'w',
    solution: [{ from: 'h5', to: 'h7' }],
  },
];

interface PuzzlesViewProps {
  boardTheme?: BoardTheme;
}

export const PuzzlesView: React.FC<PuzzlesViewProps> = ({ boardTheme = 'classic' }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentPuzzle = PUZZLE_COLLECTION[currentIdx];

  const [chess, setChess] = useState(() => new Chess(currentPuzzle.fen));
  const [gameFen, setGameFen] = useState(currentPuzzle.fen);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [puzzleFailed, setPuzzleFailed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(5);

  const themeColors = BOARD_THEMES[boardTheme] || BOARD_THEMES.classic;

  const loadPuzzle = (index: number) => {
    const p = PUZZLE_COLLECTION[index];
    setCurrentIdx(index);
    const newChess = new Chess(p.fen);
    setChess(newChess);
    setGameFen(p.fen);
    setPuzzleSolved(false);
    setPuzzleFailed(false);
    setShowHint(false);
  };

  const onPieceDrop = (sourceSquare: Square, targetSquare: Square) => {
    if (puzzleSolved) return false;

    try {
      const move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (move) {
        setGameFen(chess.fen());

        const expected = currentPuzzle.solution[0];
        if (sourceSquare === expected.from && targetSquare === expected.to) {
          setPuzzleSolved(true);
          setPuzzleFailed(false);
          soundEngine.playGameEnd(true);
          setStreak((s) => s + 1);
          return true;
        } else {
          setPuzzleFailed(true);
          soundEngine.playCapture();
          return true;
        }
      }
    } catch {
      return false;
    }
    return false;
  };

  const resetCurrentPuzzle = () => {
    chess.load(currentPuzzle.fen);
    setGameFen(currentPuzzle.fen);
    setPuzzleSolved(false);
    setPuzzleFailed(false);
    setShowHint(false);
  };

  return (
    <div className="flex-1 p-6 flex flex-col max-w-5xl mx-auto overflow-y-auto w-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Puzzle className="w-7 h-7 text-amber-400" />
            Tactics Arena
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Puzzle {currentIdx + 1} of {PUZZLE_COLLECTION.length} • {currentPuzzle.title}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#21201d] border border-[#312e2b] px-4 py-2 rounded-xl text-amber-400 font-bold text-sm">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            <span>Streak: {streak}</span>
          </div>

          <div className="flex items-center gap-2 bg-[#21201d] border border-[#312e2b] px-4 py-2 rounded-xl text-emerald-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>Rating: {currentPuzzle.rating}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Chessboard */}
        <div className="lg:col-span-7 aspect-square w-full max-w-[500px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-[#2b2926]">
          <Chessboard
            options={{
              position: gameFen,
              onPieceDrop: ({ sourceSquare, targetSquare }) =>
                onPieceDrop(sourceSquare as Square, (targetSquare || '') as Square),
              darkSquareStyle: { backgroundColor: themeColors.dark },
              lightSquareStyle: { backgroundColor: themeColors.light },
            }}
          />
        </div>

        {/* Puzzle Sidebar Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#21201d] border border-[#312e2b] p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-amber-950/80 text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {currentPuzzle.theme}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {currentPuzzle.turn === 'w' ? 'White to move' : 'Black to move'}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {currentPuzzle.title}
            </h3>

            <p className="text-sm text-gray-300 leading-relaxed">{currentPuzzle.description}</p>

            {/* Hint Box */}
            {showHint && (
              <div className="bg-[#2b2926] border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300 animate-fadeIn">
                <span className="font-bold">Hint:</span> {currentPuzzle.hint}
              </div>
            )}

            {/* Solved Status */}
            {puzzleSolved && (
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-xl text-emerald-300 text-sm font-semibold flex items-center gap-3 animate-fadeIn">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-base text-white">Puzzle Solved!</div>
                  <div className="text-xs text-emerald-300">Great vision! +15 Puzzle Rating</div>
                </div>
              </div>
            )}

            {/* Failed Status */}
            {puzzleFailed && (
              <div className="bg-red-950/80 border border-red-500/50 p-4 rounded-xl text-red-300 text-sm font-semibold animate-fadeIn">
                Not the best move. Try again!
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={resetCurrentPuzzle}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2b2926] hover:bg-[#363431] text-white font-bold py-2.5 rounded-xl transition border border-[#363431] text-xs"
              >
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>Retry</span>
              </button>

              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center justify-center gap-1.5 bg-[#2b2926] hover:bg-[#363431] text-amber-400 font-bold px-4 py-2.5 rounded-xl transition border border-[#363431] text-xs"
                title="Show tactical hint"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Hint</span>
              </button>
            </div>
          </div>

          {/* Puzzle Navigation Carousel */}
          <div className="bg-[#21201d] border border-[#312e2b] p-4 rounded-2xl flex items-center justify-between">
            <button
              onClick={() => loadPuzzle(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-[#2b2926] text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-mono text-gray-400">
              {currentIdx + 1} / {PUZZLE_COLLECTION.length}
            </span>

            <button
              onClick={() => loadPuzzle(Math.min(PUZZLE_COLLECTION.length - 1, currentIdx + 1))}
              disabled={currentIdx === PUZZLE_COLLECTION.length - 1}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
