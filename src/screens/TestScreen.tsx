// Test Ekranı - Sadece basit bir ekran

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TestScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Test Ekranı Çalışıyor! 🎉</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TestScreen;

