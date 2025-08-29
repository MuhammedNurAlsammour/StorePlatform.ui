import { Injectable } from '@angular/core';
import { BaseService } from '@coder-pioneers/shared';
import { HttpClientService } from '@coder-pioneers/shared';
import { BaseResponses } from '@coder-pioneers/shared';
import { AlertService } from '@coder-pioneers/shared';
import { RequestTicketPayment } from '../contracts/requests/request-ticket-payment';
import { TicketPaymentResponse } from '../contracts/responses/ticket-payment-response';

@Injectable({
  providedIn: 'root'
})
export class TicketPaymentService extends BaseService<
  TicketPaymentResponse,
  RequestTicketPayment,
  RequestTicketPayment,
  BaseResponses> {
  constructor(
    httpClientService: HttpClientService,
    alertService: AlertService
  ) {
    super(httpClientService, alertService, {
      controller: 'TicketPayment',
      defaultActions: {
        list: 'GetTicketPaymentLists',
        insert: 'InsertTicketPayment',
        update: 'UpdateTicketPayment',
      },
    });
  }
}




















