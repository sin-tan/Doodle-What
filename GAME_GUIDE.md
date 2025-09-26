# Doodle What - Multiplayer Drawing Game

A real-time collaborative drawing and guessing game built with React and Socket.IO.

## 🎮 How to Play

1. **Create/Join a Room**: 
   - Enter your name and room code
   - Share the room code with friends
   - First person to join becomes the host

2. **Start the Game**:
   - Host clicks "Start Game" 
   - Specify number of rounds in URL: `?rounds=3`
   - Example: `http://localhost:3000/whiteboard?room=ABC123&name=Player1&rounds=5`

3. **Game Rules**:
   - Players take turns drawing a word
   - Other players guess what's being drawn
   - Points awarded for correct guesses (faster = more points)
   - Drawer gets points when others guess correctly
   - Game continues for specified number of rounds

## 🚀 Running the Application

### Prerequisites
- Node.js installed on your system
- npm (comes with Node.js)

### Setup & Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Both Frontend and Backend**:
   ```bash
   npm run dev
   ```
   This runs both the React frontend (port 3000) and Socket.IO backend (port 5000)

3. **Or run them separately**:
   ```bash
   # Terminal 1 - Backend Server
   npm run server

   # Terminal 2 - Frontend React App  
   npm start
   ```

### URLs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Game**: http://localhost:3000/whiteboard?room=ROOMCODE&name=YOURNAME&rounds=3

## 🎨 Features

- **Real-time Drawing**: Collaborative whiteboard with drawing tools
- **Chat System**: Real-time messaging and guessing
- **Scoring System**: Points for correct guesses and good drawings
- **Multiple Rounds**: Customizable number of game rounds
- **Room Management**: Private rooms with shareable codes
- **Host Controls**: Game start/stop controls for room host
- **Word Bank**: 50+ words for drawing challenges
- **Timer System**: 30-second rounds with countdown
- **Winner Detection**: Automatic winner calculation and display

## 🛠 Technical Details

### Frontend (React)
- React Router for navigation
- Socket.IO client for real-time communication
- HTML5 Canvas for drawing functionality
- Responsive CSS styling

### Backend (Node.js + Socket.IO)
- Express.js server
- Socket.IO for WebSocket connections
- Room-based game management
- Real-time event handling
- CORS enabled for development

### Game Logic
- Turn-based drawing system
- Word hint generation (partial letter reveals)
- Score calculation based on guess speed
- Round management and game state tracking
- Automatic room cleanup

## 🎯 Game Events

### Client → Server
- `join-room`: Join a game room
- `start-game`: Host starts the game
- `drawing`: Real-time drawing data
- `clear`: Clear the canvas
- `send-message`: Chat messages and guesses

### Server → Client
- `user-list`: Updated list of players and scores
- `game-started`: New round begins with drawer assignment
- `drawing`: Broadcast drawing data to other players
- `receive-message`: Chat messages
- `correct-guess`: Someone guessed correctly
- `timer`: Round countdown timer
- `game-ended`: Game finished with winner announcement

## 🎪 Word Bank
The game includes 50 words across various categories:
- Animals: cat, dog, elephant, lion, etc.
- Objects: house, car, phone, book, etc.
- Nature: tree, flower, sun, moon, etc.
- Food: pizza, apple
- And many more!

## 🔧 Configuration

### Environment Variables
- `PORT`: Backend server port (default: 5000)
- `REACT_APP_SOCKET_URL`: Socket.IO server URL for production

### URL Parameters
- `room`: Room code to join
- `name`: Player name
- `rounds`: Number of game rounds (optional, for host reference)

## 🏆 Scoring System
- **Correct Guess**: 1-10 points (based on remaining time)
- **Drawing Points**: 2 points per person who guessed correctly
- **Winner**: Player with highest score after all rounds

## 🎨 Drawing Tools
- **Color Picker**: Choose drawing color
- **Brush Size**: Adjustable line thickness (1-10)
- **Eraser**: Toggle eraser mode
- **Clear**: Clear entire canvas
- **Undo**: Undo last drawing action

## 🚨 Known Issues & Limitations
- Drawing data is not persisted (resets on refresh)
- No drawing replay functionality
- Limited to 50 predefined words
- Basic collision detection for game state

## 🔮 Future Enhancements
- Custom word lists
- Drawing replay system
- Spectator mode
- Private/public room settings
- Player avatars
- Sound effects
- Mobile touch drawing support
- Game statistics and history

Enjoy playing Doodle What! 🎨✨