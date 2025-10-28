// Quiz Oluşturucu - Kelimelerden otomatik test soruları üretir

import { Word } from '../types';

export interface QuizQuestion {
  id: string;
  questionWord: Word; // Sorulacak kelime
  correctAnswer: string; // Doğru cevap
  options: string[]; // 4 seçenek (1 doğru, 3 yanlış)
  type: 'english-to-turkish' | 'turkish-to-english'; // Soru tipi
}

// Rastgele kelime seç (mevcut kelime hariç)
const getRandomWords = (words: Word[], excludeId: string, count: number): Word[] => {
  const available = words.filter(w => w.id !== excludeId);
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Seçenekleri karıştır
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Kelime listesinden quiz soruları oluşturur
 * @param words - Kelime listesi (minimum 4 kelime olmalı)
 * @param questionCount - Kaç soru oluşturulacak (varsayılan: 10)
 * @returns Quiz soruları
 */
export const generateQuiz = (words: Word[], questionCount: number = 10): QuizQuestion[] => {
  if (words.length < 4) {
    throw new Error('En az 4 kelime gerekli!');
  }

  // Soru sayısı kelime sayısından fazla olamaz
  const actualQuestionCount = Math.min(questionCount, words.length);
  
  // Rastgele kelimeler seç
  const selectedWords = shuffleArray(words).slice(0, actualQuestionCount);
  
  const questions: QuizQuestion[] = selectedWords.map((word, index) => {
    // Rastgele soru tipi seç (İngilizce->Türkçe veya Türkçe->İngilizce)
    const type: 'english-to-turkish' | 'turkish-to-english' = 
      Math.random() > 0.5 ? 'english-to-turkish' : 'turkish-to-english';
    
    // Yanlış cevaplar için 3 rastgele kelime seç
    const wrongWords = getRandomWords(words, word.id, 3);
    
    let correctAnswer: string;
    let wrongAnswers: string[];
    
    if (type === 'english-to-turkish') {
      // İngilizce kelime sorulacak, Türkçe cevap verilecek
      correctAnswer = word.turkish;
      wrongAnswers = wrongWords.map(w => w.turkish);
    } else {
      // Türkçe kelime sorulacak, İngilizce cevap verilecek
      correctAnswer = word.english;
      wrongAnswers = wrongWords.map(w => w.english);
    }
    
    // Seçenekleri karıştır (doğru cevap + 3 yanlış)
    const options = shuffleArray([correctAnswer, ...wrongAnswers]);
    
    return {
      id: `question-${index + 1}`,
      questionWord: word,
      correctAnswer,
      options,
      type,
    };
  });
  
  return questions;
};

/**
 * Puanı hesaplar (0-100 arası)
 */
export const calculateScore = (correctCount: number, totalCount: number): number => {
  if (totalCount === 0) return 0;
  return Math.round((correctCount / totalCount) * 100);
};

/**
 * Başarı mesajı döndürür
 */
export const getScoreMessage = (score: number): string => {
  if (score >= 90) return 'Mükemmel! 🌟';
  if (score >= 80) return 'Harika! 🎉';
  if (score >= 70) return 'Çok İyi! 👏';
  if (score >= 60) return 'İyi! 👍';
  if (score >= 50) return 'Fena Değil! 💪';
  return 'Biraz Daha Çalış! 📚';
};

