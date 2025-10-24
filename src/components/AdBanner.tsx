// Banner Reklam Komponenti - Ekranın altında görünür

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdBanner = () => {
  // Şimdilik placeholder gösteriyoruz
  // APK oluştururken gerçek AdMob kodunu ekleyeceğiz
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>📢 REKLAM ALANI</Text>
      <Text style={styles.placeholderSubtext}>
        (APK'da gerçek reklam gösterilecek)
      </Text>
    </View>
  );
  
  /* GERÇEK ADMOB KODU - APK İÇİN
  import { AdMobBanner } from 'expo-ads-admob';
  
  const adUnitId = Platform.select({
    android: 'ca-app-pub-XXXXX/XXXXX', // Gerçek AdMob ID'nizi buraya
    ios: 'ca-app-pub-XXXXX/XXXXX',
  });

  return (
    <View style={styles.container}>
      <AdMobBanner
        bannerSize="banner"
        adUnitID={adUnitId}
        servePersonalizedAds={true}
        onDidFailToReceiveAdWithError={(error) => {
          console.log('Reklam yüklenemedi:', error);
        }}
      />
    </View>
  );
  */
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: 50,
  },
  placeholderContainer: {
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    height: 50,
    paddingVertical: 4,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  placeholderSubtext: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
});

export default AdBanner;

