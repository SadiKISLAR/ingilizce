// Kelime Avı Oyunu Ekranı

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Animated,
  Alert,
  PanResponder,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { grade6Units } from '../data/mockData';

console.log(`🔍 GRADE6UNITS DEBUG: ${grade6Units.length} ünite var`);
console.log(`🔍 GRADE6UNITS İÇERİK:`, grade6Units.map(u => ({ id: u.id, title: u.title, words: u.words.length })));
import { generateWordSearch, checkWord, WordSearchPuzzle } from '../utils/wordSearchGenerator';
import AdBanner from '../components/AdBanner';

type WordSearchScreenRouteProp = RouteProp<RootStackParamList, 'WordSearch'>;

const WordSearchScreen = () => {
  const route = useRoute<WordSearchScreenRouteProp>();
  const navigation = useNavigation();
  const { unitId } = route.params;

  const unit = grade6Units.find(u => u.id === unitId);
  
  console.log(`🔍 UNIT DEBUG: unitId=${unitId}, unit=${!!unit}, words.length=${unit?.words.length}`);

  const [puzzle, setPuzzle] = useState<WordSearchPuzzle | null>(null);
  const [selectedCells, setSelectedCells] = useState<Array<{ row: number; col: number }>>([]);
  
  console.log(`🔍 PUZZLE STATE: ${puzzle ? 'VAR' : 'YOK'}`);
  console.log(`🔍 SELECTED CELLS: ${selectedCells.length} hücre`);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundWordCells, setFoundWordCells] = useState<Set<string>>(new Set()); // "row-col" formatında
  const [fadeAnim] = useState(new Animated.Value(0));
  const gridContainerRef = useRef<View>(null);
  
  // isSelecting'i ref olarak kullan (senkron erişim için)
  const isSelectingRef = useRef(false);
  
  // selectedCells'i de ref'te tut (senkron erişim için)
  const selectedCellsRef = useRef<Array<{ row: number; col: number }>>([]);
  
  // Grid'in ekrandaki pozisyonu
  const gridPositionRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const [gridReady, setGridReady] = useState(false);

  // Hücre seçimi başlat
  const handleCellPress = (row: number, col: number) => {
    isSelectingRef.current = true;
    const newCells = [{ row, col }];
    selectedCellsRef.current = newCells;
    setSelectedCells(newCells);
  };

  // Hücre üzerinde gezinme
  const handleCellMove = (row: number, col: number) => {
    if (!isSelectingRef.current) {
      console.log(`⚠️ UYARI: isSelecting=false, hareket edilemedi`);
      return;
    }

    // Ref'ten oku (senkron)
    const currentCells = selectedCellsRef.current;
    const lastCell = currentCells[currentCells.length - 1];
    
    console.log(`   🔍 Son hücre: ${lastCell ? `(${lastCell.row},${lastCell.col})` : 'yok'}, Yeni: (${row},${col})`);
    
    if (!lastCell || (lastCell.row === row && lastCell.col === col)) {
      console.log(`   ⏸️ Aynı hücre veya son hücre yok`);
      return;
    }

    // Zaten seçili mi?
    const isAlreadySelected = currentCells.some(
      cell => cell.row === row && cell.col === col
    );

    if (!isAlreadySelected) {
      const newCells = [...currentCells, { row, col }];
      console.log(`➕ YENİ HÜCRE: (${row}, ${col}) eklendi. Toplam: ${newCells.length}`);
      selectedCellsRef.current = newCells;
      setSelectedCells(newCells);
      
      // Her eklenen hücreden sonra kelimeyi kontrol et
      checkCurrentWord(newCells);
    } else {
      console.log(`⏭️ ATLA: Hücre (${row}, ${col}) zaten seçili`);
    }
  };

  // Seçimi tamamla
  const handleCellRelease = () => {
    console.log(`🔴 BİTTİ: ${selectedCellsRef.current.length} hücre seçilmişti`);
    
    // Son kontrol - kelimeyi kontrol et
    if (selectedCellsRef.current.length >= 2) {
      console.log(`🔍 SON KONTROL: Kelime kontrol ediliyor...`);
      checkCurrentWord(selectedCellsRef.current);
    }
    
    selectedCellsRef.current = [];
    setSelectedCells([]);
    isSelectingRef.current = false;
  };

  // Mevcut seçimi kontrol et
  const checkCurrentWord = (cells: Array<{ row: number; col: number }>) => {
    console.log(`🔍 CHECKCURRENTWORD ÇAĞRILDI: ${cells.length} hücre`);
    console.log(`🔍 DEBUG: puzzle=${!!puzzle}, puzzle!=null=${puzzle !== null}, unit=${!!unit}, cells=${cells.length}`);
    
    if (cells.length < 2 || !unit) {
      console.log(`❌ CHECKCURRENTWORD ATLANDI: cells=${cells.length}, unit=${!!unit}`);
      return;
    }
    
    if (!puzzle) {
      console.log(`❌ PUZZLE HENÜZ OLUŞMADI, BEKLE...`);
      return;
    }

    console.log(`✅ CHECKCURRENTWORD DEVAM EDİYOR: checkWord çağrılıyor...`);
    const foundWord = checkWord(puzzle, cells);
    
    console.log(`🔍 CHECKCURRENTWORD SONUCU: foundWord="${foundWord}", foundWords=`, Array.from(foundWords));
    
    if (foundWord && !foundWords.has(foundWord)) {
      // Doğru kelime bulundu!
      console.log(`🎉 KELİME BULUNDU: ${foundWord}`);
      
      // Yeni state'leri oluştur
      const newFoundWords = new Set([...foundWords, foundWord]);
      const newFoundCells = new Set(foundWordCells);
      
      console.log(`🔧 STATE GÜNCELLENİYOR: newFoundWords=`, Array.from(newFoundWords));
      
      // Bulunan kelimenin hücrelerini kaydet
      cells.forEach(cell => {
        newFoundCells.add(`${cell.row}-${cell.col}`);
      });
      
      console.log(`🔧 HÜCRELER EKLENİYOR: newFoundCells=`, Array.from(newFoundCells));
      
      // State'leri güncelle
      setFoundWords(newFoundWords);
      setFoundWordCells(newFoundCells);
      
      console.log(`✅ STATE'LER GÜNCELLENDİ!`);
      
      selectedCellsRef.current = [];
      setSelectedCells([]);
      isSelectingRef.current = false;
      
      // Tüm kelimeler bulundu mu?
      if (newFoundWords.size === puzzle.words.length) {
        setTimeout(() => {
          Alert.alert(
            'Tebrikler! 🎉',
            'Tüm kelimeleri buldunuz!',
            [
              {
                text: 'Yeni Oyun',
                onPress: () => {
                  const newPuzzle = generateWordSearch(unit.words, 6, 8);
                  setPuzzle(newPuzzle);
                  setFoundWords(new Set());
                  setFoundWordCells(new Set());
                },
              },
              {
                text: 'Geri Dön',
                onPress: () => navigation.goBack(),
              },
            ]
          );
        }, 300);
      }
    }
  };

  // Dokunma koordinatlarından grid hücresini hesapla (pageX/pageY kullan)
  const getCellFromTouch = (pageX: number, pageY: number): { row: number; col: number } | null => {
    const gridPos = gridPositionRef.current;
    
    // Grid'in gerçek boyutlarını al
    const gridWidth = gridPos.width;
    const gridHeight = gridPos.height;
    const padding = 8;
    
    // Ekrandaki mutlak pozisyondan grid içi pozisyona çevir
    const relativeX = pageX - gridPos.x - padding;
    const relativeY = pageY - gridPos.y - padding;
    
    // Grid içindeki gerçek boyutları hesapla (padding çıkarılmış)
    const innerWidth = gridWidth - (padding * 2);
    const innerHeight = gridHeight - (padding * 2);
    
    // Her hücrenin boyutu (8x8 grid için)
    const cellWidth = innerWidth / 8;
    const cellHeight = innerHeight / 8;
    
    const col = Math.floor(relativeX / cellWidth);
    const row = Math.floor(relativeY / cellHeight);
    
    console.log(`   📐 Hesaplama: pageX=${Math.round(pageX)}, pageY=${Math.round(pageY)} | gridPos=(${Math.round(gridPos.x)},${Math.round(gridPos.y)},${Math.round(gridPos.width)}x${Math.round(gridPos.height)}) → relX=${Math.round(relativeX)}, relY=${Math.round(relativeY)} → cellSize=${Math.round(cellWidth)}x${Math.round(cellHeight)} → row=${row}, col=${col}`);
    
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
      return { row, col };
    }
    console.log(`   ❌ Hücre grid dışında!`);
    return null;
  };

  // PanResponder - sürükleme için
  const panResponder = useRef(
    PanResponder.create({
      // Touch'ı hemen yakala (ScrollView'dan önce)
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      
      onPanResponderGrant: (evt) => {
        // İlk touch'ta grid pozisyonunu ölç (eğer henüz ölçülmediyse)
        if (gridPositionRef.current.x === 0 && gridPositionRef.current.y === 0) {
          gridContainerRef.current?.measureInWindow((x, y, width, height) => {
            gridPositionRef.current = { x, y, width, height };
            console.log(`📏 Grid pozisyonu (ilk touch): x=${Math.round(x)}, y=${Math.round(y)}`);
          });
        }
        
        // pageX/pageY kullan (ekranın mutlak koordinatları)
        const { pageX, pageY } = evt.nativeEvent;
        console.log(`🟢 BAŞLANGIÇ: touch=(${Math.round(pageX)}, ${Math.round(pageY)})`);
        const cell = getCellFromTouch(pageX, pageY);
        console.log(`   → Hücre: ${cell ? `(${cell.row}, ${cell.col})` : 'null'}`);
        if (cell) {
          handleCellPress(cell.row, cell.col);
        }
      },
      
      onPanResponderMove: (evt) => {
        // Her hareket sırasında güncelle
        const { pageX, pageY } = evt.nativeEvent;
        const cell = getCellFromTouch(pageX, pageY);
        if (cell) {
          console.log(`🔵 HAREKET: touch=(${Math.round(pageX)}, ${Math.round(pageY)}) → Hücre: (${cell.row}, ${cell.col})`);
          // isSelecting kontrolü handleCellMove'da yapılıyor
          handleCellMove(cell.row, cell.col);
        }
      },
      
      onPanResponderRelease: () => {
        handleCellRelease();
      },
      
      // ScrollView'ın scroll yapmasını engelle
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
    })
  ).current;

  // Puzzle'ı oluştur
  useEffect(() => {
    console.log(`🔧 PUZZLE OLUŞTURULUYOR (useEffect çalıştı!): unit=${!!unit}, words.length=${unit?.words.length}`);
    
    if (unit && unit.words.length >= 6) {
      console.log(`✅ PUZZLE OLUŞTURULUYOR: ${unit.words.length} kelime ile`);
      const newPuzzle = generateWordSearch(unit.words, 6, 8);
      console.log(`🎯 PUZZLE OLUŞTURULDU:`, newPuzzle);
      setPuzzle(newPuzzle);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      console.log(`❌ PUZZLE OLUŞTURULAMADI: unit=${!!unit}, words.length=${unit?.words.length}`);
    }
  }, [unit]); // unit kullan, unitId ile çalışmıyor

  if (!unit) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ünite bulunamadı</Text>
      </View>
    );
  }

  if (unit.words.length < 6) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Kelime avı için en az 6 kelime gerekli</Text>
      </View>
    );
  }

  if (!puzzle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Oyun hazırlanıyor...</Text>
      </View>
    );
  }

  // Hücre seçili mi?
  const isCellSelected = (row: number, col: number): boolean => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  // Hücre bulunan bir kelimeye ait mi?
  const isCellFound = (row: number, col: number): boolean => {
    return foundWordCells.has(`${row}-${col}`);
  };

  // Yeni oyun
  const handleNewGame = () => {
    const newPuzzle = generateWordSearch(unit.words, 6, 8);
    setPuzzle(newPuzzle);
    setFoundWords(new Set());
    setFoundWordCells(new Set());
    selectedCellsRef.current = [];
    setSelectedCells([]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔍 {foundWords.size}/{puzzle.words.length}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={[styles.gameContainer, { opacity: fadeAnim }]}>
          {/* Üst Taraf - Kelime Matrisi */}
          <View 
            style={styles.gridContainer}
            ref={gridContainerRef}
            onLayout={(event) => {
              // Layout event'inden direk pozisyon al
              const layout = event.nativeEvent.layout;
              console.log(`📏 Grid layout: x=${Math.round(layout.x)}, y=${Math.round(layout.y)}`);
              
              // MeasureInWindow ile ekrandaki gerçek pozisyonu al
              setTimeout(() => {
                gridContainerRef.current?.measureInWindow((x, y, width, height) => {
                  gridPositionRef.current = { x, y, width, height };
                  console.log(`📏 Grid pozisyonu (window): x=${Math.round(x)}, y=${Math.round(y)}, w=${Math.round(width)}, h=${Math.round(height)}`);
                });
              }, 100);
            }}
            {...panResponder.panHandlers}
          >
            {puzzle.grid.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.gridRow}>
                {row.map((letter, colIndex) => {
                  const isSelected = isCellSelected(rowIndex, colIndex);
                  const isFound = isCellFound(rowIndex, colIndex);
                  
                  // Debug: İlk render'da bulunan hücreleri kontrol et
                  if (rowIndex === 0 && colIndex === 0) {
                    console.log(`🔍 Grid Debug - FoundWordCells:`, Array.from(foundWordCells));
                    console.log(`🔍 Grid Debug - FoundWords:`, Array.from(foundWords));
                  }

                  return (
                    <TouchableOpacity
                      key={`cell-${rowIndex}-${colIndex}`}
                      style={[
                        styles.gridCell,
                        isFound && styles.gridCellFound,
                        isSelected && styles.gridCellSelected,
                      ]}
                      onPressIn={() => {
                        console.log(`🟦 DOKUNMA: Hücre (${rowIndex}, ${colIndex})`);
                        if (!isSelectingRef.current) {
                          handleCellPress(rowIndex, colIndex);
                        } else {
                          handleCellMove(rowIndex, colIndex);
                        }
                      }}
                      activeOpacity={1}
                      delayPressIn={0}
                    >
                      <Text style={[
                        styles.gridCellText,
                        isSelected && styles.gridCellTextSelected
                      ]}>
                        {letter}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Alt Taraf - Kelime Listesi */}
          <View style={styles.wordListContainer}>
            <Text style={styles.wordListTitle}>Kelimeleri Bul:</Text>
            <View style={styles.compactWordList}>
              {puzzle.words.map((wordInfo, index) => {
                const isFound = foundWords.has(wordInfo.word);
                console.log(`📝 Kelime: ${wordInfo.word}, Bulundu: ${isFound}, FoundWords:`, Array.from(foundWords));
                return (
                  <View
                    key={`word-${index}`}
                    style={[
                      styles.wordItemBox,
                      isFound && styles.wordItemBoxFound
                    ]}
                  >
                    <Text
                      style={[
                        styles.compactWordText,
                        isFound && styles.compactWordFound
                      ]}
                    >
                      {wordInfo.word}
                      {isFound && ' ✓'}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Butonlar */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.newGameButton}
                onPress={handleNewGame}
                activeOpacity={0.8}
              >
                <Text style={styles.newGameButtonText}>🔄 Yeni Oyun</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Text style={styles.backButtonText}>← Geri Dön</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
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
  header: {
    paddingTop: 46,
    paddingBottom: 6,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 8,
    paddingBottom: 12,
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  // Grid Stilleri
  gridContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 8,
    alignSelf: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderWidth: 1.5,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 4,
  },
  gridCellSelected: {
    backgroundColor: '#FFC107',
    borderColor: '#FF9800',
  },
  gridCellFound: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  gridCellText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  gridCellTextSelected: {
    color: 'white',
  },
  // Kelime Listesi Stilleri
  wordListContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  wordListTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 8,
    textAlign: 'center',
  },
  compactWordList: {
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wordItemBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#90CAF9',
    width: '48%',
  },
  wordItemBoxFound: {
    backgroundColor: '#C8E6C9',
    borderColor: '#81C784',
  },
  compactWordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a5f',
    textAlign: 'center',
  },
  compactWordFound: {
    color: '#2E7D32',
    textDecorationLine: 'line-through',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newGameButton: {
    flex: 1,
    backgroundColor: '#00CC66',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  newGameButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 102, 204, 0.2)',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0066CC',
  },
  backButtonText: {
    color: '#0066CC',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default WordSearchScreen;

