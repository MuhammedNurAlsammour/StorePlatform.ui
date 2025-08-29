import { Injectable } from '@angular/core';
import { BaseService } from '@coder-pioneers/shared';
import { HttpClientService } from '@coder-pioneers/shared';
import { BaseResponses } from '@coder-pioneers/shared';
import { AlertService } from '@coder-pioneers/shared';
import { RequestUnitDefinitions } from '@features/definitions/contracts/requests/request-unit-definitions';
import { ResponseIdAndNamesUpperUnite } from '@features/definitions/contracts/requests/response-id-and-names-upper-unite';
import { ListUnitDefinitionsRespon, ListUnitLowerRespon } from '@features/definitions/contracts/responses/list-unit-definitions-respon';

@Injectable({
  providedIn: 'root'
})
export class UnitDefinitionsService extends BaseService<
  ListUnitDefinitionsRespon,
  RequestUnitDefinitions,
  RequestUnitDefinitions,
  RequestUnitDefinitions,
  RequestUnitDefinitions,
  ResponseIdAndNamesUpperUnite,
  ListUnitLowerRespon,
  BaseResponses> {
  constructor(
    httpClientService: HttpClientService,
    alertService: AlertService
  ) {
    super(httpClientService, alertService, {
      controller: 'Unit',
      defaultActions: {
        list: 'GetUpperUnitListProperties',
        listDropbox:'GetUnitNamesList',
        listId:'GetLowerUnitList',
        insert: 'InsertUnit',
        update: 'UpdateUnitById'
      },
    });
  }

}




















