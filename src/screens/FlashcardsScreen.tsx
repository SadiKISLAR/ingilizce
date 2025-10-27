// Kelime Kartları Ekranı - Kartlar dönerek İngilizce/Türkçe gösterir

import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Dimensions,
  StatusBar 
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { grade6Units } from '../data/mockData';
import AdBanner from '../components/AdBanner';
import * as Speech from 'expo-speech';

type FlashcardsScreenRouteProp = RouteProp<RootStackParamList, 'Flashcards'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // 24px padding her iki tarafta

const FlashcardsScreen = () => {
  const route = useRoute<FlashcardsScreenRouteProp>();
  const navigation = useNavigation();
  const { unitId } = route.params;
  
  // Üniteyi bul
  const unit = grade6Units.find(u => u.id === unitId);
  
  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true); // Otomatik ses oynatma
  
  // Animasyon değeri
  const flipAnimation = useRef(new Animated.Value(0)).current;
  
  // Kelime değiştiğinde otomatik oku
  useEffect(() => {
    if (autoPlay && !isFlipped) {
      // Kısa bir gecikme ekleyelim (animasyon için)
      const timer = setTimeout(() => {
        speakWord();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoPlay, isFlipped]);
  
  if (!unit || unit.words.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Kelime bulunamadı</Text>
      </View>
    );
  }
  
  const currentWord = unit.words[currentIndex];
  
  // Kart döndürme animasyonu
  const flipCard = () => {
    if (isFlipped) {
      // Geri döndür (Türkçe -> İngilizce)
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setIsFlipped(false);
    } else {
      // İleri döndür (İngilizce -> Türkçe)
      Animated.spring(flipAnimation, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setIsFlipped(true);
    }
  };
  
  // Kelimeyi sesli okuma fonksiyonu
  const speakWord = async () => {
    try {
      // Eğer konuşma devam ediyorsa durdur
      const isSpeakingNow = await Speech.isSpeakingAsync();
      if (isSpeakingNow) {
        await Speech.stop();
        setIsSpeaking(false);
        return;
      }
      
      setIsSpeaking(true);
      
      // İngilizce kelimeyi oku (İngiliz aksanı ile)
      Speech.speak(currentWord.english, {
        language: 'en-US', // Amerikan İngilizcesi
        pitch: 1.0, // Normal ton
        rate: 0.75, // Biraz yavaş (öğrenme için)
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Ses hatası:', error);
      setIsSpeaking(false);
    }
  };
  
  // Sonraki kelime
  const nextCard = async () => {
    if (currentIndex < unit.words.length - 1) {
      // Ses varsa durdur
      await Speech.stop();
      setIsSpeaking(false);
      
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };
  
  // Önceki kelime
  const prevCard = async () => {
    if (currentIndex > 0) {
      // Ses varsa durdur
      await Speech.stop();
      setIsSpeaking(false);
      
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };
  
  // Ön yüz rotasyonu (İngilizce)
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  
  // Arka yüz rotasyonu (Türkçe)
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });
  
  // Opacity animasyonu
  const frontOpacity = flipAnimation.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });
  
  const backOpacity = flipAnimation.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Başlık */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{unit.title}</Text>
            <Text style={styles.progress}>
              {currentIndex + 1} / {unit.words.length}
            </Text>
          </View>
          
          <View style={styles.headerButtons}>
            {/* Otomatik Oynatma Toggle */}
            <TouchableOpacity 
              onPress={() => setAutoPlay(!autoPlay)}
              style={[styles.autoPlayButton, autoPlay && styles.autoPlayButtonActive]}
              activeOpacity={0.7}
            >
              <Text style={styles.autoPlayIcon}>
                {autoPlay ? '🔄' : '⏸️'}
              </Text>
              <Text style={styles.autoPlayText}>
                {autoPlay ? 'Otomatik' : 'Manuel'}
              </Text>
            </TouchableOpacity>
            
            {/* Ses Butonu */}
            <TouchableOpacity 
              onPress={speakWord}
              style={styles.speakerButton}
              activeOpacity={0.7}
            >
              <Text style={styles.speakerIcon}>
                {isSpeaking ? '🔊' : '🔈'}
              </Text>
              <Text style={styles.speakerText}>
                {isSpeaking ? 'Durakla' : 'Dinle'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Kart */}
      <View style={styles.cardContainer}>
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={flipCard}
          style={styles.cardTouchable}
        >
          {/* Ön yüz (İngilizce) */}
          <Animated.View
            style={[
              styles.card,
              styles.cardFront,
              {
                transform: [{ rotateY: frontInterpolate }],
                opacity: frontOpacity,
              },
            ]}
          >
            <Text style={styles.cardLabel}>İngilizce</Text>
            <Text style={styles.cardText}>{currentWord.english}</Text>
            <Text style={styles.tapHint}>Kartı çevirmek için dokun 👆</Text>
          </Animated.View>
          
          {/* Arka yüz (Türkçe) */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              {
                transform: [{ rotateY: backInterpolate }],
                opacity: backOpacity,
              },
            ]}
          >
            <Text style={styles.cardLabel}>Türkçe</Text>
            <Text style={styles.cardText}>{currentWord.turkish}</Text>
            <Text style={styles.tapHint}>Kartı çevirmek için dokun 👆</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
      
      {/* Navigasyon butonları */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={prevCard}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>← Önceki</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, currentIndex === unit.words.length - 1 && styles.navButtonDisabled]}
          onPress={nextCard}
          disabled={currentIndex === unit.words.length - 1}
        >
          <Text style={styles.navButtonText}>Sonraki →</Text>
        </TouchableOpacity>
      </View>
      
      {/* Banner Reklam - En altta */}
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
  },
  errorText: {
    color: 'white',
    fontSize: 20,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progress: {
    color: 'white',
    fontSize: 18,
    opacity: 0.9,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  autoPlayButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  autoPlayButtonActive: {
    backgroundColor: 'rgba(0, 204, 102, 0.3)',
    borderColor: '#00CC66',
  },
  autoPlayIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  autoPlayText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  speakerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  speakerIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  speakerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  cardTouchable: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  cardFront: {
    backgroundColor: 'white',
  },
  cardBack: {
    backgroundColor: '#f0f9ff',
  },
  cardLabel: {
    position: 'absolute',
    top: 24,
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e3a5f',
    textAlign: 'center',
  },
  tapHint: {
    position: 'absolute',
    bottom: 24,
    fontSize: 14,
    color: '#666',
    opacity: 0.7,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  navButton: {
    backgroundColor: 'white',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: 140,
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    color: '#0066CC',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FlashcardsScreen;

