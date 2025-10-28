// Kelime Avı Oyunu - Kelime matrisi oluşturur

import { Word } from '../types';

export interface WordSearchPuzzle {
  grid: string[][]; // Harf matrisi
  words: Array<{
    word: string;
    turkish: string;
    startRow: number;
    startCol: number;
    direction: 'horizontal' | 'vertical' | 'diagonal';
    found: boolean;
  }>;
  gridSize: number;
}

// Rastgele harf üret
const getRandomLetter = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * letters.length)];
};

// Kelimenin grid'e sığıp sığmadığını kontrol et
const canPlaceWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: 'horizontal' | 'vertical' | 'diagonal'
): boolean => {
  const gridSize = grid.length;
  
  for (let i = 0; i < word.length; i++) {
    let newRow = row;
    let newCol = col;
    
    if (direction === 'horizontal') {
      newCol = col + i;
    } else if (direction === 'vertical') {
      newRow = row + i;
    } else { // diagonal
      newRow = row + i;
      newCol = col + i;
    }
    
    // Grid sınırlarını kontrol et
    if (newRow >= gridSize || newCol >= gridSize || newRow < 0 || newCol < 0) {
      return false;
    }
    
    // Boş değilse ve aynı harf değilse
    if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
      return false;
    }
  }
  
  return true;
};

// Kelimeyi grid'e yerleştir
const placeWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: 'horizontal' | 'vertical' | 'diagonal'
): void => {
  for (let i = 0; i < word.length; i++) {
    if (direction === 'horizontal') {
      grid[row][col + i] = word[i];
    } else if (direction === 'vertical') {
      grid[row + i][col] = word[i];
    } else { // diagonal
      grid[row + i][col + i] = word[i];
    }
  }
};

/**
 * Kelime avı oyunu oluşturur
 * @param words - Kelime listesi
 * @param wordCount - Kaç kelime kullanılacak (varsayılan: 6)
 * @param gridSize - Grid boyutu (varsayılan: 8)
 */
export const generateWordSearch = (
  words: Word[],
  wordCount: number = 6,
  gridSize: number = 8
): WordSearchPuzzle => {
  console.log(`🔧 GENERATEWORDSEARCH BAŞLADI: ${words.length} kelime, wordCount=${wordCount}, gridSize=${gridSize}`);
  
  // 2 harfli kelimeleri filtrele
  const filteredWords = words.filter(w => w.english.replace(/\s/g, '').length > 2);
  console.log(`🔧 FİLTRELENMİŞ KELİMELER: ${filteredWords.length} kelime`);
  
  // Daha fazla kelime seç (yerleşmeyenlere karşın)
  const candidateCount = Math.min(filteredWords.length, wordCount * 2);
  
  // Rastgele kelimeler seç
  const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
  const candidateWords = shuffled.slice(0, candidateCount);
  
  // Boş grid oluştur
  const grid: string[][] = Array(gridSize).fill(null).map(() => 
    Array(gridSize).fill('')
  );
  
  const placedWords: WordSearchPuzzle['words'] = [];
  // Sadece yatay ve dikey - çapraz yok
  const directions: Array<'horizontal' | 'vertical' | 'diagonal'> = 
    ['horizontal', 'vertical'];
  
  // Her kelimeyi yerleştirmeyi dene (tam 6 kelime yerleşene kadar devam et)
  for (const wordObj of candidateWords) {
    // Zaten 6 kelime yerleştirdiyse dur
    if (placedWords.length >= wordCount) {
      break;
    }
    
    const word = wordObj.english.toUpperCase().replace(/\s/g, ''); // Boşlukları kaldır
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (!placed && attempts < maxAttempts) {
      attempts++;
      
      // Rastgele pozisyon ve yön seç
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      // Yerleştirmeyi dene
      if (canPlaceWord(grid, word, row, col, direction)) {
        placeWord(grid, word, row, col, direction);
        placedWords.push({
          word: wordObj.english,
          turkish: wordObj.turkish,
          startRow: row,
          startCol: col,
          direction,
          found: false,
        });
        placed = true;
      }
    }
  }
  
  // Boş hücreleri rastgele harflerle doldur
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = getRandomLetter();
      }
    }
  }
  
  const result = {
    grid,
    words: placedWords,
    gridSize,
  };
  
  console.log(`🎯 GENERATEWORDSEARCH TAMAMLANDI: ${placedWords.length} kelime yerleştirildi`);
  console.log(`🎯 YERLEŞTİRİLEN KELİMELER:`, placedWords.map(w => w.word));
  
  return result;
};

/**
 * Seçilen hücrelerin bir kelime oluşturup oluşturmadığını kontrol et
 */
export const checkWord = (
  puzzle: WordSearchPuzzle,
  selectedCells: Array<{ row: number; col: number }>
): string | null => {
  if (selectedCells.length < 2) return null;
  
  // Seçilen harfleri birleştir
  const selectedWord = selectedCells
    .map(cell => puzzle.grid[cell.row][cell.col])
    .join('');
  
  console.log(`🔍 CHECKWORD DEBUG:`);
  console.log(`   Seçilen hücreler:`, selectedCells);
  console.log(`   Seçilen kelime: "${selectedWord}"`);
  console.log(`   Puzzle'daki kelimeler:`, puzzle.words.map(w => w.word));
  
  // Puzzle'daki kelimelerle karşılaştır
  for (const wordInfo of puzzle.words) {
    const word = wordInfo.word.toUpperCase().replace(/\s/g, '');
    const reversedWord = word.split('').reverse().join('');
    
    console.log(`   Kontrol: "${selectedWord}" === "${word}" veya "${reversedWord}" ?`);
    
    // İleri veya geri eşleşme kontrolü
    if (selectedWord === word || selectedWord === reversedWord) {
      console.log(`   ✅ EŞLEŞME BULUNDU: ${wordInfo.word}`);
      return wordInfo.word;
    }
  }
  
  console.log(`   ❌ EŞLEŞME BULUNAMADI`);
  return null;
};

