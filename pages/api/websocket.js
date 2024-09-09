// pages/api/websocket.js
import { Server } from 'ws';
import { MongoClient } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const client = new MongoClient(process.env.MONGODB_URI);
let collection;

async function setupWebSocketServer(server) {
  const email = (await getServerSession(authOptions)).user.email
  const wss = new Server({ server });

  await client.connect();
  const db = client.db('user');
  collection = db.collection('userinfo').findOne({email,});

  wss.on('connection', (ws) => {
    console.log('Client connected');

    const changeStream = collection.watch();
    changeStream.on('change', async () => {
      const updatedData = await collection
      ws.send(JSON.stringify(updatedData));
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      changeStream.close();
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return wss;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (!req.socket.server.wss) {
      req.socket.server.wss = await setupWebSocketServer(req.socket.server);
    }
    res.end();
  } else {
    res.status(405).end();
  }
}
