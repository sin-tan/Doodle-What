# 🎨 Doodle What - Multiplayer Drawing Game

A real-time multiplayer drawing and guessing game built with React, Node.js, and Socket.IO. Draw, guess, and have fun with friends!

![Game Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18+-blue) ![Node.js](https://img.shields.io/badge/Node.js-16+-green) ![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--time-orange)

## 🚀 Live Demo
**[Play Doodle What Now!](https://doodle-what-c7b8-23l2uuqms-tanishkasinghh2-gmailcoms-projects.vercel.app/)**
LINK: https://doodle-what-79cv.vercel.app/

## ✨ Features

- 🎯 **Real-time multiplayer drawing** - Draw and see others draw in real-time
- 🔄 **Turn-based gameplay** - Everyone gets a chance to be the artist
- 💬 **Live chat functionality** - Guess and interact with other players
- 🏠 **Room system** - Create private rooms or join existing ones
- 📊 **Score tracking** - Competitive scoring system
- ⏱️ **Timed rounds** - Fast-paced gameplay with countdown timers
- 🎲 **Random word generation** - Variety of words to keep games interesting
- 📱 **Responsive design** - Works on desktop and mobile devices
- 🎨 **Drawing tools** - Color picker, brush sizes, eraser, clear, undo

## 🛠️ Technologies Used

- **Frontend**: React.js, CSS3, HTML5 Canvas
- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.IO
- **Styling**: Custom CSS with responsive design
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/sin-tan/Doodle-What.git
cd Doodle-What
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- React development server on `http://localhost:3000`

4. **Open your browser** and navigate to `http://localhost:3000`

## 🎮 How to Play

1. **Create or Join**: Create a new room or join an existing one with a room code
2. **Wait for Players**: Minimum players needed to start the game
3. **Draw Your Turn**: When it's your turn, you'll get a word to draw
4. **Guess Others**: Try to guess what other players are drawing
5. **Score Points**: Earn points for correct guesses and having others guess your drawings
6. **Multiple Rounds**: Play through several rounds with different drawers

## 🎯 Game Rules

- Each game has **3 rounds** by default (customizable)
- Players take turns being the **drawer**
- Drawer gets a **random word** to illustrate
- Other players have **30 seconds** to guess
- **Points awarded** based on guessing speed
- **Winner** determined by total points

## 📁 Project Structure

```
Doodle-What/
├── public/                 # Static assets
├── src/                   # React frontend
│   ├── LandingPage.js     # Home page component
│   ├── Whiteboard.js      # Main game canvas & logic
│   ├── App.js            # Main app component
│   └── *.css            # Styling files
├── server.js             # Node.js backend server
├── GAME_GUIDE.md         # Detailed game documentation
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔧 Available Scripts

- `npm start` - Start React development server
- `npm run server` - Start backend server only  
- `npm run dev` - Start both frontend and backend concurrently
- `npm run build` - Build for production
- `npm test` - Run tests

## 🎨 Game Features

### Drawing Tools
- **Color Picker**: Choose from any color
- **Brush Sizes**: Adjustable line thickness (1-10px)
- **Eraser Mode**: Switch between pen and eraser
- **Clear Canvas**: Wipe the entire drawing
- **Undo Function**: Remove last drawing stroke

### Multiplayer Features
- **Room System**: Private rooms with shareable codes
- **Real-time Sync**: All players see drawings instantly
- **Turn Management**: Automatic drawer rotation
- **Score Tracking**: Live scoreboard with points
- **Chat Integration**: Guess through chat messages

### Game Mechanics
- **Word Bank**: 50+ carefully selected words
- **Hint System**: Partial word reveals for guessers  
- **Timer System**: 30-second round countdown
- **Scoring Algorithm**: Speed-based point calculation
- **Winner Detection**: Automatic game end with results

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Tanishka Singh** ([@sin-tan](https://github.com/sin-tan))

---

⭐ **Star this repository if you found it helpful!**
