/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind'in tarayacağı dosya yolları - nerede className kullanıyorsak orayı ekleriz
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")], // NativeWind preset'i ekledik
  theme: {
    extend: {
      // Özel renkler ekleyebiliriz (proje temanız için)
      colors: {
        primary: '#0066CC', // Ana mavi renk
        secondary: '#00CC66', // Yeşil renk (progress için)
        danger: '#CC0000', // Kırmızı (hatalar için)
      },
    },
  },
  plugins: [],
}

