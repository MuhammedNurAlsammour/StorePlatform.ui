# StorePlatform Theme System

Bu dosya, StorePlatform projesinin gelişmiş tema sistemini açıklar.

## 📁 Dosya Yapısı

```
themes/
├── _variables.scss      # Ana değişkenler
├── _functions.scss      # Yardımcı fonksiyonlar
├── _mixins.scss        # SCSS mixin'leri
├── _palettes.scss      # Material Design paletleri
├── _custom.scss        # Projeye özel stiller
├── theme.scss          # Ana tema dosyası
├── theme-dark.scss     # Karanlık tema
├── custom-dark.scss    # Karanlık tema özel stiller
├── index.scss          # Tüm dosyaları import eden index
└── README.md          # Bu dosya
```

## 🎨 Renk Sistemi

### Ana Renkler
- `$color-primary`: #008be7 (Ana renk)
- `$color-accent`: #008be7 (Vurgu rengi)
- `$color-def`: #ffffff (Varsayılan arka plan)

### Durum Renkleri
- `$color-success`: #28a745 (Başarı)
- `$color-warning`: #ffc107 (Uyarı)
- `$color-error`: #dc3545 (Hata)
- `$color-info`: #17a2b8 (Bilgi)

### Gri Tonları
- `$color-gray-50` ile `$color-gray-900` arası

## 📏 Spacing Sistemi

```scss
$spacing-xs: 0.25rem;   // 4px
$spacing-sm: 0.5rem;    // 8px
$spacing-md: 1rem;      // 16px
$spacing-lg: 1.5rem;    // 24px
$spacing-xl: 2rem;      // 32px
$spacing-xxl: 3rem;     // 48px
```

## 🔤 Tipografi

### Font Aileleri
- `$font-family-base`: 'Roboto', sans-serif
- `$font-family-heading`: 'Roboto', sans-serif

### Font Boyutları
- `$font-size-base`: 1rem (16px)
- `$font-size-sm`: 0.875rem (14px)
- `$font-size-lg`: 1.125rem (18px)
- `$font-size-xl`: 1.25rem (20px)

## 🎯 Kullanım Örnekleri

### Renk Kullanımı
```scss
.my-component {
  color: $color-primary;
  background-color: $color-gray-50;
}
```

### Spacing Kullanımı
```scss
.my-component {
  padding: $spacing-md;
  margin-bottom: $spacing-lg;
}
```

### Mixin Kullanımı
```scss
.my-card {
  @include card-style();
}

.my-button {
  @include button-style($color-primary, white);
}

.my-input {
  @include input-style();
}
```

### Responsive Kullanımı
```scss
.my-component {
  @include mobile {
    padding: $spacing-sm;
  }
  
  @include desktop {
    padding: $spacing-lg;
  }
}
```

### Fonksiyon Kullanımı
```scss
.my-component {
  font-size: font-size('lg');
  line-height: line-height('relaxed');
  box-shadow: create-shadow('md', $color-primary);
}
```

## 🎨 Utility Sınıfları

### Spacing Utilities
- `.m-0` ile `.m-5` (margin)
- `.p-0` ile `.p-5` (padding)

### Renk Utilities
- `.text-primary`, `.text-accent`, vb.
- `.bg-primary`, `.bg-accent`, vb.

### Display Utilities
- `.d-none`, `.d-block`, `.d-flex`, vb.

### Flex Utilities
- `.justify-center`, `.justify-between`, vb.
- `.align-center`, `.align-start`, vb.

### Border Radius
- `.rounded-sm`, `.rounded-md`, `.rounded-lg`, vb.

### Shadows
- `.shadow-sm`, `.shadow-md`, `.shadow-lg`, vb.

## 🎭 Animasyon Sınıfları

- `.fade-in`: Fade in animasyonu
- `.slide-in-up`: Yukarıdan kayma
- `.slide-in-down`: Aşağıdan kayma
- `.slide-in-left`: Soldan kayma
- `.slide-in-right`: Sağdan kayma
- `.bounce-in`: Zıplama animasyonu
- `.scale-in`: Ölçeklendirme animasyonu

## 📱 Responsive Utilities

- `.d-mobile-none`, `.d-mobile-block`, `.d-mobile-flex`
- `.d-tablet-none`, `.d-tablet-block`, `.d-tablet-flex`
- `.d-desktop-none`, `.d-desktop-block`, `.d-desktop-flex`

