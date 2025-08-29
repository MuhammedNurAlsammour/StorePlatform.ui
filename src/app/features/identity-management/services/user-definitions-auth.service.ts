import { Inject, Injectable } from '@angular/core';
import { AlertService, BaseService, HttpClientAuthService } from '@coder-pioneers/shared';
import { RequestRolAddUser } from '@features/identity-management/contracts/requests/request-rol-add-user';
import { Observable } from 'rxjs';
import { Create_User_Definitions, Respon_User_Definitions } from '../contracts/requests/create-user-definitions';
import { ChangePassword } from '../contracts/requests/change-password';

@Injectable({
  providedIn: 'root'
})
export class UserDefinitionsAuthService extends BaseService<
  never,
  Create_User_Definitions,
  ChangePassword,
  RequestRolAddUser,
  ChangePassword,
  never,
  never,
  never,
  Respon_User_Definitions> {
  constructor(
    httpClientService: HttpClientAuthService,
    alertService: AlertService,
    @Inject('authApiUrl') private authApiUrl: string,
  ) {
      super(httpClientService, alertService, {
        controller: 'Users',
        defaultActions: {
          insert:'CreateUser',
          update:'UpdatePassword',
          delete:'DeleteUser',
        },
      });
    }

    createRoleToUser(model: RequestRolAddUser): Observable<Respon_User_Definitions> {
      return this.approvePost(model, 'AssignRoleToUser');
    }

    userChangePassword(model: ChangePassword): Observable<Respon_User_Definitions> {
      return this.rejectPost(model, 'UpdatePasswordWithNoResetToken');
    }
}




















