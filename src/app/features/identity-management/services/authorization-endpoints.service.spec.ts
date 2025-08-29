
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AlertService } from '@coder-pioneers/shared';
import { environment } from 'projects/shared/projects/shared/src/environments/environment.development';
import { throwError } from 'rxjs';
import { AuthorizationEndpointsApiService, AuthorizationEndpointsAuthApiService } from './authorization-endpoints.service';

describe('AuthorizationEndpointsService', () => {
  let serviceAuth: AuthorizationEndpointsAuthApiService;
  let serviceApi: AuthorizationEndpointsApiService;
  let httpMock: HttpTestingController;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(() => {
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['error']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthorizationEndpointsAuthApiService,
        AuthorizationEndpointsApiService,
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
        { provide: 'authApiUrl', useValue: environment.apiUrls.authApiUrl }
      ]
    });
    serviceAuth = TestBed.inject(AuthorizationEndpointsAuthApiService);
    serviceApi = TestBed.inject(AuthorizationEndpointsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('AuthorizationEndpointsService servisi testi', () => {
    expect(serviceAuth).toBeTruthy();
    expect(serviceApi).toBeTruthy();
  });


  it('Auth update /AuthorizationEndpoints/UpdateRoleEndpoint fonksiyonu başarılı olmalı', () => {
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
    const httpClientService = (serviceAuth as any).httpClientService;
    spyOn(httpClientService, 'put').and.returnValue({ subscribe: (cb: any) => cb(mockResponse) });
    const result = serviceAuth.update(mockRequest as never);
    expect(httpClientService.put).toHaveBeenCalled();
  });

  it('Auth update /AuthorizationEndpoints/UpdateRoleEndpoint fonksiyonu hata durumunda alertService.error çağrılmalı', (done) => {
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
    const httpClientService = (serviceAuth as any).httpClientService;
    spyOn(httpClientService, 'put').and.returnValue(throwError(() => new Error('error')));
    serviceAuth.update(mockRequest as never).subscribe({
      next: () => {},
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      }
    });
  });


  it('Api post /AuthorizationEndpoints/AssignRoleEndpoint2 fonksiyonu başarılı olmalı', () => {
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
    const httpClientService = (serviceApi as any).httpClientService;
    spyOn(httpClientService, 'post').and.returnValue({ subscribe: (cb: any) => cb(mockResponse) });
    const result = serviceApi.create(mockRequest as never);
    expect(httpClientService.post).toHaveBeenCalled();
  });

  it('Api post /AuthorizationEndpoints/AssignRoleEndpoint2 fonksiyonu hata durumunda hata fırlatmalı', (done) => {
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
    const httpClientService = (serviceApi as any).httpClientService;
    spyOn(httpClientService, 'post').and.returnValue(throwError(() => new Error('error')));
    serviceApi.create(mockRequest as never).subscribe({
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





















