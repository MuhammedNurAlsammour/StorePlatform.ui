import { Injectable } from '@angular/core';
import { AlertService, BaseResponses, BaseService, HttpClientService } from '@coder-pioneers/shared';
import { ProductUploadPhotoResponse } from '../contracts/responses/product-upload-photo-response';
import { RequestProductUploadPhoto } from '../contracts/requests/request-product-upload-photo';
import { ProductResponse } from '../contracts/responses/product-response';


@Injectable({
  providedIn: 'root'
})
export class ProductUploadPhotoService extends BaseService<
never,      // TListResponse
RequestProductUploadPhoto,       // TCreateRequest
RequestProductUploadPhoto,       // TUpdateRequest
never,                // TApproveRequest
never,                // TRejectRequest
never,                // TListDropboxResponse
never,      // TListIdResponse
never,      // TListByUserIdResponse
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
      insert: 'UploadProductPhoto',
      update: 'UpdateProduct',
    },
  });
}
}



