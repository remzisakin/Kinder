import { Router } from 'express';

import prisma from '../utils/prisma.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, age, gender, bio, interests, photos } = req.body ?? {};

  if (!name || !age || !gender || !bio) {
    return res.status(400).json({ message: 'Eksik bilgiler mevcut.' });
  }

  const numericAge = Number(age);

  if (Number.isNaN(numericAge)) {
    return res.status(400).json({ message: 'Yaş bir sayı olmalıdır.' });
  }

  try {
    const defaultPhoto = `https://i.pravatar.cc/300?u=${encodeURIComponent(name)}`;
    const user = await prisma.user.create({
      data: {
        name,
        age: numericAge,
        gender,
        bio,
        interests: Array.isArray(interests) ? interests : [],
        photos: Array.isArray(photos) && photos.length > 0 ? photos : [defaultPhoto],
      },
    });

    return res.status(201).json({ userId: user.id });
  } catch (error) {
    console.error('Kayıt başarısız:', error);
    return res.status(500).json({ message: 'Kullanıcı oluşturulurken hata oluştu.' });
  }
});

export default router;
