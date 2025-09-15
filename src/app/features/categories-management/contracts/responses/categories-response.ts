import {
  ApiResponse,
  BaseResponse,
} from '@contracts/interfaces/responses/base-response';

// CategoriesResponse için ApiResponse kullanıyoruz
export type CategoriesResponse = ApiResponse<CategoriesResponseData>;

// Kategori listesi için data interface
export interface CategoriesResponseData {
  totalCount: number;
  categories: ResultCategory[];
  statusCode: number;
  message: null;
  timestamp: Date;
}

// CategoryResult BaseResponse'tan extend ediyor
export interface ResultCategory extends BaseResponse {
  name: string;
  description: string;
  parentId: string;
  parentName: string;
  icon: string;
  sortOrder: number;
  childrenCount: number;
  fullPath: string;
  children: any[];
}

