import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, ListRolePermissions, SearchbarService } from '@coder-pioneers/shared';
import { ListAuthorizeDefinitionEndpointAuth } from '@features/identity-management/contracts/responses/list-authorize-definition-endpoint-auth';
import { ActionType, HTTPType, ListAuthorizeDefinitionEndpoints } from '@features/identity-management/contracts/responses/list-authorize-definition-endpoints';
import { ApplicationServiceApi, ApplicationServiceAuthApi } from '@features/identity-management/services/application.service';
import { AuthorizationEndpointsApiService, AuthorizationEndpointsAuthApiService } from '@features/identity-management/services/authorization-endpoints.service';
import { RolDefinitionsService } from '@features/identity-management/services/rol-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'projects/shared/src/environments/environment.development';
import { of } from 'rxjs';
import { RolDefinitionsNewComponent } from './rol-definitions-new.component';

describe('RolDefinitionsNewComponent', () => {
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<RolDefinitionsNewComponent>>;
  let mockApplicationService: jasmine.SpyObj<ApplicationServiceApi>;
  let mockApplicationServiceAuth: jasmine.SpyObj<ApplicationServiceAuthApi>;
  let mockRoleDefinitionsService: jasmine.SpyObj<RolDefinitionsService>;
  let mockAuthorizationEndpointsApiService: jasmine.SpyObj<AuthorizationEndpointsApiService>;
  let mockAuthorizationEndpointsAuthApiService:
  jasmine.SpyObj<AuthorizationEndpointsAuthApiService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;
  let mockSearchbarService: jasmine.SpyObj<SearchbarService>;

  beforeEach(() => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
    const applicationServiceSpy = jasmine.createSpyObj('ApplicationServiceApi', ['read']);
    const applicationServiceAuthSpy = jasmine.createSpyObj('ApplicationServiceAuthApi', ['read']);
    const roleDefinitionsServiceSpy = jasmine.createSpyObj('RolDefinitionsService', ['create', 'readFilter']);
    const authorizationEndpointsApiServiceSpy = jasmine.createSpyObj('AuthorizationEndpointsApiService', ['create']);
    const authorizationEndpointsAuthApiServiceSpy = jasmine.createSpyObj('AuthorizationEndpointsAuthApiService', ['update']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['success', 'error']);
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const searchbarServiceSpy = jasmine.createSpyObj('SearchbarService', ['setSearchText']);

    // Increase default timeout for all tests
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

    mockDialogRef = dialogRefSpy;
    mockApplicationService = applicationServiceSpy;
    mockApplicationServiceAuth = applicationServiceAuthSpy;
    mockRoleDefinitionsService = roleDefinitionsServiceSpy;
    mockAuthorizationEndpointsApiService = authorizationEndpointsApiServiceSpy;
    mockAuthorizationEndpointsAuthApiService = authorizationEndpointsAuthApiServiceSpy;
    mockAlertService = alertServiceSpy;
    mockSpinnerService = spinnerServiceSpy;
    mockSearchbarService = searchbarServiceSpy;
  });

  describe('Boş veri ile dialog', () => {
    let component: RolDefinitionsNewComponent;
    let fixture: ComponentFixture<RolDefinitionsNewComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          RolDefinitionsNewComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: { name: '' } },
          { provide: ApplicationServiceApi, useValue: mockApplicationService },
          { provide: ApplicationServiceAuthApi, useValue: mockApplicationServiceAuth },
          { provide: RolDefinitionsService, useValue: mockRoleDefinitionsService },
          { provide: AuthorizationEndpointsApiService,
          useValue: mockAuthorizationEndpointsApiService },
          { provide: AuthorizationEndpointsAuthApiService,
          useValue: mockAuthorizationEndpointsAuthApiService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: SearchbarService, useValue: mockSearchbarService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(RolDefinitionsNewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('bileşen başarıyla oluşturulmalı', () => {
      expect(component).toBeTruthy();
    });

    it('roleName boş olmalı', async () => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      await fixture.whenStable();
      fixture.detectChanges();
      expect(component.roleName).toBe('');
    });

    it('getEndpoints ve getEndpointAuth çağrılmalı', async () => {
      const mockEndpoints: ListAuthorizeDefinitionEndpoints = {
        name: 'Test Endpoint',
        actions: [{
          code: 'TEST_CODE',
          definition: 'Test Action',
          actionType: ActionType.Reading,
          httpType: HTTPType.Get
        }]
      };

      const mockAuthEndpoints: ListAuthorizeDefinitionEndpointAuth = {
        name: 'Test Auth Endpoint',
        actions: [{
          code: 'TEST_AUTH_CODE',
          definition: 'Test Auth Action',
          actionType: ActionType.Reading,
          httpType: HTTPType.Get
        }]
      };

      mockApplicationService.read.and.returnValue(Promise.resolve(mockEndpoints));
      mockApplicationServiceAuth.read.and.returnValue(Promise.resolve(mockAuthEndpoints));

      await component.getEndpoints();
      await component.getEndpointAuth();

      expect(mockApplicationService.read).toHaveBeenCalled();
      expect(mockApplicationServiceAuth.read).toHaveBeenCalled();
    });

    it('save metodu doğru çalışmalı', async () => {
      const mockRoleName = 'Test Role';
      component.roleName = mockRoleName;

      // Add delay method to component
      (component as any).delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      // Mock the delay function to return immediately
      spyOn(component as any, 'delay').and.returnValue(Promise.resolve());

      mockRoleDefinitionsService.create.and.returnValue(of({ success: true }));
      mockAuthorizationEndpointsApiService.create.and.returnValue(of({ success: true }));
      mockAuthorizationEndpointsAuthApiService.update.and.returnValue(of({ success: true }));

      await component.save();

      expect(mockSpinnerService.show).toHaveBeenCalledWith('s2');
      expect(mockRoleDefinitionsService.create).toHaveBeenCalled();
      expect(mockSpinnerService.hide).toHaveBeenCalledWith('s2');
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });
  });

  describe('Mevcut veri ile dialog', () => {
    let component: RolDefinitionsNewComponent;
    let fixture: ComponentFixture<RolDefinitionsNewComponent>;
    const mockData = {
      id: '1',
      name: 'Test Role'
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
          RolDefinitionsNewComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: mockData },
          { provide: ApplicationServiceApi, useValue: mockApplicationService },
          { provide: ApplicationServiceAuthApi, useValue: mockApplicationServiceAuth },
          { provide: RolDefinitionsService, useValue: mockRoleDefinitionsService },
          { provide: AuthorizationEndpointsApiService,
          useValue: mockAuthorizationEndpointsApiService },
          { provide: AuthorizationEndpointsAuthApiService,
          useValue: mockAuthorizationEndpointsAuthApiService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: SearchbarService, useValue: mockSearchbarService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(RolDefinitionsNewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('roleName doğru ayarlanmalı', () => {
      expect(component.roleName).toBe('Test Role');
    });

    it('mevcut rol için getEndpoints ve getEndpointAuth çağrılmalı', async () => {
      const mockEndpoints: ListAuthorizeDefinitionEndpoints = {
        name: 'Test Endpoint',
        actions: [{
          code: 'TEST_CODE',
          definition: 'Test Action',
          actionType: ActionType.Reading,
          httpType: HTTPType.Get
        }]
      };

      const mockAuthEndpoints: ListAuthorizeDefinitionEndpointAuth = {
        name: 'Test Auth Endpoint',
        actions: [{
          code: 'TEST_AUTH_CODE',
          definition: 'Test Auth Action',
          actionType: ActionType.Reading,
          httpType: HTTPType.Get
        }]
      };

      const mockRolePermissions: ListRolePermissions = {
        rolePermissions: ['TEST_CODE']
      };

      mockApplicationService.read.and.returnValue(Promise.resolve(mockEndpoints));
      mockApplicationServiceAuth.read.and.returnValue(Promise.resolve(mockAuthEndpoints));
      mockRoleDefinitionsService.readFilter.and.returnValue(Promise.resolve(mockRolePermissions));

      await component.getEndpoints();
      await component.getEndpointAuth();

      expect(mockApplicationService.read).toHaveBeenCalled();
      expect(mockApplicationServiceAuth.read).toHaveBeenCalled();
      expect(mockRoleDefinitionsService.readFilter).toHaveBeenCalledWith({ id: '1' });
    });
  });
});




















