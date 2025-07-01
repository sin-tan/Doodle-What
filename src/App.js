import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const App = () => {
  const socketRef = useRef();

  useEffect(() => {
    // connect to your backend server
    socketRef.current = io('http://localhost:5000');

    // listen for drawing data
    socketRef.current.on('drawing', (data) => {
      console.log('Received drawing data:', data);
      // TODO: draw on canvas based on received data
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleMouseMove = (e) => {
    // Example: send mouse coordinates
    const x = e.clientX;
    const y = e.clientY;
    socketRef.current.emit('drawing', { x, y });
  };

  return (
    <div>
      <h1>Guess What? Whiteboard</h1>
      <canvas
        onMouseMove={handleMouseMove}
        style={{ border: '1px solid black', width: '500px', height: '500px' }}
      ></canvas>
    </div>
  );
};

export default App;
