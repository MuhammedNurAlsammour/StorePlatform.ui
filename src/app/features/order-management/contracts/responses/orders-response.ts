import { ApiResponse, BaseResponse } from '@contracts/interfaces/responses/base-response';

// OrdersResponse için ApiResponse kullanıyoruz
export type OrdersResponse = ApiResponse<OrdersResponseData>;

// Sipariş listesi için data interface
export interface OrdersResponseData {
  totalCount: number;
  orders: ResultOrder[];
}

// ResultOrder BaseResponse'tan extend ediyor
export interface ResultOrder extends BaseResponse {
  orderId: string;
  cartId: string;
  orderDate: string;
  status: number;
  totalAmount: number;
}




