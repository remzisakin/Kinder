# KhakiMatch Backend

KhakiMatch'in Node.js, Express ve Prisma tabanlı backend servisi. Gerçek zamanlı eşleşme ve mesajlaşmayı Socket.IO ile sağlar ve OpenAI tabanlı (veya mock) asistan uç noktası sunar.

## Başlangıç

### Gereksinimler

- Node.js 18+
- npm

### Kurulum

```bash
cd backend
npm install
cp .env.example .env
# .env dosyasında gerekirse PORT, CORS_ORIGIN ve LLM_API_KEY değerlerini güncelleyin
```

### Veritabanı

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

> SQLite dosyası `prisma/dev.db` altında oluşturulur. Reponun dışında tutulur.

### Geliştirme Sunucusu

```bash
npm run dev
```

Sunucu varsayılan olarak `http://localhost:4000` adresinde çalışır.

### Üretim Derlemesi

```bash
npm run build
npm start
```

### Socket.IO

- Namespace: `/realtime`
- Oda stratejisi: `user:<userId>` ve `match:<matchId>`
- Etkinlikler: `match:created`, `message:new`

### Önemli Uç Noktalar

| Metot | Yol | Açıklama |
| --- | --- | --- |
| POST | `/auth/register` | Kullanıcı kaydı |
| GET | `/users/feed` | Kaydırma kartları için kullanıcı akışı |
| POST | `/likes` | Beğeni kaydı, eşleşme kontrolü |
| GET | `/matches` | Eşleşme listesi |
| GET | `/messages/:matchId` | Eşleşmedeki mesajlar |
| POST | `/messages` | Yeni mesaj oluştur |
| POST | `/assistant/ask` | LLM destekli asistan yanıtı |

LLM anahtarı verilmezse güvenli buluşma önerileri içeren mock yanıt döner.

## Kod Kalitesi

- ESLint ve Prettier yapılandırmaları dahildir: `npm run lint`

