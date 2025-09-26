const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST"],
  credentials: true
}));

const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Game state storage
const rooms = new Map();
const gameWords = [
  'cat', 'dog', 'house', 'tree', 'car', 'phone', 'book', 'chair', 'table', 'computer',
  'pizza', 'apple', 'flower', 'sun', 'moon', 'star', 'fish', 'bird', 'butterfly', 'rainbow',
  'mountain', 'ocean', 'beach', 'forest', 'city', 'bridge', 'castle', 'rocket', 'airplane', 'bicycle',
  'guitar', 'piano', 'camera', 'glasses', 'hat', 'shoes', 'clock', 'key', 'door', 'window',
  'elephant', 'lion', 'tiger', 'monkey', 'giraffe', 'penguin', 'dolphin', 'shark', 'snake', 'rabbit'
];

class Room {
  constructor(id) {
    this.id = id;
    this.users = new Map();
    this.host = null;
    this.currentDrawer = null;
    this.currentWord = null;
    this.gameStarted = false;
    this.totalRounds = 3;
    this.currentRound = 0;
    this.timer = null;
    this.timeLeft = 30;
    this.guessedUsers = new Set();
    this.usedWords = new Set();
  }

  addUser(socketId, name) {
    const user = {
      id: socketId,
      name: name,
      score: 0,
      hasGuessed: false
    };
    this.users.set(socketId, user);
    
    // Set first user as host
    if (!this.host) {
      this.host = socketId;
    }
    
    return user;
  }

  removeUser(socketId) {
    const user = this.users.get(socketId);
    this.users.delete(socketId);
    
    // If host leaves, assign new host
    if (this.host === socketId && this.users.size > 0) {
      this.host = Array.from(this.users.keys())[0];
    }
    
    return user;
  }

  getUserArray() {
    return Array.from(this.users.values());
  }

  getRandomWord() {
    let word;
    do {
      word = gameWords[Math.floor(Math.random() * gameWords.length)];
    } while (this.usedWords.has(word) && this.usedWords.size < gameWords.length);
    
    this.usedWords.add(word);
    return word;
  }

