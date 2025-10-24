// Şimdilik örnek veriler - Gerçek içerikleri daha sonra ekleyebilirsin
import { Unit, GradeLevel } from '../types';

// 6. Sınıf için örnek 8 ünite
export const grade6Units: Unit[] = [
  {
    id: 'unit-6-1',
    number: 1,
    title: 'Life',
    gradeLevel: 6,
    isLocked: false,
    totalWords: 82,
    completedWords: 0,
    words: [
      { id: 'word-1-1', english: 'Life', turkish: 'Yaşam, hayat' },
      { id: 'word-1-2', english: 'Time', turkish: 'Zaman' },
      { id: 'word-1-3', english: 'Clock', turkish: 'Saat' },
      { id: 'word-1-4', english: 'Half', turkish: 'Yarım, buçuk' },
      { id: 'word-1-5', english: 'Quarter', turkish: 'Çeyrek' },
      { id: 'word-1-6', english: 'Past', turkish: 'Geçe (saat söylerken)' },
      { id: 'word-1-7', english: 'To', turkish: 'Kala (saat söylerken)' },
      { id: 'word-1-8', english: 'Day', turkish: 'Gün' },
      { id: 'word-1-9', english: 'Month', turkish: 'Ay' },
      { id: 'word-1-10', english: 'Year', turkish: 'Yıl' },
      { id: 'word-1-11', english: 'Weekdays', turkish: 'Haftaiçi günler' },
      { id: 'word-1-12', english: 'Weekend', turkish: 'Haftasonu' },
      { id: 'word-1-13', english: 'Date', turkish: 'Tarih' },
      { id: 'word-1-14', english: 'Birthday', turkish: 'Doğumgünü' },
      { id: 'word-1-15', english: "Children's Day", turkish: 'Çocuk Bayramı' },
      { id: 'word-1-16', english: "New Year's Day", turkish: 'Yılbaşı' },
      { id: 'word-1-17', english: 'The Republic Day', turkish: 'Cumhuriyet Bayramı' },
      { id: 'word-1-18', english: 'Victory Day', turkish: 'Zafer Bayramı' },
      { id: 'word-1-19', english: 'Democracy and National Unity Day', turkish: 'Demokrasi ve Milli Birlik Günü' },
      { id: 'word-1-20', english: 'Wedding Ceremony', turkish: 'Düğün' },
      { id: 'word-1-21', english: 'Tea Party', turkish: 'Çay partisi' },
      { id: 'word-1-22', english: 'Get up', turkish: 'Uyanmak, kalkmak' },
      { id: 'word-1-23', english: 'Wake up', turkish: 'Uyanmak, kalkmak' },
      { id: 'word-1-24', english: 'Late', turkish: 'geç' },
      { id: 'word-1-25', english: 'Sleep', turkish: 'Uyumak' },
      { id: 'word-1-26', english: 'Go to bed', turkish: 'Yatağa gitmek' },
      { id: 'word-1-27', english: 'Leave home', turkish: 'Evden ayrılmak, çıkmak' },
      { id: 'word-1-28', english: 'Go to school', turkish: 'Okula gitmek' },
      { id: 'word-1-29', english: 'Walk to school', turkish: 'Okula yürümek' },
      { id: 'word-1-30', english: 'Come back from school', turkish: 'Okuldan geri gelmek' },
      { id: 'word-1-31', english: 'Have breakfast', turkish: 'Kahvaltı yapmak' },
      { id: 'word-1-32', english: 'Have lunch', turkish: 'Öğle yemeği yemek' },
      { id: 'word-1-33', english: 'Have dinner', turkish: 'Akşam yemeği yemek' },
      { id: 'word-1-34', english: 'Attend a course', turkish: 'Bir kursa/derse katılmak' },
      { id: 'word-1-35', english: 'Do homework', turkish: 'Ödev yapmak' },
      { id: 'word-1-36', english: 'Study', turkish: 'Çalışmak' },
      { id: 'word-1-37', english: 'Visit relatives', turkish: 'akrabaları ziyaret etmek' },
      { id: 'word-1-38', english: 'Play games', turkish: 'Oyunlar oynamak' },
      { id: 'word-1-39', english: 'Play with friends', turkish: 'Arkadaşlarla oynamak' },
      { id: 'word-1-40', english: 'Meet your friends', turkish: 'Arkadaşlarınla buluşmak' },
      { id: 'word-1-41', english: 'Ride a bicycle', turkish: 'Bisiklete binmek' },
      { id: 'word-1-42', english: 'Ride a horse', turkish: 'Ata binmek' },
      { id: 'word-1-43', english: 'Watch TV', turkish: 'Televizyon izlemek' },
      { id: 'word-1-44', english: 'Do jogging', turkish: 'Koşu yapmak' },
      { id: 'word-1-45', english: 'Do sports', turkish: 'Spor yapmak' },
      { id: 'word-1-46', english: 'Do the ironing', turkish: 'Ütü yapmak' },
      { id: 'word-1-47', english: 'Do cleaning', turkish: 'Temizlik yapmak' },
      { id: 'word-1-48', english: 'Wash the clothes', turkish: 'Çamaşırları yıkamak' },
      { id: 'word-1-49', english: 'Wash the dishes', turkish: 'Bulaşıkları yıkamak' },
      { id: 'word-1-50', english: 'Run errands', turkish: 'Ayak işleri yapmak, ayak işlerine bakmak (alışverişe gitmek, bankaya gitmek gibi.)' },
      { id: 'word-1-51', english: 'Rest', turkish: 'Dinlenmek' },
      { id: 'word-1-52', english: 'Take a nap', turkish: 'Kestirmek, şekerleme yapmak' },
      { id: 'word-1-53', english: 'Take care of the flowers', turkish: 'Çiçeklerle ilgilenmek' },
      { id: 'word-1-54', english: 'Take care of the plants', turkish: 'Bitkilerle ilgilenmek' },
      { id: 'word-1-55', english: 'Take the dog for a walk', turkish: 'Köpeği yürüyüşe çıkarmak' },
      { id: 'word-1-56', english: 'Start', turkish: 'Başlamak' },
      { id: 'word-1-57', english: 'Finish', turkish: 'Bitirmek, bitmek' },
      { id: 'word-1-58', english: 'Join', turkish: 'Katılmak' },
      { id: 'word-1-59', english: 'Invite', turkish: 'Davet etmek' },
      { id: 'word-1-60', english: 'Invitation card', turkish: 'Davetiye, davet kartı' },
      { id: 'word-1-61', english: 'Ticket', turkish: 'Bilet' },
      { id: 'word-1-62', english: 'Classmate', turkish: 'Sınıf arkadaşı' },
      { id: 'word-1-63', english: 'Diary', turkish: 'Günlük' },
      { id: 'word-1-64', english: 'Folk dance', turkish: 'Halk oyunu, halk dansı' },
      { id: 'word-1-65', english: 'Traditional Dance', turkish: 'Geleneksel/Yöresel dans' },
      { id: 'word-1-66', english: 'Weekly plan', turkish: 'Haftalık plan' },
      { id: 'word-1-67', english: 'In the morning', turkish: 'Sabah' },
      { id: 'word-1-68', english: 'At noon', turkish: 'Öğlen' },
      { id: 'word-1-69', english: 'In the afternoon', turkish: 'Öğleden sonra' },
      { id: 'word-1-70', english: 'In the evening', turkish: 'Akşam' },
      { id: 'word-1-71', english: 'At night', turkish: 'Gece' },
    ],
  },
  {
    id: 'unit-6-2',
    number: 2,
    title: 'Yummy Breakfast',
    gradeLevel: 6,
    isLocked: false,
    totalWords: 18,
    completedWords: 0,
    words: [
      {
        id: 'word-2-1',
        english: 'breakfast',
        turkish: 'kahvaltı',
        example: 'I have breakfast at 8 o\'clock.',
      },
      {
        id: 'word-2-2',
        english: 'lunch',
        turkish: 'öğle yemeği',
        example: 'What do you eat for lunch?',
      },
    ],
  },
  {
    id: 'unit-6-3',
    number: 3,
    title: 'Downtown',
    gradeLevel: 6,
    isLocked: false,
    totalWords: 15,
    completedWords: 0,
    words: [],
  },
  {
    id: 'unit-6-4',
    number: 4,
    title: 'Weather and Emotions',
    gradeLevel: 6,
    isLocked: false,
    totalWords: 22,
    completedWords: 0,
    words: [],
  },
  {
    id: 'unit-6-5',
    number: 5,
    title: 'At the Fair',
    gradeLevel: 6,
    isLocked: false,
    totalWords: 17,
    completedWords: 0,
    words: [],
  },
  {
    id: 'unit-6-6',
    number: 6,
    title: 'Occupations',
    gradeLevel: 6,
    isLocked: false,
    totalWords: 25,
    completedWords: 0,
    words: [],
  },
  {
    id: 'unit-6-7',
    number: 7,
    title: 'Holidays',
    gradeLevel: 6,
    isLocked: false,
    totalWords: 19,
    completedWords: 0,
    words: [],
  },
  {
    id: 'unit-6-8',
    number: 8,
    title: 'Bookworms',
    gradeLevel: 6,
    isLocked: false,
    totalWords: 21,
    completedWords: 0,
    words: [],
  },
];

// Diğer sınıflar için boş üniteler (şimdilik kilitli)
export const grade5Units: Unit[] = [];
export const grade7Units: Unit[] = [];
export const grade8Units: Unit[] = [];

// Sınıf seviyelerine göre üniteleri döndüren fonksiyon
export const getUnitsByGrade = (grade: GradeLevel): Unit[] => {
  switch (grade) {
    case 5:
      return grade5Units;
    case 6:
      return grade6Units;
    case 7:
      return grade7Units;
    case 8:
      return grade8Units;
    default:
      return [];
  }
};

