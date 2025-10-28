// Test Modu Seçim Ekranı - Kullanıcı hangi tür test yapmak istediğini seçer

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackNavigationProp, RootStackParamList } from '../navigation/types';
import AdBanner from '../components/AdBanner';

type TestModeSelectionRouteProp = RouteProp<RootStackParamList, 'TestModeSelection'>;

const TestModeSelectionScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<TestModeSelectionRouteProp>();
  const { unitId } = route.params;

  const testModes = [
    {
      id: 'multiple-choice',
      title: 'Çoktan Seçmeli',
      description: '4 seçenekten doğru cevabı bul',
      icon: '📝',
      color: '#0066CC',
    },
    {
      id: 'fill-blank',
      title: 'Boşluk Doldurma',
      description: 'Eksik kelimeleri tamamla',
      icon: '✍️',
      color: '#00CC66',
      disabled: true, // Henüz hazır değil
    },
    {
      id: 'matching',
      title: 'Kelime Eşleştirme',
      description: 'İngilizce-Türkçe eşleştir',
      icon: '🔗',
      color: '#FF9900',
      disabled: false, // Artık hazır!
    },
    {
      id: 'all',
      title: 'Karışık Test',
      description: 'Tüm soru tipleri karışık',
      icon: '🎯',
      color: '#9933FF',
      disabled: true, // Henüz hazır değil
    },
  ];

  const handleModeSelect = (modeId: string) => {
    if (modeId === 'multiple-choice' || modeId === 'matching') {
      navigation.navigate('Test', { unitId, testMode: modeId });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Başlık */}
      <View style={styles.header}>
        <Text style={styles.title}>Kendinizi Test Edin</Text>
        <Text style={styles.subtitle}>Test türünü seçin</Text>
      </View>

      {/* Test Modları */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {testModes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            onPress={() => handleModeSelect(mode.id)}
            style={[
              styles.modeButton,
              mode.disabled && styles.modeButtonDisabled
            ]}
            activeOpacity={0.8}
            disabled={mode.disabled}
          >
            <View style={[styles.modeCard, { borderLeftColor: mode.color }]}>
              <View style={styles.modeHeader}>
                <Text style={styles.modeIcon}>{mode.icon}</Text>
                <View style={styles.modeTextContainer}>
                  <Text style={styles.modeTitle}>{mode.title}</Text>
                  <Text style={styles.modeDescription}>{mode.description}</Text>
                </View>
              </View>
              
              {mode.disabled && (
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Yakında</Text>
                </View>
              )}
              
              {!mode.disabled && (
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>→</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
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
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  modeButton: {
    marginBottom: 16,
  },
  modeButtonDisabled: {
    opacity: 0.6,
  },
  modeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modeIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: '#666',
  },
  comingSoonBadge: {
    backgroundColor: '#FF9900',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  comingSoonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TestModeSelectionScreen;

