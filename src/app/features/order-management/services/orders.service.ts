import { Injectable } from '@angular/core';
import { AlertService, BaseResponses, BaseService, HttpClientService } from '@coder-pioneers/shared';
import { OrdersResponse } from '../contracts/responses/orders-response';
import { RequestOrders } from '../contracts/requests/request-orders';


@Injectable({
  providedIn: 'root'
})
export class OrdersService extends BaseService<
  OrdersResponse,      // TListResponse
  RequestOrders,       // TCreateRequest
  RequestOrders,       // TUpdateRequest
  never,                        // TApproveRequest
  never,                        // TRejectRequest
  never,                        // TListDropboxResponse
  OrdersResponse,      // TListIdResponse
  OrdersResponse,      // TListByUserIdResponse
  never,                        // TListResponseFilter
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
      controller: 'Orders',
      defaultActions: {
        list: 'GetAllOrders',
        listId: 'GetByIdOrders',
        listByUserId: 'GetByUserIdOrders',
        insert: 'CreateOrders',
        update: 'UpdateOrders',
      },
    });
  }
}








