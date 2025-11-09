import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import likesRouter from './routes/likes.js';
import matchesRouter from './routes/matches.js';
import messagesRouter from './routes/messages.js';
import assistantRouter from './routes/assistant.js';

dotenv.config();

const app = express();

const allowedOrigin = process.env.CORS_ORIGIN || '*';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/likes', likesRouter);
app.use('/matches', matchesRouter);
app.use('/messages', messagesRouter);
app.use('/assistant', assistantRouter);

export default app;
