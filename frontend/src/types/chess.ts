export type GameMode = 'pass-and-play' | 'vs-computer' | 'online';

export type TimeControl = {
  name: string;
  initialSeconds: number;
  incrementSeconds: number;
};

export type PlayerInfo = {
  name: string;
  rating: number;
  avatarUrl?: string;
  color: 'w' | 'b';
  timeLeft: number; // in seconds
  isBot?: boolean;
};

export type MoveRecord = {
  moveNumber: number;
  white?: string;
  black?: string;
  fen: string;
  evaluation?: number; // material balance or stockfish score
  sanWhite?: string;
  sanBlack?: string;
};

export type CapturedPieces = {
  w: Record<string, number>; // white captured pieces (black pieces taken)
  b: Record<string, number>; // black captured pieces (white pieces taken)
};

export type GameStatus = 'active' | 'checkmate' | 'stalemate' | 'draw' | 'timeout' | 'resigned';

export type BoardTheme = 'classic' | 'wood' | 'ocean';

export type BotDifficulty = 'easy' | 'medium' | 'hard';

export type PuzzleItem = {
  id: string;
  title: string;
  theme: string;
  rating: number;
  description: string;
  hint: string;
  fen: string;
  turn: 'w' | 'b';
  solution: { from: string; to: string }[];
};
