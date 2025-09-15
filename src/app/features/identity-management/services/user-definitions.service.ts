import { Injectable } from '@angular/core';
import { AlertService, BaseResponses, BaseService, HttpClientPrimaryService, HttpClientService } from '@coder-pioneers/shared';
import { ListUserDefAuthRes } from '@features/identity-management/contracts/responses/list-user-definitions-respon';
import { Create_User_employeeId } from '../contracts/requests/create-user-definitions';

@Injectable({
  providedIn: 'root'
})
export class UserDefinitionsService extends BaseService<
ListUserDefAuthRes,
never,
Create_User_employeeId,
BaseResponses> {
constructor(
  httpClientService: HttpClientPrimaryService,
  alertService: AlertService) {
  super(httpClientService, alertService, {
    controller: 'User',
    defaultActions: {
      list: 'GetAllUsers',
      update:'UpdateEmployeeUserId',
    },
  });
}
}























