import { Router } from 'express';

import prisma from '../utils/prisma.js';
import { notifyMatchCreated } from '../socket.js';

const router = Router();

router.post('/', async (req, res) => {
  const { fromUserId, toUserId } = req.body ?? {};

  if (!fromUserId || !toUserId) {
    return res.status(400).json({ message: 'fromUserId ve toUserId zorunludur.' });
  }

  if (fromUserId === toUserId) {
    return res.status(400).json({ message: 'Kendinizi beğenemezsiniz.' });
  }

  try {
    const like = await prisma.like.create({
      data: {
        fromUserId,
        toUserId,
      },
    });

    const reciprocal = await prisma.like.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      },
    });

    if (!reciprocal) {
      return res.status(201).json({ like, matched: false });
    }

    const [userAId, userBId] =
      fromUserId < toUserId ? [fromUserId, toUserId] : [toUserId, fromUserId];

    const match = await prisma.match.upsert({
      where: {
        userAId_userBId: {
          userAId,
          userBId,
        },
      },
      create: {
        userAId,
        userBId,
      },
      update: {},
      include: {
        userA: true,
        userB: true,
      },
    });

    notifyMatchCreated([match.userAId], {
      matchId: match.id,
      otherUser: {
        id: match.userB.id,
        name: match.userB.name,
        photos: match.userB.photos,
      },
    });

    notifyMatchCreated([match.userBId], {
      matchId: match.id,
      otherUser: {
        id: match.userA.id,
        name: match.userA.name,
        photos: match.userA.photos,
      },
    });

    return res.status(201).json({ like, matched: true, matchId: match.id });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return res.status(409).json({ message: 'Bu kullanıcıyı zaten beğendiniz.' });
    }

    console.error('Beğeni kaydedilemedi:', error);
    return res.status(500).json({ message: 'Beğeni oluşturulurken hata oluştu.' });
  }
});

export default router;
