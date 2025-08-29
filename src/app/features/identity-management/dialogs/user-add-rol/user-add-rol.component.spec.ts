import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@coder-pioneers/shared';
import { Respon_User_Definitions } from '@features/identity-management/contracts/requests/create-user-definitions';
import { RequestRolAddUser } from '@features/identity-management/contracts/requests/request-rol-add-user';
import { RolDefinitionsService } from '@features/identity-management/services/rol-definitions.service';
import { UserDefinitionsAuthService } from '@features/identity-management/services/user-definitions-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'projects/shared/src/environments/environment.development';
import { of } from 'rxjs';
import { UserAddRolComponent } from './user-add-rol.component';

describe('UserAddRolComponent', () => {
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<UserAddRolComponent>>;
  let mockRolService: jasmine.SpyObj<RolDefinitionsService>;
  let mockUserDefinitionsAuthService: jasmine.SpyObj<UserDefinitionsAuthService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
    const rolServiceSpy = jasmine.createSpyObj('RolDefinitionsService', ['read']);
    const userDefinitionsAuthServiceSpy = jasmine.createSpyObj('UserDefinitionsAuthService', ['createRoleToUser']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['success', 'error']);
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    mockDialogRef = dialogRefSpy;
    mockRolService = rolServiceSpy;
    mockUserDefinitionsAuthService = userDefinitionsAuthServiceSpy;
    mockAlertService = alertServiceSpy;
    mockSpinnerService = spinnerServiceSpy;
  });

  describe('Boş veri ile dialog', () => {
    let component: UserAddRolComponent;
    let fixture: ComponentFixture<UserAddRolComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          ReactiveFormsModule,
          UserAddRolComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: null },
          { provide: RolDefinitionsService, useValue: mockRolService },
          { provide: UserDefinitionsAuthService, useValue: mockUserDefinitionsAuthService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: 'authApiUrl', useValue: environment.apiUrls.authApiUrl }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(UserAddRolComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('bileşen başarıyla oluşturulmalı', () => {
      expect(component).toBeTruthy();
    });

    it('dialog başlığı ve ikonu doğru ayarlanmalı', () => {
      expect(component.dialogTitle).toBe('Kullanıcı Rol Ekleme');
      expect(component.titleIcon).toBe('account_circle');
    });

    it('form doğru şekilde başlatılmalı', () => {
      expect(component.frm).toBeDefined();
      expect(component.frm.get('userId')).toBeTruthy();
      expect(component.frm.get('roles')).toBeTruthy();
    });

    it('roles alanı zorunlu olmalı', () => {
      const rolesControl = component.frm.get('roles');
      expect(rolesControl?.hasError('required')).toBeTruthy();
      rolesControl?.setValue(['ROLE_ADMIN']);
      expect(rolesControl?.hasError('required')).toBeFalsy();
    });

    it('frmControls getter doğru kontrolleri döndürmeli', () => {
      const controls = component.frmControls;
      expect(controls).toBeDefined();
      expect(controls['userId']).toBeTruthy();
      expect(controls['roles']).toBeTruthy();
    });

    it('geçersiz form gönderildiğinde hata gösterilmeli', () => {
      component.frm.get('roles')?.setValue(null);
      expect(component.frm.valid).toBeFalsy();
    });

    it('boş veri ile dialog açıldığında formda null değerler olmalı', () => {
      expect(component.frm.get('userId')?.value).toBeNull();
      expect(component.frm.get('roles')?.value).toBeNull();
    });

    it('yeni rol ekleme işlemi başarıyla çalışmalı', () => {
      const mockRequest = new RequestRolAddUser();
      mockRequest.userId = 'test-user';
      mockRequest.roles = ['ROLE_ADMIN'];
      component.frm.patchValue(mockRequest);

      const mockResponse = new Respon_User_Definitions();
      mockResponse.title = 'Success';
      mockResponse.status = 1;
      mockResponse.message = 'Role added successfully';
      mockResponse.userId = 'test-user';

      mockUserDefinitionsAuthService.createRoleToUser.and.returnValue(of(mockResponse));
      component.onSubmit(mockRequest);
      expect(mockUserDefinitionsAuthService.createRoleToUser).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('Mevcut veri ile dialog', () => {
    let component: UserAddRolComponent;
    let fixture: ComponentFixture<UserAddRolComponent>;
    const mockRequest = new RequestRolAddUser();

    beforeEach(async () => {
      mockRequest.userId = 'test-user';
      mockRequest.roles = ['ROLE_USER'];

      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          ReactiveFormsModule,
          UserAddRolComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: mockRequest },
          { provide: RolDefinitionsService, useValue: mockRolService },
          { provide: UserDefinitionsAuthService, useValue: mockUserDefinitionsAuthService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: 'authApiUrl', useValue: environment.apiUrls.authApiUrl }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(UserAddRolComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('güncelleme modunda form verileri doldurulmalı', () => {
      expect(component.frm.get('userId')?.value).toBe('test-user');
      expect(component.frm.get('roles')?.value).toEqual(['ROLE_USER']);
    });

    it('güncelleme işlemi başarıyla çalışmalı', () => {
      const updateData = new RequestRolAddUser();
      updateData.userId = 'test-user';
      updateData.roles = ['ROLE_ADMIN', 'ROLE_USER'];
      component.frm.patchValue(updateData);

      const mockResponse = new Respon_User_Definitions();
      mockResponse.title = 'Success';
      mockResponse.status = 1;
      mockResponse.message = 'Role updated successfully';
      mockResponse.userId = 'test-user';

      mockUserDefinitionsAuthService.createRoleToUser.and.returnValue(of(mockResponse));
      component.onSubmit(updateData);
      expect(mockUserDefinitionsAuthService.createRoleToUser).toHaveBeenCalledWith(updateData);
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




















