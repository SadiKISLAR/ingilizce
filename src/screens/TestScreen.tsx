// Test Ekranı - Çoktan seçmeli kelime testi

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  StyleSheet, 
  StatusBar,
  Animated,
  Alert 
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { grade6Units } from '../data/mockData';
import { 
  generateQuiz, 
  calculateScore, 
  getScoreMessage, 
  QuizQuestion,
  LanguageDirection,
  QuestionType 
} from '../utils/quizGenerator';
import AdBanner from '../components/AdBanner';
import * as Speech from 'expo-speech';

type TestScreenRouteProp = RouteProp<RootStackParamList, 'Test'>;

const TestScreen = () => {
  const route = useRoute<TestScreenRouteProp>();
  const navigation = useNavigation();
  const { unitId, testMode } = route.params;
  
  // Üniteyi bul
  const unit = grade6Units.find(u => u.id === unitId);
  
  // State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalWords, setTotalWords] = useState(0); // Toplam kelime sayısı (eşleştirme için)
  const [correctWords, setCorrectWords] = useState(0); // Doğru kelime sayısı
  const [showResults, setShowResults] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [questionType, setQuestionType] = useState<'mixed' | LanguageDirection>('mixed');
  const [canChangeType, setCanChangeType] = useState(true);
  const [quizMode, setQuizMode] = useState<'all' | 'multiple-choice'>('multiple-choice'); // Tüm tip veya sadece çoktan seçmeli
  
  // Eşleştirme için state'ler
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
  const [matchings, setMatchings] = useState<Array<{ english: string; turkish: string }>>([]);
  const [matchingResults, setMatchingResults] = useState<Array<{ english: string; turkish: string; correct: boolean }>>([]);
  
  // Quiz'i başlat
  useEffect(() => {
    if (unit && unit.words.length >= 4) {
      const fixedDirection: LanguageDirection | undefined = questionType === 'mixed' ? undefined : questionType;
      
      // testMode parametresine göre soru tipini belirle
      let questionTypes: QuestionType[] = ['multiple-choice']; // Varsayılan
      let questionCount = 10; // Varsayılan soru sayısı
      
      if (testMode === 'matching') {
        questionTypes = ['matching'];
        // Eşleştirme için: Her soru 8 kelime kullanır (minimum 6)
        questionCount = Math.min(5, Math.floor(unit.words.length / 8));
      } else if (testMode === 'fill-blank') {
        questionTypes = ['fill-blank'];
      } else if (quizMode === 'all') {
        questionTypes = ['multiple-choice', 'fill-blank', 'matching'];
      }
      
      const quiz = generateQuiz(unit.words, questionCount, fixedDirection, questionTypes);
      setQuestions(quiz);
      
      // Toplam kelime sayısını hesapla (eşleştirme modunda)
      if (testMode === 'matching') {
        const total = quiz.reduce((sum, q) => {
          if (q.type === 'matching') {
            return sum + q.pairs.length;
          }
          return sum + 1;
        }, 0);
        setTotalWords(total);
      } else {
        setTotalWords(quiz.length);
      }
      
      // Fade in animasyonu
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [unit, questionType, quizMode, testMode]);
  
  // Yeni soru gösterildiğinde İngilizce kelimeyi oku (sadece İngilizce soru ise)
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQ = questions[currentQuestionIndex];
      
      // Sadece İngilizce kelime soruluyorsa (İngilizce → Türkçe) oku
      if (currentQ.direction === 'english-to-turkish' && currentQ.type === 'multiple-choice') {
        const englishWord = currentQ.questionWord.english;
        
        // Kısa gecikme sonra oku (animasyon için)
        const timer = setTimeout(() => {
          Speech.speak(englishWord, {
            language: 'en-US',
            pitch: 1.0,
            rate: 0.75,
          });
        }, 400);
        
        return () => {
          clearTimeout(timer);
          Speech.stop();
        };
      }
    }
  }, [currentQuestionIndex, questions]);
  
  if (!unit) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ünite bulunamadı</Text>
      </View>
    );
  }
  
  if (unit.words.length < 4) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Test için en az 4 kelime gerekli</Text>
      </View>
    );
  }
  
  if (questions.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Test hazırlanıyor...</Text>
      </View>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  // Soru yok veya undefined ise hata göster
  if (!currentQuestion) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Soru yüklenemedi</Text>
      </View>
    );
  }
  
  // Cevap seçimi
  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return; // Zaten cevaplandıysa işlem yapma
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    // İlk soruyu cevapladıysa artık dil değişikliği yapılamaz
    if (currentQuestionIndex === 0 && canChangeType) {
      setCanChangeType(false);
    }
    
    // Doğru mu kontrol et
    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
      setCorrectWords(correctWords + 1); // Kelime sayısını da güncelle
    }
  };
  
  // Eşleştirme: İngilizce kelime seçimi
  const handleEnglishSelect = (english: string) => {
    if (isAnswered) return;
    setSelectedEnglish(english);
  };
  
  // Eşleştirme: Türkçe kelime seçimi ve eşleştirme
  const handleTurkishSelect = (turkish: string) => {
    if (isAnswered || !selectedEnglish) return;
    
    // Zaten eşleştirilmiş mi kontrol et
    const alreadyMatched = matchings.find(m => m.english === selectedEnglish || m.turkish === turkish);
    if (alreadyMatched) return;
    
    // Yeni eşleştirme ekle
    const newMatching = { english: selectedEnglish, turkish };
    setMatchings([...matchings, newMatching]);
    setSelectedEnglish(null);
  };
  
  // Eşleştirmeleri kontrol et
  const checkMatchings = () => {
    const currentQ = questions[currentQuestionIndex];
    if (currentQ.type !== 'matching') return;
    
    const results = matchings.map(matching => {
      const correctPair = currentQ.pairs.find(p => p.english === matching.english);
      const correct = correctPair ? correctPair.turkish === matching.turkish : false;
      return { ...matching, correct };
    });
    
    setMatchingResults(results);
    setIsAnswered(true);
    
    // Kelime bazında doğru sayısını güncelle
    const correctMatchings = results.filter(r => r.correct).length;
    setCorrectWords(correctWords + correctMatchings);
    
    // Soru bazında doğru sayısı (tüm eşleştirmeler doğruysa)
    if (correctMatchings === currentQ.pairs.length) {
      setCorrectCount(correctCount + 1);
    }
  };
  
  // Sonraki soru
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      
      // Eşleştirme state'lerini sıfırla
      setSelectedEnglish(null);
      setMatchings([]);
      setMatchingResults([]);
      
      // Fade animasyonu
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Test bitti, sonuçları göster
      setShowResults(true);
    }
  };
  
  // Dil değiştirme
  const handleChangeQuestionType = () => {
    if (!canChangeType) {
      Alert.alert(
        'Dil Değişikliği',
        'Sınavı bitirmeden dil değiştiremezsiniz. Önce testi tamamlayın.',
        [{ text: 'Tamam', style: 'default' }]
      );
      return;
    }
    
    // Cycle through: mixed → eng-tr → tr-eng → mixed
    if (questionType === 'mixed') {
      setQuestionType('english-to-turkish');
    } else if (questionType === 'english-to-turkish') {
      setQuestionType('turkish-to-english');
    } else {
      setQuestionType('mixed');
    }
    
    // Quiz yeniden oluşturulacak
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectCount(0);
  };
  
  // Testi tekrarla
  const handleRetry = () => {
    const fixedDirection: LanguageDirection | undefined = questionType === 'mixed' ? undefined : questionType;
    
    // testMode parametresine göre soru tipini belirle
    let questionTypes: QuestionType[] = ['multiple-choice'];
    let questionCount = 10;
    
    if (testMode === 'matching') {
      questionTypes = ['matching'];
      questionCount = Math.min(5, Math.floor(unit!.words.length / 8));
    } else if (testMode === 'fill-blank') {
      questionTypes = ['fill-blank'];
    } else if (quizMode === 'all') {
      questionTypes = ['multiple-choice', 'fill-blank', 'matching'];
    }
    
    const quiz = generateQuiz(unit!.words, questionCount, fixedDirection, questionTypes);
    setQuestions(quiz);
    
    // Toplam kelime sayısını hesapla
    if (testMode === 'matching') {
      const total = quiz.reduce((sum, q) => {
        if (q.type === 'matching') {
          return sum + q.pairs.length;
        }
        return sum + 1;
      }, 0);
      setTotalWords(total);
    } else {
      setTotalWords(quiz.length);
    }
    
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setCorrectWords(0);
    setShowResults(false);
    setCanChangeType(true); // Yeni testte tekrar değiştirilebilir
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  
  // Sonuç Ekranı
  if (showResults) {
    // Eşleştirme modunda kelime bazında, diğerlerinde soru bazında hesapla
    const isMatchingMode = testMode === 'matching';
    const totalCount = isMatchingMode ? totalWords : questions.length;
    const correctCountDisplay = isMatchingMode ? correctWords : correctCount;
    const wrongCount = totalCount - correctCountDisplay;
    
    const score = calculateScore(correctCountDisplay, totalCount);
    const message = getScoreMessage(score);
    
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Tamamlandı! 🎉</Text>
          
          <View style={styles.scoreCard}>
            <Text style={styles.scoreText}>{score}</Text>
            <Text style={styles.scoreLabel}>Puan</Text>
          </View>
          
          <Text style={styles.scoreMessage}>{message}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{correctCountDisplay}</Text>
              <Text style={styles.statLabel}>Doğru ✓</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{wrongCount}</Text>
              <Text style={styles.statLabel}>Yanlış ✗</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCount}</Text>
              <Text style={styles.statLabel}>Toplam</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRetry}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>🔄 Tekrar Dene</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>← Geri Dön</Text>
          </TouchableOpacity>
        </ScrollView>
        
        <AdBanner />
      </View>
    );
  }
  
  // Soru Ekranı
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Soru {currentQuestionIndex + 1} / {questions.length}
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
          {/* Soru Tipi - Sadece çoktan seçmeli için göster */}
          {currentQuestion.type !== 'matching' && (
          <TouchableOpacity 
            style={[
              styles.questionTypeContainer,
              !canChangeType && styles.questionTypeContainerDisabled
            ]}
            onPress={handleChangeQuestionType}
            activeOpacity={0.7}
          >
            <Text style={styles.questionTypeText}>
              {questionType === 'mixed' 
                ? '🔀 Karışık Mod (Dokun)' 
                : questionType === 'english-to-turkish'
                ? '🇬🇧 İngilizce → 🇹🇷 Türkçe (Dokun)'
                : '🇹🇷 Türkçe → 🇬🇧 İngilizce (Dokun)'}
            </Text>
            {canChangeType && (
              <Text style={styles.questionTypeHint}>
                ⓘ Değiştirmek için dokun
              </Text>
            )}
          </TouchableOpacity>
          )}
          
          {/* Soru - Sadece çoktan seçmeli için göster */}
          {currentQuestion.type !== 'matching' && (
          <View style={styles.questionCard}>
            <Text style={styles.questionLabel}>
              {currentQuestion.direction === 'english-to-turkish' 
                ? 'İngilizce kelime:' 
                : 'Türkçe kelime:'}
            </Text>
            <Text style={styles.questionText}>
              {currentQuestion.direction === 'english-to-turkish' 
                ? currentQuestion.questionWord.english 
                : currentQuestion.questionWord.turkish}
            </Text>
          </View>
          )}
          
          {/* Seçenekler - Sadece çoktan seçmeli için */}
          {currentQuestion.type === 'multiple-choice' && (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const isCorrect = option === currentQuestion.correctAnswer;
              const isSelected = option === selectedAnswer;
              
              let optionStyle = styles.optionButton;
              if (isAnswered) {
                if (isCorrect) {
                  optionStyle = styles.optionButtonCorrect;
                } else if (isSelected && !isCorrect) {
                  optionStyle = styles.optionButtonWrong;
                }
              } else if (isSelected) {
                optionStyle = styles.optionButtonSelected;
              }
              
              return (
                <TouchableOpacity
                  key={index}
                  style={optionStyle}
                  onPress={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionLetter}>
                    {String.fromCharCode(65 + index)})
                  </Text>
                  <Text style={styles.optionText}>{option}</Text>
                  {isAnswered && isCorrect && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <Text style={styles.crossmark}>✗</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          )}
          
          {/* Eşleştirme - Sadece matching için */}
          {currentQuestion.type === 'matching' && currentQuestion.pairs && currentQuestion.shuffledOptions && (
          <View style={styles.matchingContainer}>
            {/* Her satırda hizalı eşleştirme öğeleri */}
            {currentQuestion.pairs.filter(pair => pair && pair.english && pair.turkish).map((pair, index) => {
              const englishWord = pair.english;
              const turkishWord = currentQuestion.shuffledOptions[index];
              
              const isEnglishSelected = selectedEnglish === englishWord;
              const englishMatched = matchings.find(m => m.english === englishWord);
              const turkishMatched = matchings.find(m => m.turkish === turkishWord);
              const englishMatchResult = matchingResults.find(r => r.english === englishWord);
              const turkishMatchResult = matchingResults.find(r => r.turkish === turkishWord);
              
              // Sol taraf (İngilizce) stil
              let leftItemStyle = styles.matchingItem;
              if (isAnswered && englishMatchResult) {
                leftItemStyle = englishMatchResult.correct ? styles.matchingItemCorrect : styles.matchingItemWrong;
              } else if (englishMatched) {
                leftItemStyle = styles.matchingItemMatched;
              } else if (isEnglishSelected) {
                leftItemStyle = styles.matchingItemSelected;
              }
              
              // Sağ taraf (Türkçe) stil
              let rightItemStyle = styles.matchingItem;
              if (isAnswered && turkishMatchResult) {
                rightItemStyle = turkishMatchResult.correct ? styles.matchingItemCorrect : styles.matchingItemWrong;
              } else if (turkishMatched) {
                rightItemStyle = styles.matchingItemMatched;
              }
              
              return (
                <View key={`row-${index}`} style={styles.matchingRow}>
                  {/* Sol - İngilizce */}
                  <TouchableOpacity
                    style={[leftItemStyle, styles.matchingItemLeft]}
                    onPress={() => handleEnglishSelect(englishWord)}
                    disabled={isAnswered || !!englishMatched}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.matchingNumber}>{index + 1}</Text>
                    <Text style={styles.matchingText}>{englishWord}</Text>
                    {isAnswered && englishMatchResult && (
                      <Text style={styles.matchingIcon}>
                        {englishMatchResult.correct ? '✓' : '✗'}
                      </Text>
                    )}
                  </TouchableOpacity>
                  
                  {/* Orta boşluk */}
                  <View style={styles.matchingDivider} />
                  
                  {/* Sağ - Türkçe */}
                  <TouchableOpacity
                    style={[rightItemStyle, styles.matchingItemRight]}
                    onPress={() => handleTurkishSelect(turkishWord)}
                    disabled={isAnswered || !!turkishMatched || !selectedEnglish}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.matchingText}>{turkishWord}</Text>
                    <Text style={styles.matchingLetter}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                    {isAnswered && turkishMatchResult && (
                      <Text style={styles.matchingIcon}>
                        {turkishMatchResult.correct ? '✓' : '✗'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
            
            {/* Kontrol Et Butonu */}
            {!isAnswered && matchings.length === currentQuestion.pairs.length && (
              <TouchableOpacity
                style={styles.checkButton}
                onPress={checkMatchings}
                activeOpacity={0.8}
              >
                <Text style={styles.checkButtonText}>Kontrol Et ✓</Text>
              </TouchableOpacity>
            )}
            
            {/* Sonuç Gösterimi */}
            {isAnswered && (
              <View style={styles.matchingResultContainer}>
                <Text style={styles.matchingResultText}>
                  {matchingResults.filter(r => r.correct).length} / {currentQuestion.pairs.length} Doğru
                </Text>
              </View>
            )}
          </View>
          )}
          
          {/* Sonraki Buton */}
          {isAnswered && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex < questions.length - 1 
                  ? 'Sonraki Soru →' 
                  : 'Sonuçları Gör 🎯'}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
      
      <AdBanner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0066CC',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  progressContainer: {
    padding: 16,
    paddingTop: 56,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#00CC66',
    borderRadius: 3,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 12,
  },
  questionContainer: {
    flex: 1,
  },
  questionTypeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  questionTypeContainerDisabled: {
    opacity: 0.6,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  questionTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  questionTypeHint: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  questionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a5f',
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 8,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0066CC',
    marginBottom: 8,
  },
  optionButtonCorrect: {
    backgroundColor: '#d4edda',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#28a745',
    marginBottom: 8,
  },
  optionButtonWrong: {
    backgroundColor: '#f8d7da',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dc3545',
    marginBottom: 8,
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
    marginRight: 12,
    minWidth: 24,
  },
  optionText: {
    fontSize: 15,
    color: '#1e3a5f',
    flex: 1,
  },
  checkmark: {
    fontSize: 22,
    color: '#28a745',
    marginLeft: 6,
  },
  crossmark: {
    fontSize: 22,
    color: '#dc3545',
    marginLeft: 6,
  },
  nextButton: {
    backgroundColor: '#00CC66',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Sonuç Ekranı Stilleri
  resultsContainer: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 80,
  },
  resultsTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 100,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  scoreText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  scoreLabel: {
    fontSize: 20,
    color: '#666',
    marginTop: 8,
  },
  scoreMessage: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    fontSize: 16,
    marginTop: 4,
    opacity: 0.9,
  },
  statDivider: {
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  retryButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 16,
  },
  retryButtonText: {
    color: '#0066CC',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Eşleştirme Stilleri
  matchingContainer: {
    marginBottom: 8,
  },
  matchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  matchingItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    borderWidth: 2,
    borderColor: 'rgba(0, 102, 204, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
  },
  matchingItemLeft: {
    flex: 1,
    marginRight: 4,
  },
  matchingItemRight: {
    flex: 1,
    marginLeft: 4,
  },
  matchingItemSelected: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#0066CC',
  },
  matchingItemMatched: {
    backgroundColor: '#fff9c4',
    borderWidth: 2,
    borderColor: '#FFC107',
  },
  matchingItemCorrect: {
    backgroundColor: '#d4edda',
    borderWidth: 2,
    borderColor: '#28a745',
  },
  matchingItemWrong: {
    backgroundColor: '#f8d7da',
    borderWidth: 2,
    borderColor: '#dc3545',
  },
  matchingDivider: {
    width: 8,
  },
  matchingNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0066CC',
    marginRight: 6,
  },
  matchingLetter: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0066CC',
    marginLeft: 6,
  },
  matchingText: {
    fontSize: 12,
    color: '#1e3a5f',
    flex: 1,
  },
  matchingIcon: {
    fontSize: 16,
    marginLeft: 4,
  },
  checkButton: {
    backgroundColor: '#FFC107',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  checkButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  matchingResultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  matchingResultText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TestScreen;

