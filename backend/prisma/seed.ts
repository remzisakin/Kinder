import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const url = (n: number) => `https://i.pravatar.cc/300?img=${n}`;

const users = [
  { name: 'Elif', age: 24, gender: 'female', bio: 'Kahve ve doğa yürüyüşleri.', interests: ['kahve', 'doğa', 'kitap'], photos: [url(1)] },
  { name: 'Mert', age: 27, gender: 'male', bio: 'Basketbol ve indie müzik.', interests: ['spor', 'müzik'], photos: [url(2)] },
  { name: 'Zeynep', age: 22, gender: 'female', bio: 'Fotoğraf ve kamp.', interests: ['fotoğraf', 'kamp'], photos: [url(3)] },
  { name: 'Can', age: 29, gender: 'male', bio: 'Yemek yapmayı sever.', interests: ['yemek', 'gezi'], photos: [url(4)] },
  { name: 'Deniz', age: 26, gender: 'nonbinary', bio: 'Teknoloji meraklısı.', interests: ['teknoloji', 'oyun'], photos: [url(5)] },
  { name: 'Ayşe', age: 25, gender: 'female', bio: 'Yoga ve meditasyon.', interests: ['yoga', 'sağlık'], photos: [url(6)] },
  { name: 'Emre', age: 28, gender: 'male', bio: 'Koşu ve startuplar.', interests: ['koşu', 'girişim'], photos: [url(7)] },
  { name: 'Selin', age: 23, gender: 'female', bio: 'Resim ve müze gezileri.', interests: ['sanat', 'müze'], photos: [url(8)] },
  { name: 'Burak', age: 30, gender: 'male', bio: 'Deniz, dalış.', interests: ['deniz', 'dalış'], photos: [url(9)] },
  { name: 'İpek', age: 24, gender: 'female', bio: 'Kitap kurdu.', interests: ['kitap', 'kütüphane'], photos: [url(10)] },
  { name: 'Kerem', age: 31, gender: 'male', bio: 'Fotoğraf ve kamp.', interests: ['fotoğraf', 'kamp'], photos: [url(11)] },
  { name: 'Naz', age: 22, gender: 'female', bio: 'Dans ve tiyatro.', interests: ['dans', 'tiyatro'], photos: [url(12)] },
  { name: 'Umut', age: 27, gender: 'male', bio: 'Kod yazmayı sever.', interests: ['kod', 'oyun'], photos: [url(13)] },
  { name: 'Derya', age: 29, gender: 'female', bio: 'Bisiklet ve kahve.', interests: ['bisiklet', 'kahve'], photos: [url(14)] },
  { name: 'Onur', age: 26, gender: 'male', bio: 'Sinema aşığı.', interests: ['sinema', 'müzik'], photos: [url(15)] },
  { name: 'Mina', age: 25, gender: 'female', bio: 'Seyahat tutkunu.', interests: ['seyahat', 'yemek'], photos: [url(16)] },
  { name: 'Arda', age: 28, gender: 'male', bio: 'Dağcılık ve trekking.', interests: ['doğa', 'trekking'], photos: [url(17)] },
  { name: 'Eda', age: 23, gender: 'female', bio: 'Patisserie meraklısı.', interests: ['tatlı', 'yemek'], photos: [url(18)] },
  { name: 'Baran', age: 27, gender: 'male', bio: 'Masa tenisi, satranç.', interests: ['spor', 'satranç'], photos: [url(19)] },
  { name: 'Sude', age: 24, gender: 'female', bio: 'Podcast ve blog.', interests: ['podcast', 'yazı'], photos: [url(20)] },
];

async function main() {
  for (const u of users) {
    await prisma.user.create({ data: u });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
