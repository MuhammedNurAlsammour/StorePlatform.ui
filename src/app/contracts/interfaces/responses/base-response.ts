// Audit bilgilerini tutan interface
export interface AuditFields {
  rowCreatedDate: Date;
  rowUpdatedDate: Date;
  rowIsActive: boolean;
  rowIsDeleted: boolean;
}

// Kullanıcı kimlik bilgilerini tutan interface
export interface UserIdentity {
  authUserId: string;
  authUserName: string;
  authCustomerId: string;
  authCustomerName: string;
}

// Temel response interface - daha modüler ve extend edilebilir
export interface BaseResponse extends AuditFields, UserIdentity {
  id: string;
}

// API işlem sonucu için standart interface
export interface OperationResult {
  referenceId: number;
  messageTitle: string;
  messageContent: string;
  messageDetail?: string;
  result: number;
  isSuccess?: boolean;
}

// Generic API response wrapper
export interface ApiResponse<T = any> {
  result?: T;
  operationResult: OperationResult;
  refId?: number | null;
  operationStatus: boolean;
  statusCode: number;
  timestamp?: Date;
}

// Sayfalama bilgileri için interface
export interface PaginationInfo {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Sayfalama için generic interface
export interface PaginatedResponse<T> extends Omit<ApiResponse<any>, 'result'> {
  result: {
    items: T[];
  } & PaginationInfo;
}

// Başarı durumları için enum
export enum ApiResultStatus {
  SUCCESS = 0,
  WARNING = 1,
  ERROR = 2,
  INFO = 3
}

// HTTP durum kodları için constants
export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const;

// Type guard fonksiyonları
export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return obj &&
         typeof obj === 'object' &&
         obj !== null &&
         'operationResult' in obj &&
         'operationStatus' in obj &&
         'statusCode' in obj;
}

export function isSuccessResponse<T>(response: ApiResponse<T>): boolean {
  return response.operationStatus &&
         response.statusCode >= 200 &&
         response.statusCode < 300 &&
         response.operationResult.result === ApiResultStatus.SUCCESS;
}

export function isPaginatedResponse<T>(obj: any): obj is PaginatedResponse<T> {
  if (!isApiResponse(obj) || !obj.result || typeof obj.result !== 'object' || obj.result === null) {
    return false;
  }

  const result = obj.result as Record<string, any>;
  return 'items' in result && 'totalCount' in result;
}

// Utility sınıfı
export class ResponseUtils {

  static createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
      result: data,
      operationResult: {
        referenceId: Date.now(),
        messageTitle: 'Başarılı',
        messageContent: message || 'İşlem başarıyla tamamlandı',
        result: ApiResultStatus.SUCCESS,
        isSuccess: true
      },
      operationStatus: true,
      statusCode: HTTP_STATUS_CODES.OK,
      timestamp: new Date()
    };
  }

  static createErrorResponse(
    message: string,
    statusCode: number = HTTP_STATUS_CODES.BAD_REQUEST
  ): ApiResponse<null> {
    return {
      result: null,
      operationResult: {
        referenceId: Date.now(),
        messageTitle: 'Hata',
        messageContent: message,
        result: ApiResultStatus.ERROR,
        isSuccess: false
      },
      operationStatus: false,
      statusCode,
      timestamp: new Date()
    };
  }

  static extractErrorMessage(response: ApiResponse<any>): string {
    if (response.operationResult?.messageContent) {
      return response.operationResult.messageContent;
    }
    return 'Bilinmeyen bir hata oluştu';
  }

  static isEmptyResult<T>(response: ApiResponse<T>): boolean {
    return !response.result ||
           (Array.isArray(response.result) && response.result.length === 0);
  }
}
