import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AlertService, BaseResponses, BaseService, HttpClientPrimaryService, HttpClientService } from '@coder-pioneers/shared';
import { EmployeesDefinitionsResponse } from '@features/identity-management/contracts/responses/employees-definitions-response';
import { RequestEmployeesDefinitions } from '@features/identity-management/contracts/requests/request-employees-definitions';
import { RequestUserAddEmployee } from '@features/identity-management/contracts/requests/request-user-add-employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeesDefinitionsService extends BaseService<
EmployeesDefinitionsResponse,
RequestEmployeesDefinitions,
RequestEmployeesDefinitions,
never,
never,
never,
EmployeesDefinitionsResponse,
never,
never,
never,
RequestUserAddEmployee,
BaseResponses> {
constructor(
  httpClientService: HttpClientPrimaryService,
  alertService: AlertService,
  private httpClient:HttpClient,
  @Inject('baseUrl') private baseUrl: string
) {
  super(httpClientService, alertService, {
    controller: 'Employee',
    defaultActions: {
      list: 'GetEmployeeList',
      insert: 'InsertEmployee',
      update: 'MegaUpdateEmployee',
      listId: 'GetEmployeeById',
      put1:'UpdateEmployeeUserId'
    },
  });
}
}























