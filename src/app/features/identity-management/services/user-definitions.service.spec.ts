
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AlertService } from '@coder-pioneers/shared';
import { UserDefinitionsService } from './user-definitions.service';
import { environment } from 'src/environments/environment.development'; 

describe('UserDefinitionsService', () => {
  let service: UserDefinitionsService;
  let httpMock: HttpTestingController;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(() => {
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['error']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserDefinitionsService,
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl }
      ]
    });
    service = TestBed.inject(UserDefinitionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('UserDefinitionsService servisi testi', () => {
    expect(service).toBeTruthy();
  });

  it('GET /User/GetAllUsers read endpointine istek atmalı ve veriyi döndürmeli', async () => {
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
      req => req.url.includes(`${environment.apiUrls.baseUrl}/User/GetAllUsers`)
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const data = await promise;
    expect(data).toEqual(mockResponse as never);
  });

  it('GET /User/GetAllUsers read endpointinde hata oluşursa uyarı', async () => {
    const errorMsg = 'Server ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyiniz.';
    const promise = service.read({ page: 1, size: 10 });
    const req = httpMock.expectOne(
      req => req.url.includes(`${environment.apiUrls.baseUrl}/User/GetAllUsers`)
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





















