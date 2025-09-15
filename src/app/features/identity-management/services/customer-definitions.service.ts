import { Injectable } from '@angular/core';
import { BaseService } from '@coder-pioneers/shared';
import { HttpClientAuthService } from '@coder-pioneers/shared';
import { BaseResponses } from '@coder-pioneers/shared';
import { AlertService } from '@coder-pioneers/shared';    
import { CustomerDefinitionsResponse } from '@features/identity-management/contracts/responses/customer-definitions-response';
import { RequestCustomerDefinitions } from '../contracts/requests/request-customer-definitions';


@Injectable({
  providedIn: 'root'
})
export class CustomerDefinitionsService extends BaseService<
  CustomerDefinitionsResponse,  // Liste Yanıt Tipi
  RequestCustomerDefinitions,   // Oluşturma İstek Tipi
  RequestCustomerDefinitions,   // Güncelleme İstek Tipi
  never,                        // Onaylama İstek Tipi (kullanılmıyor)
  never,                        // Reddetme İstek Tipi (kullanılmıyor)
  never,                        // Dropbox Yanıt Tipi (kullanılmıyor)
  CustomerDefinitionsResponse,  // Liste ID Yanıt Tipi
  BaseResponses                  // Yanıt Filtre Tipi
> {
  constructor(
    httpClientService: HttpClientAuthService,
    alertService: AlertService,
  ) {
    super(httpClientService, alertService, {
      controller: 'Customers',
      defaultActions: {
        list: 'GetAllCustomers',   // Tüm Müşterileri Getir
        listId: 'GetCustomerById', // ID'ye Göre Müşteri Getir (kullanılmıyor)
        insert: 'CreateCustomer',  // Müşteri Oluştur
        update: 'UpdateCustomer',  // Müşteri Güncelle
        delete: 'RemoveCustomer',  // Müşteri Sil
      },
    });
  }
}























