import {
  ApiResponse,
  BaseResponse,
} from '@contracts/interfaces/responses/base-response';

// BusinesseResponse için ApiResponse kullanıyoruz
export type BusinesseResponse = ApiResponse<BusinesseResponseData>;

// businesses listesi için data interface
export interface BusinesseResponseData {
  totalCount: number;
  businesses: ResultBusinesse[];
  statusCode: number;
  message: null;
  timestamp: Date;
}

// BusinesseResult BaseResponse'tan extend ediyor
export interface ResultBusinesse extends BaseResponse {
  name: string;
  description: string;
  subDescription: string;
  categoryId: string;
  subCategoryId: string;
  provinceId: string;
  countriesId: string;
  districtId: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  facebookUrl: string;
  instagramUrl: string;
  whatsApp: string;
  telegram: string;
  primaryContactType1: number;
  primaryContactValue1: string;
  primaryContactType2: number;
  primaryContactValue2: string;
  rating: number;
  totalReviews: number;
  viewCount: number;
  subscriptionType: number;
  isVerified: boolean;
  isFeatured: boolean;
  workingHours: string;
  icon: string;
  ownerId: string;
  mainPhoto: string;
  bannerPhotos: string[];
  createUserId: string;
  createUserName: string;
  updateUserId: string;
  updateUserName: string;
  // BaseResponse'dan gelen alanlar
  institutionId: string;
  customerId: string;
}
