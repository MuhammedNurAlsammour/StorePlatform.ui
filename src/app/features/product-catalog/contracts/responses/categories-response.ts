import { ApiResponse, BaseResponse } from '@contracts/interfaces/responses/base-response';

// CategoriesResponse için ApiResponse kullanıyoruz
export type CategoriesResponse = ApiResponse<CategoriesResponseData>;

// Kategori listesi için data interface
export interface CategoriesResponseData {
  totalCount: number;
  categories: CategoryResult[];
}

// CategoryResult BaseResponse'tan extend ediyor
export interface CategoryResult extends BaseResponse {
  id: string;
  name: string;
  description: string;
  createdDate: Date;
  updatedDate: Date;
}






