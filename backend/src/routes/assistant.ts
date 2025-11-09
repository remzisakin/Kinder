import { Router } from 'express';

import { askAssistant } from '../services/llmProvider.js';

const router = Router();

router.post('/ask', async (req, res) => {
  const { userId, prompt } = req.body ?? {};

  if (!userId || !prompt) {
    return res.status(400).json({ message: 'userId ve prompt zorunludur.' });
  }

  try {
    const response = await askAssistant({ userId, prompt });
    return res.json(response);
  } catch (error) {
    console.error('Asistan hatası:', error);
    return res.status(500).json({ message: 'Asistan yanıtı alınamadı.' });
  }
});

export default router;
