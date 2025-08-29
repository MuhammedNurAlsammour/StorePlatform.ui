import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductResult } from '@features/product-catalog/contracts/responses/product-response';
import { ProductCardComponent } from './product-card.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-card-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    ProductCardComponent,
    MatIconModule
  ],
  templateUrl: './product-card-grid.component.html',
  styleUrl: './product-card-grid.component.scss',
})
export class ProductCardGridComponent {
  @Input() products: ProductResult[] = [];
  @Input() isLoading: boolean = false;
  @Input() totalRows: number = 0;
  @Input() pageSize: number = 12;
  @Input() pageIndex: number = 0;
  @Input() showActions: boolean = true;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() edit = new EventEmitter<ProductResult>();
  @Output() addToCart = new EventEmitter<ProductResult>();
  @Output() uploadPhoto = new EventEmitter<ProductResult>();
  @Output() delete = new EventEmitter<ProductResult>();
  @Output() cardClick = new EventEmitter<ProductResult>();

  /**
   * Sayfa değişikliği olayı
   * @param event Sayfa olayı
   */
  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  /**
   * Düzenleme olayı
   * @param product Ürün verisi
   */
  onEdit(product: ProductResult): void {
    this.edit.emit(product);
  }

  /**
   * Sepete ekleme olayı
   * @param product Ürün verisi
   */
  onAddToCart(product: ProductResult): void {
    this.addToCart.emit(product);
  }

  /**
   * Fotoğraf yükleme olayı
   * @param product Ürün verisi
   */
  onUploadPhoto(product: ProductResult): void {
    this.uploadPhoto.emit(product);
  }

  /**
   * Silme olayı
   * @param product Ürün verisi
   */
  onDelete(product: ProductResult): void {
    this.delete.emit(product);
  }

  /**
   * Kart tıklama olayı
   * @param product Ürün verisi
   */
  onCardClick(product: ProductResult): void {
    this.cardClick.emit(product);
  }

  /**
   * TrackBy function for ngFor optimization
   * @param index Index
   * @param product Product item
   * @returns Product ID
   */
  trackByProductId(index: number, product: ProductResult): string {
    return product.id;
  }
}
