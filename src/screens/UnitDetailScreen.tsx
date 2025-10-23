// Ünite Detay Ekranı - Kelime listesi, kelime kartları ve test seçenekleri

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackNavigationProp, RootStackParamList } from '../navigation/types';
import { grade6Units } from '../data/mockData';

type UnitDetailScreenRouteProp = RouteProp<RootStackParamList, 'UnitDetail'>;

const UnitDetailScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<UnitDetailScreenRouteProp>();
  
  const { unitId } = route.params;
  
  // Üniteyi bul
  const unit = grade6Units.find(u => u.id === unitId);
  
  if (!unit) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ünite bulunamadı</Text>
      </View>
    );
  }

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
          onPress={() => console.log('Kelime Listesi')}
          style={styles.activityButton}
          activeOpacity={0.8}
        >
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>Kelime Listesi</Text>
          </View>
        </TouchableOpacity>

        {/* Kelime Kartları Butonu */}
        <TouchableOpacity
          onPress={() => console.log('Kelime Kartları')}
          style={styles.activityButton}
          activeOpacity={0.8}
        >
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>Kelime Kartları</Text>
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
});

export default UnitDetailScreen;
