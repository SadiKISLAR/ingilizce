// Test Ekranı - Çoktan seçmeli kelime testi

import React, { useState, useEffect } from 'react';
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
import { generateQuiz, calculateScore, getScoreMessage, QuizQuestion } from '../utils/quizGenerator';
import AdBanner from '../components/AdBanner';
import * as Speech from 'expo-speech';

type TestScreenRouteProp = RouteProp<RootStackParamList, 'Test'>;

const TestScreen = () => {
  const route = useRoute<TestScreenRouteProp>();
  const navigation = useNavigation();
  const { unitId } = route.params;
  
  // Üniteyi bul
  const unit = grade6Units.find(u => u.id === unitId);
  
  // State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [questionType, setQuestionType] = useState<'mixed' | 'english-to-turkish' | 'turkish-to-english'>('mixed');
  const [canChangeType, setCanChangeType] = useState(true);
  
  // Quiz'i başlat
  useEffect(() => {
    if (unit && unit.words.length >= 4) {
      const fixedType = questionType === 'mixed' ? undefined : questionType;
      const quiz = generateQuiz(unit.words, 10, fixedType);
      setQuestions(quiz);
      // Fade in animasyonu
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [unit, questionType]);
  
  // Yeni soru gösterildiğinde İngilizce kelimeyi oku
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQ = questions[currentQuestionIndex];
      // İngilizce kelimeyi bul ve oku
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
    if (answer === currentQuestion.correctAnswer) {
      setCorrectCount(correctCount + 1);
    }
  };
  
  // Sonraki soru
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      
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
    const fixedType = questionType === 'mixed' ? undefined : questionType;
    const quiz = generateQuiz(unit.words, 10, fixedType);
    setQuestions(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectCount(0);
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
    const score = calculateScore(correctCount, questions.length);
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
              <Text style={styles.statValue}>{correctCount}</Text>
              <Text style={styles.statLabel}>Doğru ✓</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{questions.length - correctCount}</Text>
              <Text style={styles.statLabel}>Yanlış ✗</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{questions.length}</Text>
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
          {/* Soru Tipi - Tıklanabilir */}
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
          
          {/* Soru */}
          <View style={styles.questionCard}>
            <Text style={styles.questionLabel}>
              {currentQuestion.type === 'english-to-turkish' 
                ? 'İngilizce kelime:' 
                : 'Türkçe kelime:'}
            </Text>
            <Text style={styles.questionText}>
              {currentQuestion.type === 'english-to-turkish' 
                ? currentQuestion.questionWord.english 
                : currentQuestion.questionWord.turkish}
            </Text>
          </View>
          
          {/* Seçenekler */}
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
    padding: 16,
    paddingBottom: 20,
  },
  questionContainer: {
    flex: 1,
  },
  questionTypeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 16,
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
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  questionLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e3a5f',
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 10,
  },
  optionButtonSelected: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0066CC',
    marginBottom: 10,
  },
  optionButtonCorrect: {
    backgroundColor: '#d4edda',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#28a745',
    marginBottom: 10,
  },
  optionButtonWrong: {
    backgroundColor: '#f8d7da',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dc3545',
    marginBottom: 10,
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
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
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
});

export default TestScreen;

