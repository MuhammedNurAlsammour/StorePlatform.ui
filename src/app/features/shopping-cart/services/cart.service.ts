import { Injectable } from '@angular/core';
import { AlertService, BaseResponses, BaseService, HttpClientService } from '@coder-pioneers/shared';
import { CartResponse } from '../contracts/responses/cart-response';
import { RequestCart } from '../contracts/requests/request-cart';


@Injectable({
  providedIn: 'root'
})
export class CartService extends BaseService<
  CartResponse,                 // TListResponse
  RequestCart,                  // TCreateRequest
  RequestCart,                  // TUpdateRequest
  never,                        // TApproveRequest
  never,                        // TRejectRequest
  never,                        // TListDropboxResponse
  CartResponse,                 // TListIdResponse
  CartResponse,                 // TListByUserIdResponse
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
      controller: 'Cart',
      defaultActions: {
        list: 'GetAllCart',
        listId: 'GetByIdCart',
        listByUserId: 'GetByUserIdCart',
        insert: 'CreateCart',
        update: 'UpdateCart',
      },
    });
  }
}












