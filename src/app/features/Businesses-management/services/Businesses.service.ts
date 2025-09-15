import { Injectable } from '@angular/core';
import {
  AlertService,
  BaseResponses,
  BaseService,
  HttpClientService,
} from '@coder-pioneers/shared';
import { RequestBusinesses } from '../contracts/requests/request-Businesses';
import { BusinesseResponse } from '../contracts/responses/Businesses-response';

@Injectable({
  providedIn: 'root',
})
export class BusinessesService extends BaseService<
  BusinesseResponse, // TListResponse
  RequestBusinesses, // TCreateRequest
  RequestBusinesses, // TUpdateRequest
  never, // TApproveRequest
  never, // TRejectRequest
  never, // TListDropboxResponse
  BusinesseResponse, // TListIdResponse
  BusinesseResponse, // TListByUserIdResponse
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
      controller: 'Businesses',
      defaultActions: {
        list: 'GetAllBusinesses',
        listId: 'GetByIdBusinesses',
        listByUserId: 'GetByUserIdBusinesses',
        insert: 'CreateBusinesses',
        update: 'UpdateBusinesses',
      },
    });
  }
}
