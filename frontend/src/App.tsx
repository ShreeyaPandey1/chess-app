import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChessBoardContainer } from './components/ChessBoard/ChessBoardContainer';
import { MoveHistory } from './components/ChessBoard/MoveHistory';
import { GameControls } from './components/ChessBoard/GameControls';
import { PuzzlesView } from './components/PuzzlesView';
import { LeaderboardView } from './components/LeaderboardView';
import { SettingsView } from './components/SettingsView';
import { useChessGame } from './hooks/useChessGame';
import { soundEngine } from './utils/sound';
import type { BoardTheme } from './types/chess';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('play');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [timeControlKey, setTimeControlKey] = useState<string>('blitz');
  const [boardTheme, setBoardTheme] = useState<BoardTheme>(() => {
    return (localStorage.getItem('chess_board_theme') as BoardTheme) || 'classic';
  });

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    soundEngine.setSoundEnabled(enabled);
  };

  const handleThemeChange = (theme: BoardTheme) => {
    setBoardTheme(theme);
    localStorage.setItem('chess_board_theme', theme);
  };

  const {
    gameFen,
    isViewingHistory,
    previewIndex,
    navigateHistory,
    gameMode,
    setGameMode,
    botDifficulty,
    setBotDifficulty,
    evalScore,
    gameStatus,
    winner,
    whiteTime,
    blackTime,
    boardOrientation,
    moveHistory,
    optionSquares,
    pendingPromotion,
    getCapturedPieces,
    onSquareClick,
    onPieceDrop,
    handlePromotionSelect,
    resetGame,
    flipBoard,
    undoMove,
    turn,
    inCheck,
  } = useChessGame('pass-and-play', timeControlKey);

  const whitePlayer = {
    name: 'You',
    rating: 1540,
    color: 'w' as const,
    timeLeft: whiteTime,
  };

  const botRatingMap = {
    easy: 800,
    medium: 1500,
    hard: 2100,
  };

  const blackPlayer = {
    name:
      gameMode === 'vs-computer'
        ? `Stockfish (${botDifficulty.toUpperCase()})`
        : 'Opponent',
    rating: gameMode === 'vs-computer' ? botRatingMap[botDifficulty] : 1520,
    color: 'b' as const,
    timeLeft: blackTime,
    isBot: gameMode === 'vs-computer',
  };

  return (
    <div className="flex h-screen w-screen bg-[#161512] text-gray-100 overflow-hidden font-sans select-none">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gameMode={gameMode}
        setGameMode={setGameMode}
        resetGame={resetGame}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#181715]">
        {activeTab === 'play' && (
          <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 overflow-y-auto max-w-7xl mx-auto w-full items-center lg:items-start justify-center">
            {/* Left: Interactive Chess Board */}
            <div className="w-full max-w-[650px]">
              <ChessBoardContainer
                gameFen={gameFen}
                boardOrientation={boardOrientation}
                boardTheme={boardTheme}
                evalScore={evalScore}
                isViewingHistory={isViewingHistory}
                onReturnToLive={() => navigateHistory('live')}
                onSquareClick={onSquareClick}
                onPieceDrop={onPieceDrop}
                optionSquares={optionSquares}
                pendingPromotion={pendingPromotion}
                handlePromotionSelect={handlePromotionSelect}
                whitePlayer={whitePlayer}
                blackPlayer={blackPlayer}
                turn={turn}
                inCheck={inCheck}
                gameStatus={gameStatus}
                winner={winner}
                capturedPieces={getCapturedPieces()}
                resetGame={resetGame}
              />
            </div>

            {/* Right: Game Info, Move History & Controls */}
            <div className="w-full lg:w-96 flex flex-col gap-4 h-[650px]">
              <GameControls
                gameMode={gameMode}
                botDifficulty={botDifficulty}
                setBotDifficulty={setBotDifficulty}
                resetGame={resetGame}
                flipBoard={flipBoard}
                undoMove={undoMove}
                soundEnabled={soundEnabled}
                setSoundEnabled={handleSoundToggle}
                timeControlKey={timeControlKey}
                setTimeControlKey={setTimeControlKey}
              />

              <div className="flex-1 min-h-0">
                <MoveHistory
                  moveHistory={moveHistory}
                  gameFen={gameFen}
                  previewIndex={previewIndex}
                  onNavigateHistory={navigateHistory}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'puzzles' && <PuzzlesView boardTheme={boardTheme} />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'settings' && (
          <SettingsView
            soundEnabled={soundEnabled}
            setSoundEnabled={handleSoundToggle}
            boardTheme={boardTheme}
            setBoardTheme={handleThemeChange}
          />
        )}
      </main>
    </div>
  );
}

export default App;
