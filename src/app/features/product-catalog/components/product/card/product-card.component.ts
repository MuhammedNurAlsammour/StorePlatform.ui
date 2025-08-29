import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductResult } from '@features/product-catalog/contracts/responses/product-response';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: ProductResult;
  @Input() showActions: boolean = true;

  @Output() edit = new EventEmitter<ProductResult>();
  @Output() addToCart = new EventEmitter<ProductResult>();
  @Output() uploadPhoto = new EventEmitter<ProductResult>();
  @Output() delete = new EventEmitter<ProductResult>();
  @Output() cardClick = new EventEmitter<ProductResult>();

  /**
   * Ürün fotoğrafı URL'sini alır
   * @param product Ürün verisi
   * @returns Fotoğraf URL'si
   */
  getProductImageUrl(product: ProductResult): string {
    if (product.productPhoto) {
      if (product.productPhoto.startsWith('data:image')) {
        return product.productPhoto;
      }
      return `data:image/png;base64,${product.productPhoto}`;
    }

    // Varsayılan ürün resmi
    return 'assets/images/default-product.png';
  }

  /**
   * Ürün fiyatını formatlar
   * @param price Fiyat
   * @returns Formatlanmış fiyat
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  }

  /**
   * Stok durumunu kontrol eder
   * @param stock Stok miktarı
   * @returns Stok durumu
   */
  getStockStatus(stock: number): {
    text: string;
    color: string;
    class: string;
  } {
    if (stock > 10) {
      return { text: 'Stokta', color: 'green', class: 'stock-available' };
    } else if (stock > 0) {
      return { text: 'Az Stok', color: 'orange', class: 'stock-low' };
    } else {
      return { text: 'Stok Yok', color: 'red', class: 'stock-out' };
    }
  }

  /**
   * Ürün aktiflik durumunu kontrol eder
   * @param isActive Aktiflik durumu
   * @returns Durum bilgisi
   */
  getActiveStatus(isActive: boolean): {
    text: string;
    color: string;
    class: string;
  } {
    return isActive
      ? { text: 'Aktif', color: 'green', class: 'status-active' }
      : { text: 'Pasif', color: 'red', class: 'status-inactive' };
  }

  /**
   * Kart tıklama olayı
   * @param product Ürün verisi
   */
  onCardClick(product: ProductResult): void {
    this.cardClick.emit(product);
  }

  /**
   * Düzenleme butonu tıklama olayı
   * @param product Ürün verisi
   */
  onEdit(product: ProductResult): void {
    this.edit.emit(product);
  }

  /**
   * Sepete ekleme butonu tıklama olayı
   * @param product Ürün verisi
   */
  onAddToCart(product: ProductResult): void {
    this.addToCart.emit(product);
  }

  /**
   * Fotoğraf yükleme butonu tıklama olayı
   * @param product Ürün verisi
   */
  onUploadPhoto(product: ProductResult): void {
    this.uploadPhoto.emit(product);
  }

  /**
   * Silme butonu tıklama olayı
   * @param product Ürün verisi
   */
  onDelete(product: ProductResult): void {
    this.delete.emit(product);
  }
}
