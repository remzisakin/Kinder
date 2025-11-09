import { Router } from 'express';

import prisma from '../utils/prisma.js';
import { notifyMessageCreated } from '../socket.js';

const router = Router();

router.get('/:matchId', async (req, res) => {
  const matchId = Number(req.params.matchId);

  if (!matchId) {
    return res.status(400).json({ message: 'matchId zorunludur.' });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { matchId },
      orderBy: { createdAt: 'asc' },
    });

    return res.json({ messages });
  } catch (error) {
    console.error('Mesajlar alınamadı:', error);
    return res.status(500).json({ message: 'Mesajlar getirilirken hata oluştu.' });
  }
});

router.post('/', async (req, res) => {
  const { matchId, senderId, text } = req.body ?? {};

  if (!matchId || !senderId || !text) {
    return res.status(400).json({ message: 'matchId, senderId ve text zorunludur.' });
  }

  try {
    const message = await prisma.message.create({
      data: {
        matchId,
        senderId,
        text,
      },
    });

    notifyMessageCreated(matchId, {
      id: message.id,
      matchId: message.matchId,
      senderId: message.senderId,
      text: message.text,
      createdAt: message.createdAt.toISOString(),
    });

    return res.status(201).json({ message });
  } catch (error) {
    console.error('Mesaj gönderilemedi:', error);
    return res.status(500).json({ message: 'Mesaj oluşturulurken hata oluştu.' });
  }
});

export default router;