## 🌙 Karanlık Tema

Karanlık tema için `theme-dark.scss` ve `custom-dark.scss` dosyalarını kullanın:

```scss
// Karanlık tema uygulama
body.dark-theme {
  // Karanlık tema stilleri
}
```

## 🎨 Özel Bileşenler

### Custom Card
```scss
.custom-card {
  // Özel kart stili
}
```

### Custom Button
```scss
.custom-button {
  // Özel buton stili
}
```

### Custom Input
```scss
.custom-input {
  // Özel input stili
}
```

### Custom Grid
```scss
.custom-grid.grid-2 {
  // 2 sütunlu grid
}

.custom-grid.grid-3 {
  // 3 sütunlu grid
}

.custom-grid.grid-4 {
  // 4 sütunlu grid
}
```

## 🔧 Fonksiyonlar

### Renk Fonksiyonları
- `adjust-color-tone($color, $amount)`: Renk tonunu ayarlar
- `get-contrast-color($color)`: Kontrast rengini hesaplar
- `create-color-palette($base-color)`: Renk paleti oluşturur

### Spacing Fonksiyonları
- `spacing($multiplier)`: Boşluk hesaplar
- `responsive-spacing($mobile, $tablet, $desktop)`: Responsive boşluk

### Typography Fonksiyonları
- `font-size($level)`: Font boyutu alır
- `line-height($level)`: Line height alır

### Shadow Fonksiyonları
- `create-shadow($level, $color)`: Gölge oluşturur

### Border Radius Fonksiyonları
- `border-radius($level)`: Border radius alır

### Transition Fonksiyonları
- `transition-duration($level)`: Geçiş süresi alır
- `transition-timing($type)`: Geçiş timing'i alır

## 📋 Best Practices

1. **Değişken Kullanımı**: Her zaman değişkenleri kullanın, hard-coded değerler yazmayın
2. **Mixin Kullanımı**: Tekrar eden stiller için mixin'ler kullanın
3. **Fonksiyon Kullanımı**: Hesaplamalar için fonksiyonları kullanın
4. **Responsive Tasarım**: Mobile-first yaklaşımını benimseyin
5. **Semantic Naming**: Anlamlı isimler kullanın
6. **Modular Structure**: Dosyaları modüler yapıda organize edin
7. **Accessibility**: Erişilebilirlik standartlarına uyun
8. **Performance**: Gereksiz CSS'den kaçının

## 🚀 Geliştirme

### Yeni Renk Ekleme
1. `_variables.scss` dosyasına renk değişkenini ekleyin
2. `_palettes.scss` dosyasına palet oluşturun
3. `theme.scss` dosyasında kullanın

### Yeni Mixin Ekleme
1. `_mixins.scss` dosyasına mixin'i ekleyin
2. Gerekirse `_functions.scss` dosyasına yardımcı fonksiyonlar ekleyin
3. `theme.scss` dosyasında kullanın

### Yeni Fonksiyon Ekleme
1. `_functions.scss` dosyasına fonksiyonu ekleyin
2. Gerekirse `_variables.scss` dosyasına değişkenler ekleyin
3. `theme.scss` dosyasında kullanın

### Yeni Utility Sınıfı Ekleme
1. `theme.scss` dosyasına utility sınıfını ekleyin
2. Responsive versiyonlarını da ekleyin
3. Dokümantasyonu güncelleyin

### Yeni Özel Bileşen Ekleme
1. `_custom.scss` dosyasına bileşeni ekleyin
2. Karanlık tema versiyonunu `custom-dark.scss` dosyasına ekleyin
3. Dokümantasyonu güncelleyin

## 📚 Kaynaklar

- [Angular Material Theming](https://material.angular.io/guide/theming)
- [Sass Documentation](https://sass-lang.com/documentation)
- [Material Design Guidelines](https://material.io/design)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [CSS Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)

## 🔄 Güncelleme Geçmişi

### v2.0.0 - Yeni Tema Sistemi
- Modüler dosya yapısı
- Gelişmiş fonksiyonlar
- Özel bileşenler
- Karanlık tema desteği
- Responsive utilities
- Animasyon sınıfları
- Accessibility desteği
- Print stilleri 