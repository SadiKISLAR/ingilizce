// Şimdilik örnek veriler - Gerçek içerikleri daha sonra ekleyebilirsin
import { Unit, GradeLevel } from '../types';

// 6. Sınıf için örnek 8 ünite
export const grade6Units: Unit[] = [
  {
    id: 'unit-6-1',
    number: 1,
    title: 'Life',
    gradeLevel: 6,
    isLocked: false, // İlk ünite açık
    totalWords: 20,
    completedWords: 0,
    words: [
      {
        id: 'word-1-1',
        english: 'name',
        turkish: 'isim',
        example: 'What is your name?',
      },
      {
        id: 'word-1-2',
        english: 'surname',
        turkish: 'soyisim',
        example: 'My surname is Smith.',
      },
      {
        id: 'word-1-3',
        english: 'age',
        turkish: 'yaş',
        example: 'How old are you?',
      },
      // Daha fazla kelime eklenecek...
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

