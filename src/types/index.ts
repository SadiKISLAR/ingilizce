// Uygulamamızda kullanacağımız tüm veri tiplerini burada tanımlıyoruz

// Sınıf seviyesi: 5, 6, 7 veya 8. sınıf
export type GradeLevel = 5 | 6 | 7 | 8;

// Kelime kartı - Her kelimenin özellikleri
export interface Word {
  id: string; // Benzersiz kimlik
  english: string; // İngilizce kelime
  turkish: string; // Türkçe anlamı
  example?: string; // Örnek cümle (opsiyonel)
  imageUrl?: string; // Kelime resmi (opsiyonel)
  audioUrl?: string; // Kelime telaffuzu (opsiyonel)
}

// Ünite bilgisi
export interface Unit {
  id: string; // Ünite ID'si
  number: number; // Ünite numarası (1-8)
  title: string; // Ünite başlığı (örn: "Hello")
  gradeLevel: GradeLevel; // Hangi sınıfa ait
  isLocked: boolean; // Kilitli mi?
  words: Word[]; // Ünitedeki kelimeler
  totalWords: number; // Toplam kelime sayısı
  completedWords: number; // Öğrenilen kelime sayısı
}

// Test sorusu
export interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching'; // Soru tipi
  question: string; // Soru metni
  correctAnswer: string; // Doğru cevap
  options?: string[]; // Seçenekler (çoktan seçmeli için)
  wordId: string; // Hangi kelimeyle ilgili
}

// Test bilgisi
export interface Test {
  id: string;
  unitId: string; // Hangi üniteye ait
  questions: Question[]; // Sorular
  totalQuestions: number; // Toplam soru sayısı
  score?: number; // Kullanıcının puanı (0-100)
  completedAt?: Date; // Test ne zaman tamamlandı
}

// Kullanıcı profili
export interface UserProfile {
  id: string;
  phoneNumber: string; // Telefon numarası
  gradeLevel: GradeLevel; // Hangi sınıfta
  createdAt: Date; // Kayıt tarihi
  totalScore: number; // Toplam puan
  completedUnits: string[]; // Tamamlanan ünite ID'leri
  learnedWords: string[]; // Öğrenilen kelime ID'leri
}

// Öğrenme aktivitesi tipi
export type ActivityType = 'flashcard' | 'quiz' | 'test';

// Kullanıcının ilerleme durumu
export interface UserProgress {
  userId: string;
  unitId: string;
  activityType: ActivityType;
  progress: number; // İlerleme yüzdesi (0-100)
  lastAccessedAt: Date; // Son erişim tarihi
}

