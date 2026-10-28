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

export function App() {
  const [activeTab, setActiveTab] = useState<string>('play');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [timeControlKey, setTimeControlKey] = useState<string>('blitz');

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    soundEngine.setSoundEnabled(enabled);
  };

  const {
    gameFen,
    gameMode,
    setGameMode,
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

  const blackPlayer = {
    name: gameMode === 'vs-computer' ? 'Stockfish Engine' : 'Opponent',
    rating: gameMode === 'vs-computer' ? 2200 : 1520,
    color: 'b' as const,
    timeLeft: blackTime,
    isBot: gameMode === 'vs-computer',
  };

  return (
    <div className="flex h-screen w-screen bg-[#161512] text-gray-100 overflow-hidden font-sans select-none">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gameMode={gameMode}
        setGameMode={setGameMode}
        resetGame={resetGame}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#181715]">
        {activeTab === 'play' && (
          <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 overflow-y-auto max-w-7xl mx-auto w-full items-center lg:items-start justify-center">
            <div className="w-full max-w-[620px]">
              <ChessBoardContainer
                gameFen={gameFen}
                boardOrientation={boardOrientation}
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

            <div className="w-full lg:w-96 flex flex-col gap-4 h-[620px]">
              <GameControls
                resetGame={resetGame}
                flipBoard={flipBoard}
                undoMove={undoMove}
                soundEnabled={soundEnabled}
                setSoundEnabled={handleSoundToggle}
                timeControlKey={timeControlKey}
                setTimeControlKey={setTimeControlKey}
              />

              <div className="flex-1 min-h-0">
                <MoveHistory moveHistory={moveHistory} gameFen={gameFen} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'puzzles' && <PuzzlesView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'settings' && (
          <SettingsView soundEnabled={soundEnabled} setSoundEnabled={handleSoundToggle} />
        )}
      </main>
    </div>
  );
}

export default App;
