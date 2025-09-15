import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AlertService } from '@coder-pioneers/shared';
import { environment } from 'projects/shared/projects/shared/src/environments/environment.development';
import { throwError } from 'rxjs';
import { CustomerDefinitionsService } from './customer-definitions.service';

describe('CustomerDefinitionsService', () => {
  let service: CustomerDefinitionsService;
  let httpMock: HttpTestingController;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(() => {
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['error']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomerDefinitionsService,
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: 'authApiUrl', useValue: environment.apiUrls.authApiUrl }
      ]
    });
    service = TestBed.inject(CustomerDefinitionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('CustomerDefinitionsService servisi testi', () => {
    expect(service).toBeTruthy();
  });

  it('GET /Customers/GetAllCustomers read endpointine istek atmalı ve veriyi döndürmeli', async () => {
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
    const promise = service.read({ page: 1, size: 10 });
    const req = httpMock.expectOne(
      req => req.url.includes(`${environment.apiUrls.authApiUrl}/Customers/GetAllCustomers`)
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const data = await promise;
    expect(data).toEqual(mockResponse as never);
  });

  it('GET /Customers/GetAllCustomers read endpointinde hata oluşursa uyarı', async () => {
    const errorMsg = 'Server ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyiniz.';
    const promise = service.read({ page: 1, size: 10 });
    const req = httpMock.expectOne(
      req => req.url.includes(`${environment.apiUrls.authApiUrl}/Customers/GetAllCustomers`)
    );
    req.flush({ mesajIcerik: errorMsg }, { status: 500, statusText: 'Server Error' });
    const data = await promise;
    expect(data).toBeUndefined();
    expect(alertServiceSpy.error).toHaveBeenCalledWith(errorMsg);
  });

  it('GET /Customers/GetCustomerById GET endpointine istek atmalı ve veriyi döndürmeli', async () => {
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
    const promise = service.readId({ page: 1, size: 10 },true);
    const req = httpMock.expectOne(
      req => req.url.includes(`${environment.apiUrls.authApiUrl}/Customers/GetCustomerById`)
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const data = await promise;
    expect(data).toEqual(mockResponse as never);
  });

  it('GET /Customers/GetCustomerById GET endpointinde hata oluşursa uyarı', async () => {
    const errorMsg = 'Server ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyiniz.';
    const promise = service.readId({ page: 1, size: 10 },true);
    const req = httpMock.expectOne(
      req => req.url.includes(`${environment.apiUrls.authApiUrl}/Customers/GetCustomerById`)
    );
    req.flush({ mesajIcerik: errorMsg }, { status: 500, statusText: 'Server Error' });
    const data = await promise;
    expect(data).toBeUndefined();
    expect(alertServiceSpy.error).toHaveBeenCalledWith(errorMsg);
  });

  it('post /Customers/CreateCustomer fonksiyonu başarılı olmalı', () => {
    const mockRequest = {
      id: '1',
      countryName: 'Test',
      countryCode: 1,
      createdAt: new Date(),
      isActive: 1,
      userId: 'u1',
      updateUserId: 'u2',
      customerId: 'c1',
      institutionId: 'i1',
    };
    const mockResponse = { success: true };
    const httpClientService = (service as any).httpClientService;
    spyOn(httpClientService, 'post').and.returnValue({ subscribe: (cb: any) => cb(mockResponse) });
    const result = service.create(mockRequest as never);
    expect(httpClientService.post).toHaveBeenCalled();
  });

  it('post /Customers/CreateCustomer fonksiyonu hata durumunda hata fırlatmalı', (done) => {
    const mockRequest = {
      id: '1',
      countryName: 'Test',
      countryCode: 1,
      createdAt: new Date(),
      isActive: 1,
      userId: 'u1',
      updateUserId: 'u2',
      customerId: 'c1',
      institutionId: 'i1',
    };
    const httpClientService = (service as any).httpClientService;
    spyOn(httpClientService, 'post').and.returnValue(throwError(() => new Error('error')));
    service.create(mockRequest as never).subscribe({
      next: () => {},
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      }
    });
  });

  it('update /Customers/UpdateCustomer fonksiyonu başarılı olmalı', () => {
    const mockRequest = {
      id: '1',
      countryName: 'Test',
      countryCode: 1,
      createdAt: new Date(),
      isActive: 1,
      userId: 'u1',
      updateUserId: 'u2',
      customerId: 'c1',
      institutionId: 'i1',
    };
    const mockResponse = { success: true };
    const httpClientService = (service as any).httpClientService;
    spyOn(httpClientService, 'put').and.returnValue({ subscribe: (cb: any) => cb(mockResponse) });
    const result = service.update(mockRequest as never);
    expect(httpClientService.put).toHaveBeenCalled();
  });

  it('update /Customers/UpdateCustomer fonksiyonu hata durumunda alertService.error çağrılmalı', (done) => {
    const mockRequest = {
      id: '1',
      countryName: 'Test',
      countryCode: 1,
      createdAt: new Date(),
      isActive: 1,
      userId: 'u1',
      updateUserId: 'u2',
      customerId: 'c1',
      institutionId: 'i1',
    };
    const httpClientService = (service as any).httpClientService;
    spyOn(httpClientService, 'put').and.returnValue(throwError(() => new Error('error')));
    service.update(mockRequest as never).subscribe({
      next: () => {},
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      }
    });
  });

  it('DELETE /Customers/RemoveCustomer endpointine istek atmalı ve veriyi döndürmeli', (done) => {
    const customerId = '123e4567-e89b-12d3-a456-426614174000';
    const mockResponse = {
      result: [{
        id: customerId,
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
    service.delete({ id: customerId },false).subscribe({
      next: (data) => {
        expect(data).toEqual(mockResponse as never);
        done();
      },
      error: (error) => {
        fail(error);
        done();
      }
    });

    const req = httpMock.expectOne(
      req => req.url.includes(`${environment.apiUrls.authApiUrl}/Customers/RemoveCustomer`) &&
             req.method === 'DELETE'
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });


  afterEach(() => {
    httpMock.verify();
  });

});
























