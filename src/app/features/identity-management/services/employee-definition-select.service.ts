import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService, BaseResponses, BaseService, HttpClientPrimaryService, HttpClientService } from '@coder-pioneers/shared';
import { PersonnelManagersPanelResponse } from '../contracts/responses/personnel-managers-panel-response';
import { RequestPersonnelManagersPanel } from '../contracts/requests/request-personnel-managers-panel';
import { ListpersonelSelecteRespon } from '@contracts/response-selecte-personel';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDefinitionSelectService extends BaseService<
PersonnelManagersPanelResponse,
RequestPersonnelManagersPanel,
RequestPersonnelManagersPanel,
never,
never,
never,
ListpersonelSelecteRespon,
BaseResponses> {
constructor(
  httpClientService: HttpClientPrimaryService,
  alertService: AlertService
) {
  super(httpClientService, alertService, {
    controller: 'Employee',
    defaultActions: {
      list: 'GetEmployeeListForManager',
      listId: 'ListAllEmployeesOnDropboxes',
      insert: 'InsertDistrict',
      update: 'UpdateDistrictById',
    },
  });
}
    /**
  * listeleme
  *em listesini oku
  *Belirli bir sayfa düzeninde Overtime listesini alır.
  *@param {number} page - Verilerin görüntüleneceği istenen sayfa. Varsayılan olarak 0.
  *@param {number} size - Bir sayfadaki gösterilecek öğe sayısı. Varsayılan olarak 5.
  *@returns {Promise<ListpersonelcardRespon|undefined>} - Alınan Overtime listesi veya hata durumunda tanımsız.
  */
  async readEmployeeSelecte(
    customerId?: string | null,
    institutionId?: string | null
  ): Promise<ListpersonelSelecteRespon | undefined> {
    try {
      const params = new URLSearchParams();
      if (customerId != null) {
        params.append('CustomerId', customerId);
      }
      if (institutionId != null) {
        params.append('InstitutionId', institutionId);
      }
      const queryString = params.toString();
      const promiseData: ListpersonelSelecteRespon | undefined = await this.httpClientService.get<
      ListpersonelSelecteRespon
      >({
        controller: 'Employee',
        action: 'ListEmployeesOnDropboxes',
        queryString
      }).toPromise();
      return promiseData;
    } catch (errorResponse: any) {
      if (errorResponse instanceof HttpErrorResponse) {
        const errorMessage: string = errorResponse.error?.mesajIcerik ||  'Server ile iletişim sağlanamadı lütfen daha sonra tekrar deneyiniz.';
        this.alertService.error(errorMessage);
      }
      return undefined;
    }
  }



    /**
  * listeleme
  *em listesini oku
  *Belirli bir sayfa düzeninde Overtime listesini alır.
  *@param {number} page - Verilerin görüntüleneceği istenen sayfa. Varsayılan olarak 0.
  *@param {number} size - Bir sayfadaki gösterilecek öğe sayısı. Varsayılan olarak 5.
  *@returns {Promise<ListpersonelcardRespon|undefined>} - Alınan Overtime listesi veya hata durumunda tanımsız.
  */
  async readEmployeeCustomers(
  ): Promise<ListpersonelSelecteRespon | undefined> {
    try {
      const params = new URLSearchParams();
      const queryString = params.toString();
      const promiseData: ListpersonelSelecteRespon | undefined = await this.httpClientService.get<
      ListpersonelSelecteRespon
      >({
        controller: 'Employee',
        action: 'ListEmployeesOnDropboxesWithNoFilter',
        queryString
      }).toPromise();
      return promiseData;
    } catch (errorResponse: any) {
      if (errorResponse instanceof HttpErrorResponse) {
        const errorMessage: string = errorResponse.error?.mesajIcerik ||  'Server ile iletişim sağlanamadı lütfen daha sonra tekrar deneyiniz.';
        this.alertService.error(errorMessage);
      }
      return undefined;
    }
  }


}




















