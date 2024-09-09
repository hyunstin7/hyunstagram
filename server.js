// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Next.js 클라이언트의 주소
    methods: ['GET', 'POST']
  }
});

const PORT = 3000;

async function startServer() {
  const client = new MongoClient('mongodb+srv://pigethang7:qwer1234@pigethang7.lphm9v0.mongodb.net/?retryWrites=true&w=majority&appName=pigethang7', { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = await client.db('user');
  const collection = await db.collection('userinfo')
  const changeStream = await collection.watch();

  changeStream.on('change', (change) => {
    console.log('MongoDB 데이터 변경:', change);
    io.emit('dataChanged', change);
  });

  io.on('connection', (socket) => {
    console.log('클라이언트 연결됨:', socket.id);
  });

  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  server.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
  });
}

startServer().catch(console.error);
