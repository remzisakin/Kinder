# KhakiMatch

KhakiMatch, Tinder benzeri bir deneyim sunan örnek bir mobil + backend projesidir. Depo iki ana klasörden oluşur:

- `frontend/`: Expo + React Native + TypeScript
- `backend/`: Node.js + Express + TypeScript + Prisma (SQLite)

## Hızlı Başlangıç

### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Emülatör: API_BASE_URL=http://10.0.2.2:4000
# Gerçek cihaz: API_BASE_URL=http://<LAN_IP>:4000
npx expo start -c
```

Ayrıntılı kurulum adımları için her klasördeki README dosyalarına göz atın.

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır. Ayrıntılar için `LICENSE` dosyasına bakın.
