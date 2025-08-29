import { Injectable } from '@angular/core';
import { AlertService, BaseResponses, BaseService, HttpClientService } from '@coder-pioneers/shared';
import { OrderItemsResponse } from '../contracts/responses/order-items-response';
import { RequestOrderItems } from '../contracts/requests/request-order-items';
import { RequestOrders } from '../contracts/requests/request-orders';


@Injectable({
  providedIn: 'root'
})
export class OrderItemsService extends BaseService<
  OrderItemsResponse,      // TListResponse
  RequestOrderItems,       // TCreateRequest
  RequestOrderItems,       // TUpdateRequest
  never,                        // TApproveRequest
  never,                        // TRejectRequest
  never,                        // TListDropboxResponse
  OrderItemsResponse,      // TListIdResponse
  OrderItemsResponse,      // TListByUserIdResponse
  RequestOrders,                        // TListResponseFilter
  never,                        // TPostRequest1
  never,                        // TPostRequest2
  never,                        // TPutRequest1
  never,                        // TPutRequest2
  never,                        // TPutRequest3
  BaseResponses                 // TAllResponse
> {
  constructor(
    httpClientService: HttpClientService,
    alertService: AlertService
  )
  {
    super(
      httpClientService,
      alertService,
    {
      controller: 'OrderItems',
      defaultActions: {
        list: 'GetAllOrderItems',
        listId: 'GetByIdOrderItems',
        listByUserId: 'GetByUserIdOrderItems',
        insert: 'CreateOrderItems',
        update: 'UpdateOrderItems',
      },
    });
  }
}






