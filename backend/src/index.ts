import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Chess } from 'chess.js';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

interface ActiveGame {
  id: string;
  chess: Chess;
  whiteSocketId?: string;
  blackSocketId?: string;
  timeControlSeconds: number;
}

const activeGames = new Map<string, ActiveGame>();

// REST Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeGamesCount: activeGames.size, timestamp: new Date().toISOString() });
});

// REST Leaderboard Endpoint
app.get('/api/leaderboard', (req, res) => {
  res.json([
    { rank: 1, name: 'Magnus Carlsen', title: 'GM', rating: 2882, country: '🇳🇴', winRate: '78%' },
    { rank: 2, name: 'Hikaru Nakamura', title: 'GM', rating: 2875, country: '🇺🇸', winRate: '75%' },
    { rank: 3, name: 'Alireza Firouzja', title: 'GM', rating: 2805, country: '🇫🇷', winRate: '72%' },
    { rank: 4, name: 'Fabiano Caruana', title: 'GM', rating: 2795, country: '🇺🇸', winRate: '71%' },
    { rank: 5, name: 'Gukesh D', title: 'GM', rating: 2794, country: '🇮🇳', winRate: '70%' },
  ]);
});

// WebSocket Event Handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('create_game', ({ timeControlSeconds = 180 }, callback) => {
    const gameId = Math.random().toString(36).substring(2, 8);
    const game: ActiveGame = {
      id: gameId,
      chess: new Chess(),
      whiteSocketId: socket.id,
      timeControlSeconds,
    };

    activeGames.set(gameId, game);
    socket.join(gameId);
    console.log(`Game ${gameId} created by ${socket.id}`);

    if (callback) callback({ gameId, fen: game.chess.fen(), color: 'w' });
  });

  socket.on('join_game', ({ gameId }, callback) => {
    const game = activeGames.get(gameId);
    if (!game) {
      if (callback) callback({ error: 'Game not found' });
      return;
    }

    if (!game.blackSocketId) {
      game.blackSocketId = socket.id;
      socket.join(gameId);
      console.log(`Client ${socket.id} joined game ${gameId} as Black`);

      io.to(gameId).emit('game_start', {
        gameId,
        fen: game.chess.fen(),
        whiteSocketId: game.whiteSocketId,
        blackSocketId: game.blackSocketId,
      });

      if (callback) callback({ gameId, fen: game.chess.fen(), color: 'b' });
    } else {
      if (callback) callback({ error: 'Game room full' });
    }
  });

  socket.on('make_move', ({ gameId, from, to, promotion = 'q' }) => {
    const game = activeGames.get(gameId);
    if (!game) return;

    try {
      const move = game.chess.move({ from, to, promotion });
      if (move) {
        io.to(gameId).emit('move_made', {
          move,
          fen: game.chess.fen(),
          turn: game.chess.turn(),
          inCheck: game.chess.inCheck(),
          isCheckmate: game.chess.isCheckmate(),
          isDraw: game.chess.isDraw(),
        });
      }
    } catch {
      socket.emit('move_error', { message: 'Illegal move rejected by server' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Chess.com Core Backend running at http://localhost:${PORT}`);
});