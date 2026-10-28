import React from 'react';
import { Chessboard } from 'react-chessboard';
import type { Square } from 'chess.js';
import { PlayerCard } from './PlayerCard';
import { PromotionModal } from './PromotionModal';
import { Trophy, AlertCircle } from 'lucide-react';
import type { PlayerInfo, GameStatus } from '../../types/chess';

interface ChessBoardContainerProps {
  gameFen: string;
  boardOrientation: 'white' | 'black';
  onSquareClick: (square: Square) => void;
  onPieceDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
  optionSquares: Record<string, { background: string; borderRadius?: string }>;
  pendingPromotion: { from: Square; to: Square } | null;
  handlePromotionSelect: (piece: string) => void;
  whitePlayer: PlayerInfo;
  blackPlayer: PlayerInfo;
  turn: 'w' | 'b';
  inCheck: boolean;
  gameStatus: GameStatus;
  winner: 'w' | 'b' | 'draw' | null;
  capturedPieces: {
    whiteCaptured: Record<string, number>;
    blackCaptured: Record<string, number>;
    advantage: number;
  };
  resetGame: () => void;
}

export const ChessBoardContainer: React.FC<ChessBoardContainerProps> = ({
  gameFen,
  boardOrientation,
  onSquareClick,
  onPieceDrop,
  optionSquares,
  pendingPromotion,
  handlePromotionSelect,
  whitePlayer,
  blackPlayer,
  turn,
  inCheck,
  gameStatus,
  winner,
  capturedPieces,
  resetGame,
}) => {
  const topPlayer = boardOrientation === 'white' ? blackPlayer : whitePlayer;
  const bottomPlayer = boardOrientation === 'white' ? whitePlayer : blackPlayer;

  const topCaptured = boardOrientation === 'white' ? capturedPieces.blackCaptured : capturedPieces.whiteCaptured;
  const bottomCaptured = boardOrientation === 'white' ? capturedPieces.whiteCaptured : capturedPieces.blackCaptured;

  const topAdvantage = boardOrientation === 'white' ? -capturedPieces.advantage : capturedPieces.advantage;
  const bottomAdvantage = boardOrientation === 'white' ? capturedPieces.advantage : -capturedPieces.advantage;

  return (
    <div className="flex flex-col gap-3 w-full max-w-[620px] mx-auto select-none">
      <PlayerCard
        player={topPlayer}
        isActiveTurn={turn === topPlayer.color && gameStatus === 'active'}
        capturedPieces={topCaptured}
        advantageScore={topAdvantage > 0 ? topAdvantage : 0}
      />

      <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-[#2b2926] bg-[#1a1917]">
        {inCheck && gameStatus === 'active' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-red-600/90 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
            <AlertCircle className="w-4 h-4" />
            <span>CHECK!</span>
          </div>
        )}

        <Chessboard
          options={{
            position: gameFen,
            boardOrientation,
            onSquareClick: ({ square }) => onSquareClick(square as Square),
            onPieceDrop: ({ sourceSquare, targetSquare }) => onPieceDrop(sourceSquare as Square, (targetSquare || '') as Square),
            squareStyles: optionSquares,
            boardStyle: {
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            },
            darkSquareStyle: { backgroundColor: '#769656' },
            lightSquareStyle: { backgroundColor: '#eeeed2' },
            animationDurationInMs: 200,
          }}
        />

        {gameStatus !== 'active' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center z-30 animate-fadeIn">
            <div className="bg-[#262421] border border-[#363431] p-6 rounded-2xl text-center max-w-xs shadow-2xl space-y-4">
              <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto text-amber-400">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-white">
                  {gameStatus === 'checkmate'
                    ? 'CHECKMATE!'
                    : gameStatus === 'timeout'
                    ? 'TIME OUT!'
                    : 'DRAW!'}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {winner === 'draw'
                    ? 'Game ended in a draw'
                    : `${winner === 'w' ? 'White' : 'Black'} wins the game!`}
                </p>
              </div>

              <button
                onClick={() => resetGame()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/50"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <PlayerCard
        player={bottomPlayer}
        isActiveTurn={turn === bottomPlayer.color && gameStatus === 'active'}
        capturedPieces={bottomCaptured}
        advantageScore={bottomAdvantage > 0 ? bottomAdvantage : 0}
      />

      {pendingPromotion && (
        <PromotionModal
          color={turn}
          onSelect={handlePromotionSelect}
        />
      )}
    </div>
  );
};
