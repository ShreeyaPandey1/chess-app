import { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import { soundEngine } from '../utils/sound';
import type { GameMode, TimeControl, MoveRecord, GameStatus } from '../types/chess';

export const TIME_CONTROLS: Record<string, TimeControl> = {
  bullet: { name: '1 min', initialSeconds: 60, incrementSeconds: 0 },
  blitz: { name: '3 min', initialSeconds: 180, incrementSeconds: 0 },
  blitz3_2: { name: '3 | 2', initialSeconds: 180, incrementSeconds: 2 },
  rapid: { name: '10 min', initialSeconds: 600, incrementSeconds: 0 },
  classical: { name: '30 min', initialSeconds: 1800, incrementSeconds: 0 },
};

export function useChessGame(initialMode: GameMode = 'pass-and-play', initialTimeControlKey = 'blitz') {
  const chessRef = useRef(new Chess());
  const [gameMode, setGameMode] = useState<GameMode>(initialMode);
  const [timeControl, setTimeControl] = useState<TimeControl>(TIME_CONTROLS[initialTimeControlKey]);
  
  const [gameFen, setGameFen] = useState<string>(chessRef.current.fen());
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  
  const [whiteTime, setWhiteTime] = useState<number>(timeControl.initialSeconds);
  const [blackTime, setBlackTime] = useState<number>(timeControl.initialSeconds);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  
  const [gameStatus, setGameStatus] = useState<GameStatus>('active');
  const [winner, setWinner] = useState<'w' | 'b' | 'draw' | null>(null);
  
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [optionSquares, setOptionSquares] = useState<Record<string, { background: string; borderRadius?: string }>>({});
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  // Sync timers when time control changes
  const resetGame = useCallback((tcKey?: string) => {
    const tc = tcKey ? TIME_CONTROLS[tcKey] : timeControl;
    if (tcKey) setTimeControl(tc);
    
    chessRef.current.reset();
    setGameFen(chessRef.current.fen());
    setWhiteTime(tc.initialSeconds);
    setBlackTime(tc.initialSeconds);
    setTimerActive(false);
    setGameStatus('active');
    setWinner(null);
    setMoveHistory([]);
    setMoveFrom(null);
    setOptionSquares({});
    setPendingPromotion(null);
    soundEngine.playNotify();
  }, [timeControl]);

  // Turn timer countdown effect
  useEffect(() => {
    if (!timerActive || gameStatus !== 'active') return;

    const interval = setInterval(() => {
      const turn = chessRef.current.turn();
      if (turn === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            setGameStatus('timeout');
            setWinner('b');
            setTimerActive(false);
            soundEngine.playCheck();
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            setGameStatus('timeout');
            setWinner('w');
            setTimerActive(false);
            soundEngine.playCheck();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, gameStatus]);

  // Material & captured pieces calculator
  const getCapturedPieces = useCallback(() => {
    const board = chessRef.current.board();
    const currentPieces: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, P: 0, N: 0, B: 0, R: 0, Q: 0 };
    
    for (const row of board) {
      for (const square of row) {
        if (square) {
          const key = square.color === 'w' ? square.type.toUpperCase() : square.type;
          currentPieces[key] = (currentPieces[key] || 0) + 1;
        }
      }
    }

    const initialCount = { P: 8, N: 2, B: 2, R: 2, Q: 1, p: 8, n: 2, b: 2, r: 2, q: 1 };
    const whiteCaptured: Record<string, number> = {}; // Black pieces captured by White
    const blackCaptured: Record<string, number> = {}; // White pieces captured by Black

    (['p', 'n', 'b', 'r', 'q'] as const).forEach((piece) => {
      const diff = initialCount[piece] - (currentPieces[piece] || 0);
      if (diff > 0) whiteCaptured[piece] = diff;
    });

    (['P', 'N', 'B', 'R', 'Q'] as const).forEach((piece) => {
      const diff = initialCount[piece] - (currentPieces[piece] || 0);
      if (diff > 0) blackCaptured[piece.toLowerCase()] = diff;
    });

    const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    let whiteScore = 0;
    let blackScore = 0;

    Object.entries(whiteCaptured).forEach(([p, count]) => { whiteScore += (pieceValues[p] || 0) * count; });
    Object.entries(blackCaptured).forEach(([p, count]) => { blackScore += (pieceValues[p] || 0) * count; });

    return {
      whiteCaptured,
      blackCaptured,
      advantage: whiteScore - blackScore, // positive = white advantage, negative = black advantage
    };
  }, []);

  // Update game state after move
  const updateGameState = useCallback((moveRes: any) => {
    const fen = chessRef.current.fen();
    setGameFen(fen);

    // Audio effects
    if (chessRef.current.inCheck()) {
      soundEngine.playCheck();
    } else if (moveRes.captured) {
      soundEngine.playCapture();
    } else {
      soundEngine.playMove();
    }

    // Timer increment
    const turnJustEnded = chessRef.current.turn() === 'w' ? 'b' : 'w';
    if (turnJustEnded === 'w') {
      setWhiteTime((t) => t + timeControl.incrementSeconds);
    } else {
      setBlackTime((t) => t + timeControl.incrementSeconds);
    }

    // Start timer on first move
    if (!timerActive) setTimerActive(true);

    // Record history
    const history = chessRef.current.history({ verbose: true });
    const lastMove = history[history.length - 1];
    
    setMoveHistory((prev) => {
      const newHist = [...prev];
      if (lastMove.color === 'w') {
        newHist.push({
          moveNumber: Math.ceil(history.length / 2),
          white: lastMove.san,
          fen,
        });
      } else {
        if (newHist.length > 0) {
          newHist[newHist.length - 1].black = lastMove.san;
        }
      }
      return newHist;
    });

    // Check game over status
    if (chessRef.current.isCheckmate()) {
      setGameStatus('checkmate');
      setWinner(turnJustEnded);
      setTimerActive(false);
    } else if (chessRef.current.isDraw() || chessRef.current.isStalemate() || chessRef.current.isThreefoldRepetition()) {
      setGameStatus('draw');
      setWinner('draw');
      setTimerActive(false);
    }
  }, [timeControl, timerActive]);

  // Make move logic
  const makeMove = useCallback((from: Square, to: Square, promotionPiece = 'q') => {
    if (gameStatus !== 'active') return false;

    try {
      const moveRes = chessRef.current.move({
        from,
        to,
        promotion: promotionPiece,
      });

      if (moveRes) {
        updateGameState(moveRes);
        setMoveFrom(null);
        setOptionSquares({});
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }, [gameStatus, updateGameState]);

  // Computer Bot AI Move logic
  useEffect(() => {
    if (gameMode !== 'vs-computer' || gameStatus !== 'active') return;
    if (chessRef.current.turn() !== 'b') return;

    const timer = setTimeout(() => {
      const possibleMoves = chessRef.current.moves({ verbose: true });
      if (possibleMoves.length === 0) return;

      // Prefer captures or checks, otherwise random move
      const captureMoves = possibleMoves.filter((m) => m.captured);
      const chosenMove = captureMoves.length > 0
        ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
        : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      makeMove(chosenMove.from, chosenMove.to, chosenMove.promotion || 'q');
    }, 600);

    return () => clearTimeout(timer);
  }, [gameFen, gameMode, gameStatus, makeMove]);

  // Highlight available legal moves
  const getMoveOptions = useCallback((square: Square) => {
    const moves = chessRef.current.moves({ square, verbose: true });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: Record<string, { background: string; borderRadius?: string }> = {};
    moves.forEach((move) => {
      const isCapture = chessRef.current.get(move.to as Square) !== null;
      newSquares[move.to] = {
        background: isCapture
          ? 'radial-gradient(circle, rgba(239,68,68,0.8) 25%, transparent 25%)'
          : 'radial-gradient(circle, rgba(16,185,129,0.7) 22%, transparent 22%)',
        borderRadius: '50%',
      };
    });
    newSquares[square] = { background: 'rgba(234, 179, 8, 0.4)' };
    setOptionSquares(newSquares);
    return true;
  }, []);

  const onSquareClick = useCallback((square: Square) => {
    if (gameStatus !== 'active') return;

    // Second click (making the move)
    if (moveFrom) {
      // Check if Pawn Promotion
      const piece = chessRef.current.get(moveFrom);
      if (piece && piece.type === 'p') {
        const isWhitePromoting = piece.color === 'w' && square.endsWith('8');
        const isBlackPromoting = piece.color === 'b' && square.endsWith('1');
        if (isWhitePromoting || isBlackPromoting) {
          setPendingPromotion({ from: moveFrom, to: square });
          return;
        }
      }

      const moveSuccess = makeMove(moveFrom, square);
      if (!moveSuccess) {
        // Switch selection to new square if owned by current turn player
        const pieceOnNewSquare = chessRef.current.get(square);
        if (pieceOnNewSquare && pieceOnNewSquare.color === chessRef.current.turn()) {
          setMoveFrom(square);
          getMoveOptions(square);
        } else {
          setMoveFrom(null);
          setOptionSquares({});
        }
      }
    } else {
      // First click (selecting a piece)
      const piece = chessRef.current.get(square);
      if (piece && piece.color === chessRef.current.turn()) {
        setMoveFrom(square);
        getMoveOptions(square);
      }
    }
  }, [moveFrom, gameStatus, makeMove, getMoveOptions]);

  const onPieceDrop = useCallback((sourceSquare: Square, targetSquare: Square) => {
    if (gameStatus !== 'active') return false;

    const piece = chessRef.current.get(sourceSquare);
    if (piece && piece.type === 'p') {
      const isWhitePromoting = piece.color === 'w' && targetSquare.endsWith('8');
      const isBlackPromoting = piece.color === 'b' && targetSquare.endsWith('1');
      if (isWhitePromoting || isBlackPromoting) {
        setPendingPromotion({ from: sourceSquare, to: targetSquare });
        return true;
      }
    }

    return makeMove(sourceSquare, targetSquare);
  }, [gameStatus, makeMove]);

  const handlePromotionSelect = useCallback((piece: string) => {
    if (pendingPromotion) {
      makeMove(pendingPromotion.from, pendingPromotion.to, piece);
      setPendingPromotion(null);
    }
  }, [pendingPromotion, makeMove]);

  const flipBoard = useCallback(() => {
    setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  }, []);

  const undoMove = useCallback(() => {
    const move = chessRef.current.undo();
    if (move) {
      if (gameMode === 'vs-computer') {
        chessRef.current.undo(); // undo bot move as well
      }
      setGameFen(chessRef.current.fen());
      setMoveFrom(null);
      setOptionSquares({});
      soundEngine.playMove();
    }
  }, [gameMode]);

  return {
    gameFen,
    gameMode,
    setGameMode,
    timeControl,
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
    turn: chessRef.current.turn(),
    inCheck: chessRef.current.inCheck(),
  };
}
