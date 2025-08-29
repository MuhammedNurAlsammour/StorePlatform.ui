import { Injectable } from '@angular/core';
import { BaseService } from '@coder-pioneers/shared';
import { HttpClientService } from '@coder-pioneers/shared';
import { BaseResponses } from '@coder-pioneers/shared';
import { AlertService } from '@coder-pioneers/shared';
import { RequestTypeOfResignation } from '../contracts/requests/request-type-of-resignation';
import { TypeOfResignationResponse } from '../contracts/responses/type-of-resignation-response';

@Injectable({
  providedIn: 'root'
})
export class TypeOfResignationService extends BaseService<
  TypeOfResignationResponse,
  RequestTypeOfResignation,
  RequestTypeOfResignation,
  BaseResponses> {
  constructor(
    httpClientService: HttpClientService,
    alertService: AlertService
  )
  {
    super(
      httpClientService,
      alertService,
    {
      controller: 'TypeOfResignation',
      defaultActions: {
        list: 'GetResignationTypeList',
        insert: 'InsertResignationType',
        update: 'UpdateResignationType',
      },
    });
  }
}




















