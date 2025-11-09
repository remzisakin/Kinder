import { Router } from 'express';

import prisma from '../utils/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  const userId = Number(req.query.userId);

  if (!userId) {
    return res.status(400).json({ message: 'userId zorunludur.' });
  }

  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        userA: true,
        userB: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formatted = matches.map((match) => {
      const otherUser = match.userAId === userId ? match.userB : match.userA;
      return {
        id: match.id,
        createdAt: match.createdAt,
        otherUser: {
          id: otherUser.id,
          name: otherUser.name,
          photos: otherUser.photos,
        },
      };
    });

    return res.json({ matches: formatted });
  } catch (error) {
    console.error('Eşleşmeler alınamadı:', error);
    return res.status(500).json({ message: 'Eşleşmeler getirilirken hata oluştu.' });
  }
});

export default router;
