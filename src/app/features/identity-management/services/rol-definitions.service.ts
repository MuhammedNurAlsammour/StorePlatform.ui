import { Injectable } from '@angular/core';
import { AlertService, BaseResponses, BaseService, HttpClientAuthService } from '@coder-pioneers/shared';
import { ListRolDefinitions } from '@features/identity-management/contracts/responses/list-rol-definitions';
import { RequestRolDefinitions } from '../contracts/requests/request-rol-definitions';
import { ListRolePermissions } from '../contracts/responses/list-role-permissions';

@Injectable({
  providedIn: 'root'
})
export class RolDefinitionsService extends BaseService<
ListRolDefinitions,
RequestRolDefinitions,
RequestRolDefinitions,
never,                       
never,
never,
ListRolDefinitions,
ListRolePermissions,
BaseResponses> {
constructor(
  httpClientService: HttpClientAuthService,
  alertService: AlertService,
) {
    super(httpClientService, alertService, {
      controller: 'Roles',
      defaultActions: {
        list:'GetRoles',
        listId:'GetLeaveRequestsByManagerId',
        listFilter:'RolePermissions',
        insert:'CreateRole',
        update:'UpdateRole',
        delete:'DeleteRole'
      },
    });
  }
}



















