import React from 'react';
import { Chessboard } from 'react-chessboard';
import type { Square } from 'chess.js';
import { PlayerCard } from './PlayerCard';
import { PromotionModal } from './PromotionModal';
import { EvalBar } from './EvalBar';
import { Trophy, AlertCircle, Eye, Play } from 'lucide-react';
import type { PlayerInfo, GameStatus, BoardTheme } from '../../types/chess';

export const BOARD_THEMES: Record<BoardTheme, { dark: string; light: string }> = {
  classic: { dark: '#769656', light: '#eeeed2' },
  wood: { dark: '#b58863', light: '#f0d9b5' },
  ocean: { dark: '#4e7894', light: '#c4d6e0' },
};

interface ChessBoardContainerProps {
  gameFen: string;
  boardOrientation: 'white' | 'black';
  boardTheme?: BoardTheme;
  evalScore?: number;
  isViewingHistory?: boolean;
  onReturnToLive?: () => void;
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
  boardTheme = 'classic',
  evalScore = 0,
  isViewingHistory = false,
  onReturnToLive,
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

  const themeColors = BOARD_THEMES[boardTheme] || BOARD_THEMES.classic;

  return (
    <div className="flex flex-col gap-3 w-full max-w-[650px] mx-auto select-none">
      {/* Top Player Card */}
      <PlayerCard
        player={topPlayer}
        isActiveTurn={turn === topPlayer.color && gameStatus === 'active'}
        capturedPieces={topCaptured}
        advantageScore={topAdvantage > 0 ? topAdvantage : 0}
      />

      {/* Main Board Row with Evaluation Bar */}
      <div className="flex gap-2.5 items-stretch">
        {/* Dynamic Evaluation Bar */}
        <EvalBar score={evalScore} orientation={boardOrientation} />

        {/* Board Container */}
        <div className="relative aspect-square flex-1 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#2b2926] bg-[#1a1917]">
          {/* History Preview Banner */}
          {isViewingHistory && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-blue-600/90 text-white font-semibold text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-2 backdrop-blur-sm">
              <Eye className="w-3.5 h-3.5" />
              <span>Reviewing past move</span>
              {onReturnToLive && (
                <button
                  onClick={onReturnToLive}
                  className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition"
                >
                  <Play className="w-2.5 h-2.5 fill-white" />
                  Live
                </button>
              )}
            </div>
          )}

          {/* Check Indicator Banner */}
          {inCheck && gameStatus === 'active' && !isViewingHistory && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-red-600/90 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
              <AlertCircle className="w-4 h-4" />
              <span>CHECK!</span>
            </div>
          )}

          <Chessboard
            options={{
              position: gameFen,
              boardOrientation,
              onSquareClick: ({ square }) => !isViewingHistory && onSquareClick(square as Square),
              onPieceDrop: ({ sourceSquare, targetSquare }) =>
                !isViewingHistory && onPieceDrop(sourceSquare as Square, (targetSquare || '') as Square),
              squareStyles: isViewingHistory ? {} : optionSquares,
              boardStyle: {
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              },
              darkSquareStyle: { backgroundColor: themeColors.dark },
              lightSquareStyle: { backgroundColor: themeColors.light },
              animationDurationInMs: 200,
            }}
          />

          {/* Game Over Banner Overlay */}
          {gameStatus !== 'active' && !isViewingHistory && (
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
      </div>

      {/* Bottom Player Card */}
      <PlayerCard
        player={bottomPlayer}
        isActiveTurn={turn === bottomPlayer.color && gameStatus === 'active'}
        capturedPieces={bottomCaptured}
        advantageScore={bottomAdvantage > 0 ? bottomAdvantage : 0}
      />

      {/* Promotion Dialog */}
      {pendingPromotion && <PromotionModal color={turn} onSelect={handlePromotionSelect} />}
    </div>
  );
};
