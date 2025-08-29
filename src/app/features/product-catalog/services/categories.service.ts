import { Injectable } from '@angular/core';
import { AlertService, BaseResponses, BaseService, HttpClientService } from '@coder-pioneers/shared';
import { RequestCategories } from '../contracts/requests/request-categories';
import { CategoriesResponse } from '../contracts/responses/categories-response';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends BaseService<
  CategoriesResponse,
  RequestCategories,
  RequestCategories,
  never,
  never,
  CategoriesResponse,//dropbox
  CategoriesResponse,
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
      controller: 'Categories',
      defaultActions: {
        list: 'GetAllCategories',
        listId: 'GetByIdCategories',
        listDropbox: 'GetAllCategories', //TODO: api/Categories/GetAllCategoriesDropbox Yapılacak
        insert: 'CreateCategories',
        update: 'UpdateCategories',
      },
    });
  }
}














