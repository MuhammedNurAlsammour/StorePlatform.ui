import { Injectable } from '@angular/core';
import { BaseService, HttpClientPrimaryService } from '@coder-pioneers/shared';
import { HttpClientAuthService } from '@coder-pioneers/shared';
import { HttpClientService } from '@coder-pioneers/shared';
import { BaseResponses } from '@coder-pioneers/shared';
import { AlertService } from '@coder-pioneers/shared';
import { ListAuthorizeDefinitionEndpointAuth } from '@features/identity-management/contracts/responses/list-authorize-definition-endpoint-auth';
import { ListAuthorizeDefinitionEndpoints } from '@features/identity-management/contracts/responses/list-authorize-definition-endpoints';

@Injectable({
  providedIn: 'root'
})
export class ApplicationServiceAuthApi extends BaseService<
ListAuthorizeDefinitionEndpointAuth,
BaseResponses> {
constructor(
  httpClientService: HttpClientAuthService,
  alertService: AlertService,
) {
    super(httpClientService, alertService, {
      controller: 'ApplicationServices',
      defaultActions: {
        list: 'GetAuthorizeDefinitionEndpoints',
      },
    });
  }
}


@Injectable({
  providedIn: 'root'
})
export class ApplicationServiceApiPrimary extends BaseService<
ListAuthorizeDefinitionEndpoints,
BaseResponses> {
constructor(
  httpClientService: HttpClientPrimaryService,
  alertService: AlertService,
) {
    super(httpClientService, alertService, {
      controller: 'ApplicationServices',
      defaultActions: {
        list: 'GetAuthorizeDefinitionEndpoints',
      },
    });
  }
}



@Injectable({
  providedIn: 'root'
})
export class ApplicationServiceApi extends BaseService<
ListAuthorizeDefinitionEndpoints,
BaseResponses> {
constructor(
  httpClientService: HttpClientService,
  alertService: AlertService,
) {
    super(httpClientService, alertService, {
      controller: 'ApplicationServices',
      defaultActions: {
        list: 'GetAuthorizeDefinitionEndpoints',
      },
    });
  }
}























