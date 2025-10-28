// Quiz Oluşturucu - Kelimelerden otomatik test soruları üretir

import { Word } from '../types';

export type QuestionType = 'multiple-choice' | 'fill-blank' | 'matching';
export type LanguageDirection = 'english-to-turkish' | 'turkish-to-english';

export interface BaseQuizQuestion {
  id: string;
  questionWord: Word;
  correctAnswer: string;
  direction: LanguageDirection;
}

export interface MultipleChoiceQuestion extends BaseQuizQuestion {
  type: 'multiple-choice';
  options: string[]; // 4 seçenek
}

export interface FillBlankQuestion extends BaseQuizQuestion {
  type: 'fill-blank';
  sentence: string; // Boşluklu cümle
  blank: string; // Boşluğa gelecek kelime
}

export interface MatchingQuestion extends BaseQuizQuestion {
  type: 'matching';
  pairs: Array<{ english: string; turkish: string; id: string }>; // Eşleştirilecek çiftler
  shuffledOptions: string[]; // Karıştırılmış seçenekler
}

export type QuizQuestion = MultipleChoiceQuestion | FillBlankQuestion | MatchingQuestion;

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

// Çoktan seçmeli soru üret
const generateMultipleChoice = (
  word: Word,
  words: Word[],
  direction: LanguageDirection,
  index: number
): MultipleChoiceQuestion => {
  const wrongWords = getRandomWords(words, word.id, 3);
  
  let correctAnswer: string;
  let wrongAnswers: string[];
  
  if (direction === 'english-to-turkish') {
    correctAnswer = word.turkish;
    wrongAnswers = wrongWords.map(w => w.turkish);
  } else {
    correctAnswer = word.english;
    wrongAnswers = wrongWords.map(w => w.english);
  }
  
  const options = shuffleArray([correctAnswer, ...wrongAnswers]);
  
  return {
    type: 'multiple-choice',
    id: `mc-${index}`,
    questionWord: word,
    correctAnswer,
    options,
    direction,
  };
};

// Boşluk doldurma sorusu üret
const generateFillBlank = (
  word: Word,
  direction: LanguageDirection,
  index: number
): FillBlankQuestion => {
  let sentence: string;
  let blank: string;
  let correctAnswer: string;
  
  if (direction === 'english-to-turkish') {
    // İngilizce cümle, Türkçe kelime eksik
    sentence = word.example || `The word is _____.`;
    blank = word.turkish;
    correctAnswer = word.turkish;
  } else {
    // Türkçe cümle, İngilizce kelime eksik
    sentence = `İngilizce karşılığı: _____`;
    blank = word.english;
    correctAnswer = word.english;
  }
  
  return {
    type: 'fill-blank',
    id: `fb-${index}`,
    questionWord: word,
    correctAnswer,
    sentence,
    blank,
    direction,
  };
};

// Eşleştirme sorusu üret (8 kelime çifti - ekrana sığacak kadar)
const generateMatching = (
  words: Word[],
  startIndex: number,
  index: number
): MatchingQuestion | null => {
  // 8 kelime seç - yeterli yoksa mevcut olanı al (minimum 6)
  const desiredCount = 8;
  const minCount = 6;
  
  if (startIndex + minCount > words.length) {
    return null;
  }
  
  const availableCount = Math.min(desiredCount, words.length - startIndex);
  const actualCount = Math.max(minCount, availableCount);
  
  const selectedWords = words.slice(startIndex, startIndex + actualCount);
  
  if (selectedWords.length < minCount) {
    return null;
  }
  
  const pairs = selectedWords.map((w, i) => ({
    id: `pair-${i}`,
    english: w.english,
    turkish: w.turkish,
  }));
  
  // Türkçe kelimeleri karıştır
  const shuffledOptions = shuffleArray(pairs.map(p => p.turkish));
  
  return {
    type: 'matching',
    id: `match-${index}`,
    questionWord: selectedWords[0], // İlk kelime referans
    correctAnswer: 'matching', // Eşleştirme için özel
    pairs,
    shuffledOptions,
    direction: 'english-to-turkish',
  };
};

