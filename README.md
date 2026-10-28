# Chess.Core — Full-Stack Chess Platform

A modern, responsive full-stack chess web application inspired by Chess.com. Built as a serious portfolio capstone demonstrating real-time WebSocket communication, strict client- and server-side chess rule validation via `chess.js`, customizable timers, Web Audio sound effects, tactical puzzles, and competitive leaderboard rankings.

---

## ♟️ Key Features

- **Interactive Chessboard**: Smooth piece dragging and click-to-move powered by `react-chessboard` with custom themes (Classic Green, Warm Wood, Ice Blue).
- **Authoritative Rules Validation**: Fully powered by `chess.js` for legal move generation, captures, check/checkmate detection, stalemate, draw detection, and pawn promotion.
- **Synthesized Web Audio Engine**: Zero-latency, browser-native audio synthesis for move clicks, capture impacts, check alerts, and notifications without requiring external audio asset downloads.
- **Live Clocks & Time Controls**: Integrated match timers supporting Bullet (1m), Blitz (3m, 3|2 increment), Rapid (10m), and Classical (30m).
- **Move History & FEN Export**: Clean PGN move record table with one-click FEN string copy to clipboard.
- **Multiple Game Modes**:
  - **Pass-and-Play**: Local 2-player mode on the same device.
  - **VS Computer Bot**: Challenge an automated engine opponent.
  - **Online Multiplayer (Socket.IO)**: Real-time room creation, match joining, and bi-directional move sync.
- **Daily Tactics Puzzles**: Interactive chess puzzles with streak tracking and ratings.
- **Global Leaderboard**: Ranking table showcasing top Grandmasters and win rates.

---

## 🧱 Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Chess Engine**: `chess.js` + `react-chessboard`
- **Audio**: Web Audio API (native oscillator synthesis)

### Backend
- **Runtime**: Node.js + TypeScript
- **Server**: Express
- **Real-Time**: Socket.IO
- **Validation**: `chess.js` (server-side authoritative state verification)

---

## 📁 Repository Structure

```text
chess-app/
├── frontend/                     # React + TypeScript + Vite Client
│   ├── src/
│   │   ├── components/           # UI components (Sidebar, Puzzles, Leaderboard, Settings)
│   │   │   └── ChessBoard/       # Board, PlayerCard, MoveHistory, GameControls, PromotionModal
│   │   ├── hooks/                # useChessGame state engine hook
│   │   ├── types/                # TypeScript game models and types
│   │   └── utils/                # Web Audio sound synthesis engine
│   └── package.json
├── backend/                      # Express + Socket.IO Server
│   ├── src/
│   │   └── index.ts              # Game rooms, WebSocket handlers, and REST API
│   ├── tsconfig.json
│   └── package.json
├── .gitignore                    # Root gitignore excluding node_modules & build artifacts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### 1. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend dev server will launch at `http://localhost:5173`.

### 2. Run Backend
```bash
cd backend
npm install
npm run dev
```
The WebSocket and REST API server will run at `http://localhost:4000`.

---

## 🛣️ Roadmap

- [x] **Phase 1 — Chess Core**: Interactive board, legal moves, clocks, audio, move history.
- [x] **Phase 2 — UI & Views**: Sidebar navigation, puzzles, leaderboards, theme settings.
- [x] **Phase 3 — Multiplayer Basics**: Socket.IO game rooms, move broadcasts, server validation.
- [ ] **Phase 4 — Database & Auth**: PostgreSQL + Prisma ORM, JWT authentication, user Elo ratings.
- [ ] **Phase 5 — Engine Integration**: Full Stockfish engine analysis, blunder/mistake detection.
- [ ] **Phase 6 — Production Deployment**: Docker containers, Redis caching, cloud hosting.
