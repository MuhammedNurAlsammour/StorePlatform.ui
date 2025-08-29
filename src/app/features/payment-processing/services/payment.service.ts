import { Injectable } from '@angular/core';
import { AlertService, BaseResponses, BaseService, HttpClientService } from '@coder-pioneers/shared';
import { PaymentResponse } from '../contracts/responses/payment-response';
import { RequestPayment } from '../contracts/requests/request-payment';


@Injectable({
  providedIn: 'root'
})
export class PaymentService extends BaseService<
  PaymentResponse,      // TListResponse
  RequestPayment,       // TCreateRequest
  RequestPayment,       // TUpdateRequest
  never,                        // TApproveRequest
  never,                        // TRejectRequest
  never,                        // TListDropboxResponse
  PaymentResponse,      // TListIdResponse
  PaymentResponse,      // TListByUserIdResponse
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
      controller: 'Payments',
      defaultActions: {
        list: 'GetAllPayments',
        listId: 'GetByIdPayments',
        listByUserId: 'GetByUserIdPayments',
        insert: 'CreatePayments',
        update: 'UpdatePayments',
      },
    });
  }
}









