import { Inject, Injectable } from '@angular/core';
import { AlertService, BaseResponses, BaseService, HttpClientAuthService, HttpClientPrimaryService, HttpClientService } from '@coder-pioneers/shared';
import { UpdateRoleEndpoint } from '../contracts/requests/update-role-endpoint';

export interface AuthorizationEndpoint {
  id: number;
  name: string;
  description?: string;
}

export interface AuthorizationEndpointResponse extends BaseResponses {
  data: AuthorizationEndpoint;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizationEndpointsAuthApiService extends BaseService<
  AuthorizationEndpoint,
  AuthorizationEndpointResponse,
  UpdateRoleEndpoint,
  BaseResponses> {
  constructor(
    httpClientService: HttpClientAuthService,
    alertService: AlertService,
    @Inject('authApiUrl') private authApiUrl: string,
  ) {
    super(httpClientService, alertService, {
      controller: 'AuthorizationEndpoints',
      defaultActions: {
        update: 'UpdateRoleEndpoint',
      },
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizationEndpointsApiPrimaryService extends BaseService<
  AuthorizationEndpoint,
  UpdateRoleEndpoint,
  BaseResponses> {
  constructor(
    httpClientService: HttpClientPrimaryService,
    alertService: AlertService,
  ) {
    super(httpClientService, alertService, {
      controller: 'AuthorizationEndpoints',
      defaultActions: {
        insert: 'UpdateRoleEndpoint',
      },
    });
  }
}


@Injectable({
  providedIn: 'root'
})
export class AuthorizationEndpointsApiService extends BaseService<
  AuthorizationEndpoint,
  UpdateRoleEndpoint,
  BaseResponses> {
  constructor(
    httpClientService: HttpClientService,
    alertService: AlertService,
  ) {
    super(httpClientService, alertService, {
      controller: 'AuthorizationEndpoints',
      defaultActions: {
        insert: 'UpdateRoleEndpoint',
      },
    });
  }
}



















