// Ünite Detay Ekranı - Kelime listesi, kelime kartları ve test seçenekleri

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, StyleSheet, Modal } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackNavigationProp, RootStackParamList } from '../navigation/types';
import { grade6Units } from '../data/mockData';
import AdBanner from '../components/AdBanner';
import * as Speech from 'expo-speech';

type UnitDetailScreenRouteProp = RouteProp<RootStackParamList, 'UnitDetail'>;

const UnitDetailScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<UnitDetailScreenRouteProp>();
  
  const { unitId } = route.params;
  
  // Üniteyi bul
  const unit = grade6Units.find(u => u.id === unitId);
  
  // State
  const [showWordList, setShowWordList] = useState(false);
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);
  
  if (!unit) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ünite bulunamadı</Text>
      </View>
    );
  }
  
  // Kelimeyi sesli okuma
  const speakWord = async (english: string, wordId: string) => {
    try {
      const isSpeakingNow = await Speech.isSpeakingAsync();
      if (isSpeakingNow) {
        await Speech.stop();
        setSpeakingWordId(null);
        return;
      }
      
      setSpeakingWordId(wordId);
      
      Speech.speak(english, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.75,
        onDone: () => setSpeakingWordId(null),
        onStopped: () => setSpeakingWordId(null),
        onError: () => setSpeakingWordId(null),
      });
    } catch (error) {
      console.error('Ses hatası:', error);
      setSpeakingWordId(null);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Üst kısım - Logo ve progress */}
      <View style={styles.header}>
        {/* Logo kartı */}
        <View style={styles.logoCard}>
          <View style={styles.logoRow}>
            <View style={styles.logoBox}>
              <Text style={styles.logoTextIng}>ing</Text>
            </View>
            <View style={styles.logoDivider} />
            <View style={styles.logoTextContainer}>
              <Text style={styles.logoTextLearn}>Learn</Text>
            </View>
          </View>
        </View>
        
        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar} />
        </View>
      </View>

      {/* Aktivite butonları - 3 buton */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Kelime Listesi Butonu */}
        <TouchableOpacity
          onPress={() => setShowWordList(true)}
          style={styles.activityButton}
          activeOpacity={0.8}
        >
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>Kelime Listesi</Text>
            <Text style={styles.activitySubtext}>
              {unit.words.length} kelime
            </Text>
          </View>
        </TouchableOpacity>

        {/* Kelime Kartları Butonu */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Flashcards', { unitId: unit.id })}
          style={styles.activityButton}
          activeOpacity={0.8}
        >
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>Kelime Kartları</Text>
            <Text style={styles.activitySubtext}>
              {unit.words.length} kelime
            </Text>
          </View>
        </TouchableOpacity>

        {/* Test Butonu */}
        <TouchableOpacity
          onPress={() => console.log('Kelime Testi')}
          style={styles.activityButton}
          activeOpacity={0.8}
        >
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>Kelime Testi</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Kelime Listesi Modal */}
      <Modal
        visible={showWordList}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowWordList(false)}
      >
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" />
          
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{unit.title} - Kelime Listesi</Text>
            <TouchableOpacity
              onPress={() => {
                Speech.stop();
                setSpeakingWordId(null);
                setShowWordList(false);
              }}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {/* Kelime Listesi */}
          <ScrollView style={styles.wordListScroll}>
            {unit.words.map((word, index) => (
              <View key={word.id} style={styles.wordItem}>
                <View style={styles.wordContent}>
                  <View style={styles.wordTexts}>
                    <Text style={styles.wordNumber}>{index + 1}.</Text>
                    <View style={styles.wordTranslations}>
                      <Text style={styles.wordEnglish}>{word.english}</Text>
                      <Text style={styles.wordTurkish}>{word.turkish}</Text>
                    </View>
                  </View>
                  
                  {/* Ses Butonu */}
                  <TouchableOpacity
                    onPress={() => speakWord(word.english, word.id)}
                    style={styles.wordSpeakerButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.wordSpeakerIcon}>
                      {speakingWordId === word.id ? '🔊' : '🔈'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
      
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
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
  logoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 8,
    borderLeftColor: 'white',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    backgroundColor: '#1e3a5f',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
  },
  logoTextIng: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoDivider: {
    width: 4,
    height: 40,
    backgroundColor: '#0066CC',
    marginRight: 12,
  },
  logoTextContainer: {
    paddingLeft: 12,
  },
  logoTextLearn: {
    color: '#00CC66',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    width: 256,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: {
    height: 12,
    width: 64, // Sabit genişlik - şimdilik
    backgroundColor: '#00CC66',
    borderRadius: 999,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  activityButton: {
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: '#1e3a5f',
    borderRadius: 24,
    padding: 32,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activityText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activitySubtext: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  // Modal Stilleri
  modalContainer: {
    flex: 1,
    backgroundColor: '#0066CC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#0066CC',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  wordListScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  wordItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wordContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  wordTexts: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
    marginRight: 12,
    minWidth: 30,
  },
  wordTranslations: {
    flex: 1,
  },
  wordEnglish: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  wordTurkish: {
    fontSize: 16,
    color: '#666',
  },
  wordSpeakerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  wordSpeakerIcon: {
    fontSize: 24,
  },
});

export default UnitDetailScreen;
