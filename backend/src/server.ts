import http from 'http';
import dotenv from 'dotenv';

import app from './index.js';
import { initSocket } from './socket.js';

dotenv.config();

const port = Number(process.env.PORT) || 4000;

const server = http.createServer(app);

initSocket(server);

server.listen(port, () => {
  console.log(`🚀 KhakiMatch backend ${port} portunda çalışıyor`);
});