/**
 * Kelime listesinden quiz soruları oluşturur
 * @param words - Kelime listesi (minimum 4 kelime olmalı)
 * @param questionCount - Kaç soru oluşturulacak (varsayılan: 10)
 * @param fixedDirection - Sabit dil yönü (opsiyonel)
 * @param questionTypes - Hangi soru tiplerini kullan (varsayılan: sadece çoktan seçmeli)
 * @returns Quiz soruları
 */
export const generateQuiz = (
  words: Word[], 
  questionCount: number = 10,
  fixedDirection?: LanguageDirection,
  questionTypes: QuestionType[] = ['multiple-choice']
): QuizQuestion[] => {
  if (words.length < 4) {
    throw new Error('En az 4 kelime gerekli!');
  }

  const questions: QuizQuestion[] = [];
  
  // Eşleştirme için özel hesaplama
  if (questionTypes.length === 1 && questionTypes[0] === 'matching') {
    // Eşleştirme modu: Her soru 8 kelime kullanır (minimum 6)
    const shuffledWords = shuffleArray([...words]);
    const wordsPerQuestion = 8;
    const maxMatchingQuestions = Math.floor(words.length / wordsPerQuestion);
    const actualQuestionCount = Math.min(questionCount, maxMatchingQuestions);
    
    let wordIndex = 0;
    for (let i = 0; i < actualQuestionCount; i++) {
      const matchingQuestion = generateMatching(shuffledWords, wordIndex, i);
      if (matchingQuestion) {
        questions.push(matchingQuestion);
        wordIndex += matchingQuestion.pairs.length; // Kullanılan kelime sayısı kadar ilerle
      }
    }
    
    return questions;
  }
  
  // Normal modlar (çoktan seçmeli, fill-blank veya karışık)
  const actualQuestionCount = Math.min(questionCount, words.length);
  const selectedWords = shuffleArray(words).slice(0, actualQuestionCount);
  let wordIndex = 0;
  
  for (let i = 0; i < actualQuestionCount; i++) {
    // wordIndex kontrolü
    if (wordIndex >= selectedWords.length) break;
    
    // Rastgele soru tipi seç
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    // Dil yönünü belirle
    const direction: LanguageDirection = fixedDirection || 
      (Math.random() > 0.5 ? 'english-to-turkish' : 'turkish-to-english');
    
    if (questionType === 'multiple-choice') {
      if (selectedWords[wordIndex]) {
        questions.push(generateMultipleChoice(selectedWords[wordIndex], words, direction, i));
        wordIndex++;
      }
    } else if (questionType === 'fill-blank') {
      if (selectedWords[wordIndex]) {
        questions.push(generateFillBlank(selectedWords[wordIndex], direction, i));
        wordIndex++;
      }
    } else if (questionType === 'matching') {
      // Eşleştirme için 6-8 kelime gerekli
      if (wordIndex + 6 <= selectedWords.length) {
        const matchingQuestion = generateMatching(selectedWords, wordIndex, i);
        if (matchingQuestion) {
          questions.push(matchingQuestion);
          wordIndex += matchingQuestion.pairs.length; // Kullanılan kelime sayısı kadar ilerle
        } else if (selectedWords[wordIndex]) {
          // Matching oluşturulamadıysa çoktan seçmeli yap
          questions.push(generateMultipleChoice(selectedWords[wordIndex], words, direction, i));
          wordIndex++;
        }
      } else if (selectedWords[wordIndex]) {
        // Yeterli kelime yoksa çoktan seçmeli yap
        questions.push(generateMultipleChoice(selectedWords[wordIndex], words, direction, i));
        wordIndex++;
      }
    }
  }
  
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

