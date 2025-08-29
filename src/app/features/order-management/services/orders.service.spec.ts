import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AlertService } from '@coder-pioneers/shared';
import { environment } from 'src/environments/environment';
import { OrdersService } from './orders.service';
import { throwError } from 'rxjs';

describe('OrdersService', () => {
  let service: OrdersService;
  let httpMock: HttpTestingController;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(() => {
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['error']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OrdersService,
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl }
      ]
    });
    service = TestBed.inject(OrdersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('OrdersService servisi testi', () => {
    expect(service).toBeTruthy();
  });

  it('GET /Orders/GetAllOrders read endpointine istek atmalı ve veriyi döndürmeli', async () => {
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
      req => req.url.includes(`${environment.apiUrls.baseUrl}/Orders/GetAllOrders`)
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const data = await promise;
    expect(data).toEqual(mockResponse as never);
  });

  it('GET /Orders/GetAllOrders read endpointinde hata oluşursa uyarı', async () => {
    const errorMsg = 'Server ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyiniz.';
    const promise = service.read({ page: 1, size: 10 });
    const req = httpMock.expectOne(
      req => req.url.includes(`${environment.apiUrls.baseUrl}/Orders/GetAllOrders`)
    );
    req.flush({ mesajIcerik: errorMsg }, { status: 500, statusText: 'Server Error' });
    const data = await promise;
    expect(data).toBeUndefined();
    expect(alertServiceSpy.error).toHaveBeenCalledWith(errorMsg);
  });


  it('GET /Orders/GetByIdOrders readById endpointine istek atmalı ve veriyi döndürmeli', async () => {
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
    const promise = service.readId({ id: '1' },true);
    const req = httpMock.expectOne(
      req => req.url.includes(`${environment.apiUrls.baseUrl}/Orders/GetByIdOrders`)
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const data = await promise;
    expect(data).toEqual(mockResponse as never);
  });

  it('GET /Orders/GetByIdOrders readById endpointinde hata oluşursa uyarı', async () => {
    const errorMsg = 'Server ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyiniz.';
    const promise = service.readId({ id: '1' },true);
    const req = httpMock.expectOne(
      req => req.url.includes(`${environment.apiUrls.baseUrl}/Orders/GetByIdOrders`)
    );
    req.flush({ mesajIcerik: errorMsg }, { status: 500, statusText: 'Server Error' });
    const data = await promise;
    expect(data).toBeUndefined();
    expect(alertServiceSpy.error).toHaveBeenCalledWith(errorMsg);
  });

  it('post /Orders/CreateOrders fonksiyonu başarılı olmalı', () => {
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

  it('post /Orders/CreateOrders fonksiyonu hata durumunda hata fırlatmalı', (done) => {
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

  it('update /Orders/UpdateOrders fonksiyonu başarılı olmalı', () => {
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

  it('update /Orders/UpdateOrders fonksiyonu hata durumunda alertService.error çağrılmalı', (done) => {
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

  afterEach(() => {
    httpMock.verify();
  });

});









