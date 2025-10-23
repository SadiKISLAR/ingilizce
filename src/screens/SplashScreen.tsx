// Splash Ekranı - Uygulama açılışında gösterilen ekran

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../navigation/types';

const SplashScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();

  useEffect(() => {
    // 2 saniye sonra sınıf seçim ekranına geç
    const timer = setTimeout(() => {
      navigation.replace('GradeSelection');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Logo alanı */}
      <View style={styles.logoCard}>
        <Text style={styles.logoTextPrimary}>ing</Text>
        <Text style={styles.logoTextSecondary}>Learn</Text>
      </View>
      
      {/* Alt kısımda versiyon bilgisi */}
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0066CC', // Primary mavi
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoTextPrimary: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  logoTextSecondary: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#00CC66',
  },
  version: {
    position: 'absolute',
    bottom: 40,
    color: 'white',
    fontSize: 14,
  },
});

export default SplashScreen;

