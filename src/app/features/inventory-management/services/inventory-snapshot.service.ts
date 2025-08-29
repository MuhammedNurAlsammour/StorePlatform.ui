import { Injectable } from '@angular/core';
import { AlertService, BaseResponses, BaseService, HttpClientService } from '@coder-pioneers/shared';
import { InventorySnapshotResponse } from '../contracts/responses/inventory-snapshot-response';
import { RequestInventorySnapshot } from '../contracts/requests/request-inventory-snapshot';


@Injectable({
  providedIn: 'root'
})
export class InventorySnapshotService extends BaseService<
  InventorySnapshotResponse,      // TListResponse
  RequestInventorySnapshot,       // TCreateRequest
  RequestInventorySnapshot,       // TUpdateRequest
  never,                        // TApproveRequest
  never,                        // TRejectRequest
  never,                        // TListDropboxResponse
  InventorySnapshotResponse,      // TListIdResponse
  InventorySnapshotResponse,      // TListByUserIdResponse
  never,                        // TListResponseFilter
  never,                        // TPostRequest1
  never,                        // TPostRequest2
  never,                        // TPutRequest1
  never,                        // TPutRequest2
  never,                        // TPutRequest3
  BaseResponses                 // TAllResponse
> {
  constructor(
    httpClientService: HttpClientService,
    alertService: AlertService
  )
  {
    super(
      httpClientService,
      alertService,
    {
      controller: 'InventorySnapshot',
      defaultActions: {
        list: 'GetAllInventorySnapshot',
        listId: 'GetByIdInventorySnapshot',
        listByUserId: 'GetByUserIdInventorySnapshot',
        insert: 'CreateInventorySnapshot',
        update: 'UpdateInventorySnapshot',
      },
    });
  }
}

