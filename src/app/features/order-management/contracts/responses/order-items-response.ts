import {
  ApiResponse,
  BaseResponse,
} from '@contracts/interfaces/responses/base-response';

// OrderItemsResponse için ApiResponse kullanıyoruz
export type OrderItemsResponse = ApiResponse<OrderItemsResponseData>;

// Sipariş listesi için data interface
export interface OrderItemsResponseData {
  totalCount: number;
  orderItems: ResultOrderItems[];
}

// OrderItemsResult BaseResponse'tan extend ediyor
export interface ResultOrderItems extends BaseResponse {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  rowActiveAndNotDeleted: boolean;
  rowIsNotDeleted: boolean;
}





