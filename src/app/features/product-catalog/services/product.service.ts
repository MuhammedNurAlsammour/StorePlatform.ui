import { Injectable } from '@angular/core';
import { AlertService, BaseResponses, BaseService, HttpClientService } from '@coder-pioneers/shared';
import { RequestProduct } from '../contracts/requests/request-product';
import { ProductResponse } from '../contracts/responses/product-response';

@Injectable({
  providedIn: 'root'
})
// TListByUserIdResponse parametresi kullanılmıyor, bu yüzden 'never' olarak ayarlandı.
// Diğer parametreler de kullanılmıyor, hepsi 'never' olarak ayarlandı.
// Parametre sıralaması:
// <TListResponse, TCreateRequest, TUpdateRequest, TApproveRequest, TRejectRequest, TListDropboxResponse, TListIdResponse, TListByUserIdResponse, TListResponseFilter, TPostRequest1, TPostRequest2, TPutRequest1, TPutRequest2, TPutRequest3, TAllResponse>
export class ProductService extends BaseService<
  ProductResponse,      // TListResponse
  RequestProduct,       // TCreateRequest
  RequestProduct,       // TUpdateRequest
  never,                // TApproveRequest
  never,                // TRejectRequest
  never,                // TListDropboxResponse
  ProductResponse,      // TListIdResponse
  ProductResponse,      // TListByUserIdResponse
  never,                // TListResponseFilter
  never,                // TPostRequest1
  never,                // TPostRequest2
  never,                // TPutRequest1
  never,                // TPutRequest2
  never,                // TPutRequest3
  BaseResponses         // TAllResponse
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
      controller: 'Product',
      defaultActions: {
        list: 'GetAllProducts',
        listId: 'GetByIdProduct',
        listByUserId: 'GetByUserIdProduct',
        insert: 'CreateProduct',
        update: 'UpdateProduct',
      },
    });
  }
}


















