// Ünite Listesi Ekranı - Seçilen sınıfın tüm üniteleri gösterilir

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackNavigationProp, RootStackParamList } from '../navigation/types';
import { getUnitsByGrade } from '../data/mockData';
import AdBanner from '../components/AdBanner';

// Route tipini tanımlıyoruz
type UnitListScreenRouteProp = RouteProp<RootStackParamList, 'UnitList'>;

const UnitListScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<UnitListScreenRouteProp>();
  
  // Hangi sınıfın üniteleri gösterilecek
  const { gradeLevel } = route.params;
  
  // Mock data'dan üniteleri al
  const units = getUnitsByGrade(gradeLevel);

  // Üniteye tıklandığında detay sayfasına git
  const handleUnitPress = (unitId: string) => {
    navigation.navigate('UnitDetail', { unitId });
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

      {/* Ünite listesi - Dikey scroll */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {units.map((unit) => (
          <TouchableOpacity
            key={unit.id}
            onPress={() => handleUnitPress(unit.id)}
            style={styles.unitButton}
            activeOpacity={0.8}
          >
            <View style={styles.unitCard}>
              <Text style={styles.unitText}>{unit.number}. Ünite</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
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
    width: 40, // Sabit genişlik
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
  unitButton: {
    marginBottom: 16,
  },
  unitCard: {
    backgroundColor: '#1e3a5f',
    borderRadius: 24,
    padding: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  unitText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UnitListScreen;
