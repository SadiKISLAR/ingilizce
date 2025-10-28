// Navigation tipleri - Her ekranın parametrelerini tanımlıyoruz

import { GradeLevel } from '../types';

// Ana stack navigator'ın ekranları
export type RootStackParamList = {
  // Splash ekranı - Uygulama açılışında gösterilir
  Splash: undefined; // Parametre almaz
  
  // Sınıf seçim ekranı - Kullanıcı hangi sınıfta?
  GradeSelection: undefined;
  
  // Ünite listesi ekranı - Seçilen sınıfın üniteleri
  UnitList: {
    gradeLevel: GradeLevel; // Hangi sınıfın üniteleri gösterilecek
  };
  
  // Ünite detay ekranı - Kelimeler, testler vb.
  UnitDetail: {
    unitId: string; // Hangi ünite
  };
  
  // Kelime kartları ekranı (flip card)
  Flashcards: {
    unitId: string;
  };
  
  // Test ekranı - Çoktan seçmeli kelime testi
  Test: {
    unitId: string;
  };
};

// Navigation prop tipini oluşturuyoruz (her ekranda kullanacağız)
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

