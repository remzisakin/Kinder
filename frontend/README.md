# KhakiMatch Frontend

Expo + React Native ile hazırlanan KhakiMatch istemcisi. Android emülatörde Tinder benzeri bir kaydırma deneyimi sunar ve Socket.IO ile gerçek zamanlı mesajlaşma içerir.

## Başlangıç

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Expo CLI (`npm install -g expo-cli` önerilir)
- Android Studio (emülatör kullanacaksanız)

### Kurulum

```bash
cd frontend
npm install
cp .env.example .env
```

`.env` dosyasında `API_BASE_URL` değerini güncelleyin:

- Android emülatör için: `http://10.0.2.2:4000`
- Gerçek cihaz için: `http://<yerel_IP_adresiniz>:4000`

### Geliştirme

```bash
npx expo start -c
```

- `a`: Android emülatörü
- `s`: QR kod ile Expo Go

Gerekirse yerel derleme için:

```bash
npx expo run:android
```

### Kod Kalitesi

```bash
npm run lint
```

### Öne Çıkanlar

- Kart kaydırma deneyimi (`react-native-deck-swiper`)
- Gerçek zamanlı eşleşme ve mesajlaşma (Socket.IO)
- Lottie animasyonu URL üzerinden yüklenir, cihazda dosya tutmaz
- Zustand ile hafif durum yönetimi

## Dizin Yapısı

```
frontend/
├── App.tsx
├── src/
│   ├── api/
│   ├── components/
│   ├── screens/
│   ├── store/
│   ├── theme/
│   ├── types/
│   └── utils/
```

Her ekran Türkçe metinler içerir ve dokunmatik hedefler en az 44dp olacak şekilde tasarlanmıştır.

