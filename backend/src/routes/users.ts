import { Router } from 'express';

import prisma from '../utils/prisma.js';

const router = Router();

router.get('/feed', async (req, res) => {
  const userId = Number(req.query.userId);
  const limit = Number(req.query.limit) || 10;
  const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;

  if (!userId) {
    return res.status(400).json({ message: 'userId zorunludur.' });
  }

  try {
    const likedUserIds = await prisma.like.findMany({
      where: {
        fromUserId: userId,
      },
      select: {
        toUserId: true,
      },
    });

    const dislikedIds = likedUserIds.map((l) => l.toUserId);

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
          notIn: dislikedIds,
        },
      },
      take: limit,
      ...(cursor
        ? {
            skip: 1,
            cursor: {
              id: cursor,
            },
          }
        : {}),
      orderBy: {
        id: 'asc',
      },
    });

    const nextCursor = users.length === limit ? users[users.length - 1].id : null;

    return res.json({ users, nextCursor });
  } catch (error) {
    console.error('Feed alınamadı:', error);
    return res.status(500).json({ message: 'Kullanıcılar getirilirken hata oluştu.' });
  }
});

export default router;
