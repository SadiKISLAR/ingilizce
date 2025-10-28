// Ana navigasyon yapısı - Tüm ekranlar burada tanımlanıyor

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { View, Text, StyleSheet } from 'react-native';

// Ekranları import edeceğiz
import SplashScreen from '../screens/SplashScreen';
import GradeSelectionScreen from '../screens/GradeSelectionScreen';
import UnitListScreen from '../screens/UnitListScreen';
import UnitDetailScreen from '../screens/UnitDetailScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';
import TestModeSelectionScreen from '../screens/TestModeSelectionScreen';
import TestScreen from '../screens/TestScreen';

// Stack Navigator oluşturuyoruz
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  // Error handling
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Bir hata oluştu</Text>
      </View>
    );
  }

  try {
    return (
      // NavigationContainer: Tüm navigasyonu sarmalayan ana bileşen
      <NavigationContainer>
      {/* Stack.Navigator: Sayfa yığınını yöneten bileşen */}
      <Stack.Navigator
        // İlk açılacak ekran
        initialRouteName="Splash"
        // Tüm ekranlar için varsayılan ayarlar
        screenOptions={{
          // Header stilini özelleştiriyoruz
          headerStyle: {
            backgroundColor: '#0066CC', // Mavi arka plan
          },
          headerTintColor: '#fff', // Beyaz yazı
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Splash Ekranı - Header gizli */}
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{ headerShown: false }} // Header'ı gizle
        />
        
        {/* Sınıf Seçim Ekranı */}
        <Stack.Screen 
          name="GradeSelection" 
          component={GradeSelectionScreen}
          options={{ 
            title: 'Sınıf Seçin',
            headerShown: false // Bu ekranda da header gizli
          }}
        />
        
        {/* Ünite Listesi Ekranı */}
        <Stack.Screen 
          name="UnitList" 
          component={UnitListScreen}
          options={{ title: 'Üniteler' }}
        />
        
        {/* Ünite Detay Ekranı */}
        <Stack.Screen 
          name="UnitDetail" 
          component={UnitDetailScreen}
          options={{ title: 'Ünite Detayı' }}
        />
        
        {/* Kelime Kartları Ekranı */}
        <Stack.Screen 
          name="Flashcards" 
          component={FlashcardsScreen}
          options={{ 
            title: 'Kelime Kartları',
            headerStyle: { backgroundColor: '#0066CC' },
            headerTintColor: '#fff',
          }}
        />
        
        {/* Test Modu Seçim Ekranı */}
        <Stack.Screen 
          name="TestModeSelection" 
          component={TestModeSelectionScreen}
          options={{ 
            title: 'Test Seçimi',
            headerStyle: { backgroundColor: '#0066CC' },
            headerTintColor: '#fff',
          }}
        />
        
        {/* Test Ekranı */}
        <Stack.Screen 
          name="Test" 
          component={TestScreen}
          options={{ 
            title: 'Kelime Testi',
            headerStyle: { backgroundColor: '#0066CC' },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    );
  } catch (error) {
    console.error('AppNavigator Error:', error);
    setHasError(true);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Uygulama yüklenirken hata oluştu</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
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
});

export default AppNavigator;

