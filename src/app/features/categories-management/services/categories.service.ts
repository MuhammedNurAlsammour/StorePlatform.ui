import { Injectable } from '@angular/core';
import {
  AlertService,
  BaseResponses,
  BaseService,
  HttpClientService,
} from '@coder-pioneers/shared';
import { RequestCategory } from '../contracts/requests/request-categories';
import { CategoriesResponse } from '../contracts/responses/categories-response';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends BaseService<
  CategoriesResponse, // TListResponse
  RequestCategory, // TCreateRequest
  RequestCategory, // TUpdateRequest
  never, // TApproveRequest
  never, // TRejectRequest
  never, // TListDropboxResponse
  CategoriesResponse, // TListIdResponse
  CategoriesResponse, // TListByUserIdResponse
  never, // TListResponseFilter
  never, // TPostRequest1
  never, // TPostRequest2
  never, // TPutRequest1
  never, // TPutRequest2
  never, // TPutRequest3
  BaseResponses // TAllResponse
> {
  constructor(
    httpClientService: HttpClientService,
    alertService: AlertService
  ) {
    super(httpClientService, alertService, {
      controller: 'categories',
      defaultActions: {
        list: 'GetAllcategories',
        listId: 'GetByIdcategories',
        listByUserId: 'GetByUserIdcategories',
        insert: 'Createcategories',
        update: 'Updatecategories',
      },
    });
  }
}

