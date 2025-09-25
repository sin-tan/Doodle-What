# 🎨 Doodle What - Multiplayer Drawing Game

A real-time multiplayer drawing and guessing game built with React, Node.js, and Socket.IO. Draw, guess, and have fun with friends!

![Game Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18+-blue) ![Node.js](https://img.shields.io/badge/Node.js-16+-green) ![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--time-orange)

## 🚀 Live Demo
**[Play Doodle What Now!](https://doodle-what-c7b8-23l2uuqms-tanishkasinghh2-gmailcoms-projects.vercel.app/)**

## ✨ Features

- 🎯 **Real-time multiplayer drawing** - Draw and see others draw in real-time
- 🔄 **Turn-based gameplay** - Everyone gets a chance to be the artist
- 💬 **Live chat functionality** - Guess and interact with other players
- 🏠 **Room system** - Create private rooms or join existing ones
- 📊 **Score tracking** - Competitive scoring system
- ⏱️ **Timed rounds** - Fast-paced gameplay with countdown timers
- 🎲 **Random word generation** - Variety of words to keep games interesting

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

- Each game has **3 rounds** by default
- Players take turns being the **drawer**
- Drawer gets a **random word** to illustrate
- Other players have **60 seconds** to guess
- **Points awarded** based on guessing speed
- **Winner** determined by total points

## 📁 Project Structure

```
Doodle-What/
├── public/                 # Static assets
├── src/                   # React frontend
│   ├── components/        # React components
│   ├── LandingPage.js     # Home page
│   ├── Whiteboard.js      # Drawing canvas
│   └── App.js            # Main app component
├── server.js             # Node.js backend server
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔧 Available Scripts

- `npm start` - Start React development server
- `npm run server` - Start backend server only  
- `npm run dev` - Start both frontend and backend concurrently
- `npm run build` - Build for production
- `npm test` - Run tests

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
