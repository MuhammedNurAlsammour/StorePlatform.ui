import { Injectable } from '@angular/core';
import { BaseService } from '@coder-pioneers/shared';
import { HttpClientService } from '@coder-pioneers/shared';
import { BaseResponses } from '@coder-pioneers/shared';
import { AlertService } from '@coder-pioneers/shared';
import { RequestInstitutionDefinitions } from '@features/definitions/contracts/requests/request-institution-definitions';
import { ListInstitutionDefinitionsRes } from '@features/definitions/contracts/responses/list-institution-definitions-respon';


@Injectable({
  providedIn: 'root'
})
export class InstitutionDefinitionsService extends BaseService<
  ListInstitutionDefinitionsRes,
  RequestInstitutionDefinitions,
  RequestInstitutionDefinitions,
  never,
  never,
  never,
  ListInstitutionDefinitionsRes,
  BaseResponses> {
  constructor(
    httpClientService: HttpClientService,
    alertService: AlertService
  ) {
    super(httpClientService, alertService, {
      controller: 'Institution',
      defaultActions: {
        list: 'GetInstitutionList',
        listId: 'GetInstitutionLowerList',
        insert: 'InsertInstitution',
        update: 'UpdateInstitutionById',
      },
    });
  }
}




















