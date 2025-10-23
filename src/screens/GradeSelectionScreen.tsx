// Sınıf Seçim Ekranı - Kullanıcı hangi sınıfta onu seçer (5-8. sınıflar)

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, StyleSheet, Alert } from 'react-native';
import { GradeLevel } from '../types';

const GradeSelectionScreen = () => {
  // Sınıflar - 5, 6, 7, 8
  const grades: { level: GradeLevel; isActive: boolean }[] = [
    { level: 5, isActive: false }, // Şimdilik pasif
    { level: 6, isActive: true },  // Sadece 6. sınıf aktif
    { level: 7, isActive: false },
    { level: 8, isActive: false },
  ];

  // Sınıf seçildiğinde
  const handleGradePress = (grade: GradeLevel, isActive: boolean) => {
    if (isActive) {
      // Geçici olarak alert göster
      Alert.alert('Sınıf Seçildi', `${grade}. sınıf seçildi!`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Üst kısım - Logo ve başlık */}
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

      {/* Sınıf butonları - Grid layout (2x2) */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.gridContainer}>
          {grades.map((grade) => (
            <TouchableOpacity
              key={grade.level}
              onPress={() => handleGradePress(grade.level, grade.isActive)}
              style={[
                styles.gradeButton,
                !grade.isActive && styles.gradeButtonDisabled
              ]}
              activeOpacity={0.8}
              disabled={!grade.isActive}
            >
              <View style={styles.gradeCard}>
                <Text style={styles.gradeNumber}>{grade.level}.</Text>
                <Text style={styles.gradeText}>Sınıf</Text>
                
                {/* Pasif sınıflar için kilit işareti */}
                {!grade.isActive && (
                  <View style={styles.lockIcon}>
                    <Text style={styles.lockEmoji}>🔒</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    paddingTop: 64,
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
    width: 64, // 25% of 256
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gradeButton: {
    width: 170, // Yaklaşık yarım ekran
    marginBottom: 16,
  },
  gradeButtonDisabled: {
    opacity: 0.6,
  },
  gradeCard: {
    backgroundColor: '#1e3a5f',
    borderRadius: 24,
    padding: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  gradeNumber: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gradeText: {
    color: 'white',
    fontSize: 24,
  },
  lockIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#666',
    borderRadius: 999,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockEmoji: {
    fontSize: 18,
  },
});

export default GradeSelectionScreen;
