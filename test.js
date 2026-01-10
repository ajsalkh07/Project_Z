const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const meetingService = require('./services/meetingService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Create meeting API
app.post('/meetings', (req, res) => {
  const meetingId = meetingService.createMeeting();
  res.json({ meetingId, hostToken: meetingId });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-meeting', (data) => {
    meetingService.joinMeeting(socket, data.meetingId);
  });
  
  socket.on('end-meeting', (data) => {
    meetingService.endMeeting(data.meetingId);
  });
});

server.listen(3000, () => console.log('Server: http://localhost:3000'));
