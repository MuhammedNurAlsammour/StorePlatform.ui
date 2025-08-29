import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@coder-pioneers/shared';
import { PermissionsService } from '@coder-pioneers/shared';
import { ListAuthorizeDefinitionEndpointAuth } from '@features/identity-management/contracts/responses/list-authorize-definition-endpoint-auth';
import { ActionType, HTTPType, ListAuthorizeDefinitionEndpoints } from '@features/identity-management/contracts/responses/list-authorize-definition-endpoints';
import { ApplicationServiceApi, ApplicationServiceAuthApi } from '@features/identity-management/services/application.service';
import { AuthorizationEndpointsApiService, AuthorizationEndpointsAuthApiService } from '@features/identity-management/services/authorization-endpoints.service';
import { RolDefinitionsService } from '@features/identity-management/services/rol-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'projects/shared/src/environments/environment.development';
import { of } from 'rxjs';
import { RolDefinitionsCreateDialogComponent } from './rol-definitions-create-dialog.component';
import { SearchbarService } from '@coder-pioneers/shared';

describe('RolDefinitionsCreateDialogComponent', () => {
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<RolDefinitionsCreateDialogComponent>>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;
  let mockApplicationService: jasmine.SpyObj<ApplicationServiceApi>;
  let mockApplicationServiceAuth: jasmine.SpyObj<ApplicationServiceAuthApi>;
  let mockRoleDefinitionsService: jasmine.SpyObj<RolDefinitionsService>;
  let mockPermissionsService: jasmine.SpyObj<PermissionsService>;
  let mockAuthorizationEndpointsApiService: jasmine.SpyObj<AuthorizationEndpointsApiService>;
  let mockAuthorizationEndpointsAuthApiService: 
  jasmine.SpyObj<AuthorizationEndpointsAuthApiService>;
  let mockSearchbarService: jasmine.SpyObj<SearchbarService>;

  beforeEach(() => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['success', 'error']);
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const applicationServiceSpy = jasmine.createSpyObj('ApplicationServiceApi', ['read']);
    const applicationServiceAuthSpy = jasmine.createSpyObj('ApplicationServiceAuthApi', ['read']);
    const roleDefinitionsServiceSpy = jasmine.createSpyObj('RolDefinitionsService', ['create', 'readFilter']);
    const permissionsServiceSpy = jasmine.createSpyObj('PermissionsService', ['getPermissions']);
    const authorizationEndpointsApiServiceSpy = jasmine.createSpyObj('AuthorizationEndpointsApiService', ['create']);
    const authorizationEndpointsAuthApiServiceSpy = jasmine.createSpyObj('AuthorizationEndpointsAuthApiService', ['update']);
    const searchbarServiceSpy = jasmine.createSpyObj('SearchbarService', ['search']);

    mockDialogRef = dialogRefSpy;
    mockAlertService = alertServiceSpy;
    mockSpinnerService = spinnerServiceSpy;
    mockApplicationService = applicationServiceSpy;
    mockApplicationServiceAuth = applicationServiceAuthSpy;
    mockRoleDefinitionsService = roleDefinitionsServiceSpy;
    mockPermissionsService = permissionsServiceSpy;
    mockAuthorizationEndpointsApiService = authorizationEndpointsApiServiceSpy;
    mockAuthorizationEndpointsAuthApiService = authorizationEndpointsAuthApiServiceSpy;
    mockSearchbarService = searchbarServiceSpy;
  });

  describe('Boş veri ile dialog', () => {
    let component: RolDefinitionsCreateDialogComponent;
    let fixture: ComponentFixture<RolDefinitionsCreateDialogComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          RolDefinitionsCreateDialogComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: null },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: ApplicationServiceApi, useValue: mockApplicationService },
          { provide: ApplicationServiceAuthApi, useValue: mockApplicationServiceAuth },
          { provide: RolDefinitionsService, useValue: mockRoleDefinitionsService },
          { provide: PermissionsService, useValue: mockPermissionsService },
          { provide: AuthorizationEndpointsApiService, 
          useValue: mockAuthorizationEndpointsApiService },
          { provide: AuthorizationEndpointsAuthApiService, 
          useValue: mockAuthorizationEndpointsAuthApiService },
          { provide: SearchbarService, useValue: mockSearchbarService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(RolDefinitionsCreateDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('bileşen başarıyla oluşturulmalı', () => {
      expect(component).toBeTruthy();
    });

    it('rol adı boş olmalı', () => {
      expect(component.roleName).toBe('');
    });

    it('endpoints ve authTask başlangıçta boş dizi olmalı', () => {
      expect(component.endpoints).toEqual([]);
      expect(component.authTask).toEqual([]);
    });

    it('getEndpoints fonksiyonu çağrıldığında API servisini çağırmalı', async () => {
      const mockResponse: ListAuthorizeDefinitionEndpoints = {
        name: 'Test Endpoint',
        actions: [
          {
            definition: 'Test Action',
            code: 'TEST_ACTION',
            actionType: ActionType.Reading,
            httpType: HTTPType.Get
          }
        ]
      };
      mockApplicationService.read.and.returnValue(Promise.resolve(mockResponse));
      await component.getEndpoints();
      expect(mockApplicationService.read).toHaveBeenCalled();
    });

    it('getEndpointAuth fonksiyonu çağrıldığında Auth API servisini çağırmalı', async () => {
      const mockAuthResponse: ListAuthorizeDefinitionEndpointAuth = {
        name: 'Test Auth Endpoint',
        actions: [
          {
            definition: 'Test Auth Action',
            code: 'TEST_AUTH_ACTION',
            actionType: ActionType.Writing,
            httpType: HTTPType.Post
          }
        ]
      };
      mockApplicationServiceAuth.read.and.returnValue(Promise.resolve(mockAuthResponse));
      await component.getEndpointAuth();
      expect(mockApplicationServiceAuth.read).toHaveBeenCalled();
    });

    it('save fonksiyonu çağrıldığında spinner gösterilmeli', async () => {
      spyOn(component, 'save').and.callThrough();
      await component.save();
      expect(mockSpinnerService.show).toHaveBeenCalled();
    });
  });

  describe('Mevcut veri ile dialog', () => {
    let component: RolDefinitionsCreateDialogComponent;
    let fixture: ComponentFixture<RolDefinitionsCreateDialogComponent>;
    const mockData = {
      id: '1',
      name: 'Test Role',
      customerId: 'test-customer',
      institutionId: 'test-institution'
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          RolDefinitionsCreateDialogComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: mockData },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: ApplicationServiceApi, useValue: mockApplicationService },
          { provide: ApplicationServiceAuthApi, useValue: mockApplicationServiceAuth },
          { provide: RolDefinitionsService, useValue: mockRoleDefinitionsService },
          { provide: PermissionsService, useValue: mockPermissionsService },
          { provide: AuthorizationEndpointsApiService, 
          useValue: mockAuthorizationEndpointsApiService },
          { provide: AuthorizationEndpointsAuthApiService, 
          useValue: mockAuthorizationEndpointsAuthApiService },
          { provide: SearchbarService, useValue: mockSearchbarService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(RolDefinitionsCreateDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('rol adı doğru ayarlanmalı', () => {
      expect(component.roleName).toBe('Test Role');
    });

    it('getEndpoints fonksiyonu mevcut rol için yetkileri getirmeli', async () => {
      const mockResponse: ListAuthorizeDefinitionEndpoints = {
        name: 'Test Endpoint',
        actions: [
          {
            definition: 'Test Action',
            code: 'TEST_ACTION',
            actionType: ActionType.Reading,
            httpType: HTTPType.Get
          }
        ]
      };
      mockApplicationService.read.and.returnValue(Promise.resolve(mockResponse));
      mockRoleDefinitionsService.readFilter.and.returnValue(
      Promise.resolve({ rolePermissions: [] }));
      await component.getEndpoints();
      expect(mockRoleDefinitionsService.readFilter).toHaveBeenCalledWith({ roleId: '1' });
    });
  });

  describe('Dialog etkileşimleri', () => {
    it('dialog kapatıldığında afterClosed çalışmalı', () => {
      mockDialogRef.afterClosed.and.returnValue(of(true));
      const result = mockDialogRef.afterClosed();
      result.subscribe(value => {
        expect(value).toBe(true);
      });
    });
  });
});



















