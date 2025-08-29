
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AlertService } from '@coder-pioneers/shared';
import { environment } from 'projects/shared/projects/shared/src/environments/environment.development';
import { ApplicationServiceApi, ApplicationServiceAuthApi } from './application.service';

describe('ApplicationServiceAuthApi', () => {
  let serviceAuth: ApplicationServiceAuthApi;
  let serviceApi: ApplicationServiceApi;
  let httpMock: HttpTestingController;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(() => {
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['error']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApplicationServiceAuthApi,
        ApplicationServiceApi,
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
        { provide: 'authApiUrl', useValue: environment.apiUrls.authApiUrl }
      ]
    });
    serviceAuth = TestBed.inject(ApplicationServiceAuthApi);
    serviceApi = TestBed.inject(ApplicationServiceApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('ApplicationServiceAuthApi servisi testi', () => {
    expect(serviceAuth).toBeTruthy();
    expect(serviceApi).toBeTruthy();
  });

  it('GET /ApplicationServices/GetAuthorizeDefinitionEndpoints read endpointine istek atmalı ve veriyi döndürmeli', async () => {
    const mockResponse = {
      result: [{
        id: '1',
        name: 'Test',
        customerId: 'c1',
        institutionId: 'i1',
        institutionName: 'Kurum',
        year: 2024,
        month: 5,
        status: 1,
        approvedUserId: 'u1',
        fileUploaded: true,
      }],
      refId: 0,
      id: 0,
      mesajBaslik: '',
      mesajIcerik: '',
      mesajDetay: ''
    };
    const promise = serviceAuth.read({ page: 1, size: 10 });
    const req = httpMock.expectOne(
      req => req.url.includes(`${environment.apiUrls.authApiUrl}/ApplicationServices/GetAuthorizeDefinitionEndpoints`)
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const data = await promise;
    expect(data).toEqual(mockResponse as never);
  });

  it('GET /ApplicationServices/GetAuthorizeDefinitionEndpoints read endpointinde hata oluşursa uyarı', async () => {
    const errorMsg = 'Server ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyiniz.';
    const promise = serviceAuth.read({ page: 1, size: 10 });
    const req = httpMock.expectOne(
      req => req.url.includes(`${environment.apiUrls.authApiUrl}/ApplicationServices/GetAuthorizeDefinitionEndpoints`)
    );
    req.flush({ mesajIcerik: errorMsg }, { status: 500, statusText: 'Server Error' });
    const data = await promise;
    expect(data).toBeUndefined();
    expect(alertServiceSpy.error).toHaveBeenCalledWith(errorMsg);
  });

  it('GET /ApplicationServices/GetAuthorizeDefinitionEndpoints GET endpointine istek atmalı ve veriyi döndürmeli', async () => {
    const mockResponse = {
      result: [{
        id: '1',
        name: 'Test',
        customerId: 'c1',
        institutionId: 'i1',
        institutionName: 'Kurum',
        year: 2024,
        month: 5,
        status: 1,
        approvedUserId: 'u1',
        fileUploaded: true,
      }],
      refId: 0,
      id: 0,
      mesajBaslik: '',
      mesajIcerik: '',
      mesajDetay: ''
    };
    const promise = serviceApi.read({ page: 1, size: 10 });
    const req = httpMock.expectOne(
      req => req.url.includes(`${environment.apiUrls.baseUrl}/ApplicationServices/GetAuthorizeDefinitionEndpoints`)
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const data = await promise;
    expect(data).toEqual(mockResponse as never);
  });

  it('GET /ApplicationServices/GetAuthorizeDefinitionEndpoints GET endpointinde hata oluşursa uyarı', async () => {
    const errorMsg = 'Server ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyiniz.';
    const promise = serviceApi.read({ page: 1, size: 10 });
    const req = httpMock.expectOne(
      req => req.url.includes(`${environment.apiUrls.baseUrl}/ApplicationServices/GetAuthorizeDefinitionEndpoints`)
    );
    req.flush({ mesajIcerik: errorMsg }, { status: 500, statusText: 'Server Error' });
    const data = await promise;
    expect(data).toBeUndefined();
    expect(alertServiceSpy.error).toHaveBeenCalledWith(errorMsg);
  });

  afterEach(() => {
    httpMock.verify();
  });
});





















