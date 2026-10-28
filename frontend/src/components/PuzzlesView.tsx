import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import { Puzzle, Sparkles, CheckCircle2, RefreshCw, Flame, Award } from 'lucide-react';
import { soundEngine } from '../utils/sound';

export const PuzzlesView: React.FC = () => {
  const initialFen = 'r1bqk2r/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/R1B1K2R w KQkq - 0 1';
  const [chess] = useState(new Chess(initialFen));
  const [gameFen, setGameFen] = useState(initialFen);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [puzzleFailed, setPuzzleFailed] = useState(false);
  const [streak, setStreak] = useState(5);

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
        soundEngine.playMove();

        if (sourceSquare === 'f3' && targetSquare === 'f7') {
          setPuzzleSolved(true);
          soundEngine.playCheck();
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

  const resetPuzzle = () => {
    chess.load(initialFen);
    setGameFen(initialFen);
    setPuzzleSolved(false);
    setPuzzleFailed(false);
  };

  return (
    <div className="flex-1 p-6 flex flex-col max-w-5xl mx-auto overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Puzzle className="w-7 h-7 text-amber-400" />
            Daily Tactics Puzzle
          </h2>
          <p className="text-sm text-gray-400 mt-1">White to move • Mate in 1</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#21201d] border border-[#312e2b] px-4 py-2 rounded-xl text-amber-400 font-bold text-sm">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            <span>Streak: {streak}</span>
          </div>

          <div className="flex items-center gap-2 bg-[#21201d] border border-[#312e2b] px-4 py-2 rounded-xl text-emerald-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>Rating: 1650</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 aspect-square w-full max-w-[500px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-[#2b2926]">
          <Chessboard
            options={{
              position: gameFen,
              onPieceDrop: ({ sourceSquare, targetSquare }) => onPieceDrop(sourceSquare as Square, (targetSquare || '') as Square),
              darkSquareStyle: { backgroundColor: '#769656' },
              lightSquareStyle: { backgroundColor: '#eeeed2' },
            }}
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#21201d] border border-[#312e2b] p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Puzzle Instructions
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Find the strongest tactical continuation for White to achieve checkmate on the black king!
            </p>

            {puzzleSolved && (
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-xl text-emerald-300 text-sm font-semibold flex items-center gap-3 animate-fadeIn">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-base text-white">Puzzle Solved!</div>
                  <div className="text-xs text-emerald-300">Great vision! +12 Puzzle Rating</div>
                </div>
              </div>
            )}

            {puzzleFailed && (
              <div className="bg-red-950/80 border border-red-500/50 p-4 rounded-xl text-red-300 text-sm font-semibold animate-fadeIn">
                Incorrect move. Try again!
              </div>
            )}

            <button
              onClick={resetPuzzle}
              className="w-full flex items-center justify-center gap-2 bg-[#2b2926] hover:bg-[#363431] text-white font-bold py-3 rounded-xl transition border border-[#363431]"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>Retry Puzzle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
