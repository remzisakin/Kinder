import axios from 'axios';

type AskParams = {
  userId: number;
  prompt: string;
};

type AskResult = {
  answer: string;
  provider: string;
};

const MOCK_RESPONSE =
  'Güvenli buluşma ipuçları: İlk buluşmalarda halka açık yerleri seç, arkadaşlarına planını haber ver ve içgüdülerine güven.';

export const askAssistant = async ({ prompt }: AskParams): Promise<AskResult> => {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    return {
      answer: MOCK_RESPONSE,
      provider: 'mock',
    };
  }

  const baseUrl = 'https://api.openai.com/v1/chat/completions';

  try {
    const { data } = await axios.post(
      baseUrl,
      {
        model: process.env.LLM_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Sen güvenli flört ve saygılı iletişim üzerine rehberlik veren bir asistansın. Kişisel veri toplamaktan kaçın.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    const answer = data?.choices?.[0]?.message?.content?.trim() || MOCK_RESPONSE;

    return {
      answer,
      provider: 'openai',
    };
  } catch (error) {
    console.error('LLM isteği başarısız:', error);
    return {
      answer: MOCK_RESPONSE,
      provider: 'fallback',
    };
  }
};
