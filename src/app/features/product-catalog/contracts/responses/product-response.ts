import { ApiResponse, BaseResponse } from '@contracts/interfaces/responses/base-response';

// Ürün response için ApiResponse kullanıyoruz
export type ProductResponse = ApiResponse<ProductResultData>;

// Ürün listesi için data interface
export interface ProductResultData {
  products: ProductResult[];
}

// ProductResult artık BaseResponse'tan extend ediyor
export interface ProductResult extends BaseResponse {
  id: string;
  // Ürün özel alanları
  productName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
  productCreatedDate: Date;
  productUpdatedDate: Date;
  productIsActive: boolean;
  productIsDeleted: boolean;
  productEmployeeId: string;
  productQrCode: string;
  productBarcode: string;
  productImageUrl: string;
  productPhoto: string;
  productThumbnail: string;
  productPhotoContentType: string;

  // Kategori bilgileri
  categoryId: string;
  categoryName: string;
  categoryDescription: string;

  // Müşteri bilgileri (nullable)
  customerId: null;
}






