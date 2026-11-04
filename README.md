# Chess.Core — Full-Stack Chess Platform

A modern, responsive full-stack chess web application inspired by Chess.com. Built as a serious portfolio capstone demonstrating real-time WebSocket communication, strict client- and server-side chess rule validation via `chess.js`, customizable timers, Web Audio sound effects, tactical puzzles, and competitive leaderboard rankings.

---

## ♟️ Key Features

- **Interactive Chessboard with Live Evaluation Bar**: Smooth piece dragging and click-to-move powered by `react-chessboard`, equipped with a real-time vertical evaluation bar (advantage gauge) calculating material balance and positional advantages.
- **Custom Board Themes**: Dynamic live theme switcher supporting **Classic Green**, **Warm Wood**, and **Ice Blue**, saved to user preferences.
- **Move History & Replay Navigation**: Step backward and forward through past moves with `|◀`, `◀`, `▶`, and `▶| Live` review controls or click any move in the history table to preview historical board states without interrupting live games.
- **Multi-Level Computer Bot**: Challenge the AI with selectable difficulty settings:
  - **Novice (800 Elo)**: Casual tactical play with occasional oversights.
  - **Intermediate (1500 Elo)**: Positional evaluations and opportunistic captures.
  - **Master (2100 Elo)**: 2-ply minimax tactical depth search maximizing material and space control.
- **Authoritative Rules Validation**: Fully powered by `chess.js` for legal move generation, captures, check/checkmate detection, stalemate, draw detection, and pawn promotion.
- **Synthesized Web Audio Engine**: Zero-latency, browser-native audio synthesis for move clicks, capture impacts, check alerts, castling, and win/loss fanfare without requiring external audio asset downloads.
- **Live Clocks & Time Controls**: Integrated match timers supporting Bullet (1m), Blitz (3m, 3|2 increment), Rapid (10m), and Classical (30m).
- **Tactics Puzzle Arena**: Curated interactive tactical puzzles (Mate in 1, Royal Fork, Back-Rank Mate, Smothered Mate, and Anastasia's Mate) complete with tactical hints, move validation, rating tracking, and streak counters.
- **Global Grandmaster Leaderboard**: Ranking table showcasing top Grandmasters and live win rates.

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
│   │   │   └── ChessBoard/       # Board, EvalBar, PlayerCard, MoveHistory, GameControls, PromotionModal
│   │   ├── hooks/                # useChessGame state engine & minimax AI hook
│   │   ├── types/                # TypeScript game models, puzzles, and types
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
- [x] **Phase 2 — UI & Views**: Sidebar navigation, tactics arena puzzles, leaderboards, theme settings.
- [x] **Phase 3 — Evaluation & AI**: Real-time evaluation bar, move replay navigation, multi-tier bot AI.
- [x] **Phase 4 — Multiplayer Basics**: Socket.IO game rooms, move broadcasts, server validation.
- [ ] **Phase 5 — Database & Auth**: PostgreSQL + Prisma ORM, JWT authentication, user Elo ratings.
- [ ] **Phase 6 — Production Deployment**: Docker containers, Redis caching, cloud hosting.