  createHint(word) {
    const hintLength = Math.max(1, Math.floor(word.length / 2));
    const indices = [];
    while (indices.length < hintLength) {
      const randomIndex = Math.floor(Math.random() * word.length);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    
    return word.split('').map((char, index) => 
      indices.includes(index) ? char : '_'
    ).join(' ');
  }

  startNextRound() {
    if (this.currentRound >= this.totalRounds) {
      this.endGame();
      return;
    }

    this.currentRound++;
    this.guessedUsers.clear();
    
    // Select next drawer (rotate through users)
    const userIds = Array.from(this.users.keys());
    const currentDrawerIndex = userIds.indexOf(this.currentDrawer);
    const nextDrawerIndex = (currentDrawerIndex + 1) % userIds.length;
    this.currentDrawer = userIds[nextDrawerIndex];
    
    this.currentWord = this.getRandomWord();
    this.timeLeft = 30;
    
    // Reset hasGuessed for all users
    this.users.forEach(user => {
      user.hasGuessed = false;
    });
  }

  endGame() {
    this.gameStarted = false;
    this.currentDrawer = null;
    this.currentWord = null;
    this.currentRound = 0;
    this.guessedUsers.clear();
    this.usedWords.clear();
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-room', ({ roomId, name }) => {
    console.log(`${name} joining room: ${roomId}`);
    
    // Create room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Room(roomId));
    }
    
    const room = rooms.get(roomId);
    const user = room.addUser(socket.id, name);
    
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userName = name;
    
    // Notify others that user joined
    socket.to(roomId).emit('user-joined', name);
    
    // Send updated user list to all users in room
    io.to(roomId).emit('user-list', room.getUserArray());
    
    // Set host flag for the host
    if (room.host === socket.id) {
      socket.emit('set-host');
    }
    
    console.log(`${name} joined room ${roomId}. Users in room: ${room.users.size}`);
  });

  socket.on('start-game', ({ roomId, rounds }) => {
    const room = rooms.get(roomId);
    if (!room || room.host !== socket.id) return;
    
    room.totalRounds = rounds || 3;
    room.gameStarted = true;
    room.currentRound = 0;
    
    // Start first round
    room.startNextRound();
    
    const drawerName = room.users.get(room.currentDrawer)?.name;
    const hint = room.createHint(room.currentWord);
    
    // Emit game started to all users
    io.to(roomId).emit('game-started', {
      drawerName,
      wordHint: hint,
      roundsLeft: room.totalRounds - room.currentRound + 1,
      realWord: room.currentWord
    });
    
    // Send real word to drawer only
    io.to(room.currentDrawer).emit('your-word', room.currentWord);
    
    // Start timer
    room.timer = setInterval(() => {
      room.timeLeft--;
      io.to(roomId).emit('timer', room.timeLeft);
      
      if (room.timeLeft <= 0) {
        clearInterval(room.timer);
        
        // Time's up, start next round or end game
        if (room.currentRound >= room.totalRounds) {
          room.endGame();
          
          // Calculate winner
          const users = room.getUserArray();
          const maxScore = Math.max(...users.map(u => u.score));
          const winners = users.filter(u => u.score === maxScore);
          
          let message;
          if (winners.length === 1) {
            message = `🏆 Game Over! Winner: ${winners[0].name} with ${maxScore} points!`;
          } else {
            message = `🤝 Game Over! It's a tie with ${maxScore} points!`;
          }
          
          io.to(roomId).emit('game-ended', { message });
        } else {
          // Start next round
          setTimeout(() => {
            room.startNextRound();
            
            const newDrawerName = room.users.get(room.currentDrawer)?.name;
            const newHint = room.createHint(room.currentWord);
            
            io.to(roomId).emit('game-started', {
              drawerName: newDrawerName,
              wordHint: newHint,
              roundsLeft: room.totalRounds - room.currentRound + 1,
              realWord: room.currentWord
            });
            
            io.to(room.currentDrawer).emit('your-word', room.currentWord);
            
            // Restart timer
            room.timeLeft = 30;
            room.timer = setInterval(() => {
              room.timeLeft--;
              io.to(roomId).emit('timer', room.timeLeft);
              
              if (room.timeLeft <= 0) {
                clearInterval(room.timer);
                // Repeat the round ending logic
                if (room.currentRound >= room.totalRounds) {
                  room.endGame();
                  const users = room.getUserArray();
                  const maxScore = Math.max(...users.map(u => u.score));
                  const winners = users.filter(u => u.score === maxScore);
                  
                  let message;
                  if (winners.length === 1) {
                    message = `🏆 Game Over! Winner: ${winners[0].name} with ${maxScore} points!`;
                  } else {
                    message = `🤝 Game Over! It's a tie with ${maxScore} points!`;
                  }
                  
                  io.to(roomId).emit('game-ended', { message });
                }
              }
            }, 1000);
          }, 2000);
        }
      }
    }, 1000);
    
    console.log(`Game started in room ${roomId} with ${rounds} rounds`);
  });

  socket.on('drawing', (data) => {
    socket.to(data.room).emit('drawing', data);
  });

  socket.on('clear', (roomId) => {
    socket.to(roomId).emit('clear');
  });

  socket.on('send-message', ({ room: roomId, message, name }) => {
    const room = rooms.get(roomId);
    if (!room || !room.gameStarted) {
      // Regular chat message
      io.to(roomId).emit('receive-message', { message, name });
      return;
    }

    const user = room.users.get(socket.id);
    if (!user) return;

    // Check if it's a guess and if user is not the drawer
    if (socket.id !== room.currentDrawer && !user.hasGuessed) {
      const guess = message.toLowerCase().trim();
      const word = room.currentWord.toLowerCase();
      
      if (guess === word) {
        // Correct guess!
        user.hasGuessed = true;
        room.guessedUsers.add(socket.id);
        
        // Award points (more points for faster guesses)
        const pointsAwarded = Math.max(1, Math.floor(room.timeLeft / 3));
        user.score += pointsAwarded;
        
        // Send correct guess notification
        io.to(roomId).emit('correct-guess', { guesser: name });
        io.to(roomId).emit('receive-message', { 
          message: `🎉 ${name} guessed correctly! (+${pointsAwarded} points)`, 
          name: '🟢 System' 
        });
        
        // Update user list with new scores
        io.to(roomId).emit('user-list', room.getUserArray());
        
        // Check if all users have guessed (except drawer)
        const nonDrawerUsers = Array.from(room.users.values()).filter(u => u.id !== room.currentDrawer);
        const allGuessed = nonDrawerUsers.every(u => u.hasGuessed);
        
        if (allGuessed && room.timer) {
          clearInterval(room.timer);
          
          // Award points to drawer if someone guessed
          const drawer = room.users.get(room.currentDrawer);
          if (drawer && room.guessedUsers.size > 0) {
            drawer.score += Math.floor(room.guessedUsers.size * 2);
            io.to(roomId).emit('receive-message', { 
              message: `🎨 ${drawer.name} gets ${Math.floor(room.guessedUsers.size * 2)} points for drawing!`, 
              name: '🟢 System' 
            });
          }
          
          // Start next round after delay
          setTimeout(() => {
            if (room.currentRound >= room.totalRounds) {
              room.endGame();
              
              const users = room.getUserArray();
              const maxScore = Math.max(...users.map(u => u.score));
              const winners = users.filter(u => u.score === maxScore);
              
              let message;
              if (winners.length === 1) {
                message = `🏆 Game Over! Winner: ${winners[0].name} with ${maxScore} points!`;
              } else {
                message = `🤝 Game Over! It's a tie with ${maxScore} points!`;
              }
              
              io.to(roomId).emit('game-ended', { message });
            } else {
              room.startNextRound();
              
              const newDrawerName = room.users.get(room.currentDrawer)?.name;
              const newHint = room.createHint(room.currentWord);
              
              io.to(roomId).emit('game-started', {
                drawerName: newDrawerName,
                wordHint: newHint,
                roundsLeft: room.totalRounds - room.currentRound + 1,
                realWord: room.currentWord
              });
              
              io.to(room.currentDrawer).emit('your-word', room.currentWord);
              
              // Update user list with final scores
              io.to(roomId).emit('user-list', room.getUserArray());
            }
          }, 3000);
        }
      } else {
        // Wrong guess, send as regular message
        io.to(roomId).emit('receive-message', { message, name });
      }
    } else {
      // Drawer or already guessed user sending message
      io.to(roomId).emit('receive-message', { message, name });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    if (socket.roomId) {
      const room = rooms.get(socket.roomId);
      if (room) {
        const user = room.removeUser(socket.id);
        
        if (user) {
          // Notify others that user left
          socket.to(socket.roomId).emit('user-left', user.name);
          
          // Send updated user list
          io.to(socket.roomId).emit('user-list', room.getUserArray());
          
          // If drawer disconnects during game, end the current round
          if (room.gameStarted && socket.id === room.currentDrawer) {
            if (room.timer) {
              clearInterval(room.timer);
            }
            
            io.to(socket.roomId).emit('receive-message', { 
              message: `🔴 Drawer ${user.name} disconnected. Starting next round...`, 
              name: '🟢 System' 
            });
            
            setTimeout(() => {
              if (room.users.size > 0) {
                room.startNextRound();
                
                const newDrawerName = room.users.get(room.currentDrawer)?.name;
                const newHint = room.createHint(room.currentWord);
                
                if (newDrawerName) {
                  io.to(socket.roomId).emit('game-started', {
                    drawerName: newDrawerName,
                    wordHint: newHint,
                    roundsLeft: room.totalRounds - room.currentRound + 1,
                    realWord: room.currentWord
                  });
                  
                  io.to(room.currentDrawer).emit('your-word', room.currentWord);
                }
              } else {
                room.endGame();
              }
            }, 2000);
          }
          
          // Set new host if needed
          if (room.host && room.users.size > 0) {
            const newHost = Array.from(room.users.keys())[0];
            io.to(newHost).emit('set-host');
          }
        }
        
        // Clean up empty rooms
        if (room.users.size === 0) {
          rooms.delete(socket.roomId);
          console.log(`Room ${socket.roomId} deleted (empty)`);
        }
      }
    }
  });
});

// Basic health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Doodle What Backend Server is running!',
    timestamp: new Date().toISOString(),
    activeRooms: rooms.size,
    totalUsers: Array.from(rooms.values()).reduce((sum, room) => sum + room.users.size, 0)
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Doodle What backend server running on port ${PORT}`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🎮 WebSocket server ready for connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});