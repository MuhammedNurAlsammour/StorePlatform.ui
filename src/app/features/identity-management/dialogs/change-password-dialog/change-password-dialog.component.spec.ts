import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@coder-pioneers/shared';
import { ChangePassword } from '@features/identity-management/contracts/requests/change-password';
import { UserDefinitionsAuthService } from '@features/identity-management/services/user-definitions-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { environment } from 'projects/shared/src/environments/environment.development';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';
  
describe('ChangePasswordDialogComponent', () => {
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ChangePasswordDialogComponent>>;
  let mockResponseService: jasmine.SpyObj<UserDefinitionsAuthService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;
  let mockUserAuthService: jasmine.SpyObj<UserDefinitionsAuthService>;

  beforeEach(() => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
    const countryServiceSpy = jasmine.createSpyObj('CountryService', ['create', 'update']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['success', 'error']);
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const userAuthServiceSpy = jasmine.createSpyObj('UserDefinitionsAuthService', ['userChangePassword']);

    mockDialogRef = dialogRefSpy;
    mockResponseService = countryServiceSpy;
    mockAlertService = alertServiceSpy;
    mockSpinnerService = spinnerServiceSpy;
    mockUserAuthService = userAuthServiceSpy;
  });

  describe('Boş veri ile dialog', () => {
    let component: ChangePasswordDialogComponent;
    let fixture: ComponentFixture<ChangePasswordDialogComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          ChangePasswordDialogComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: null },
          { provide: UserDefinitionsAuthService, useValue: mockResponseService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' },
          { provide: UserDefinitionsAuthService, useValue: mockUserAuthService }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ChangePasswordDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('bileşen başarıyla oluşturulmalı', () => {
      expect(component).toBeTruthy();
    });

    it('dialog başlığı ve ikonu doğru ayarlanmalı', () => {
      expect(component.dialogTitle).toBe('Şifre Değiştirme');
      expect(component.titleIcon).toBe('lock');
    });

    it('form doğru şekilde başlatılmalı', () => {
      expect(component.frm).toBeDefined();
      expect(component.frm.get('userId')).toBeTruthy();
      expect(component.frm.get('newPassword')).toBeTruthy();
      expect(component.frm.get('confirmPassword')).toBeTruthy();
    });

    it('tüm alanlar zorunlu olmalı', () => {
      const userIdControl = component.frm.get('userId');
      const newPasswordControl = component.frm.get('newPassword');
      const confirmPasswordControl = component.frm.get('confirmPassword');

      // Mark all controls as touched to trigger validation
      userIdControl?.markAsTouched();
      newPasswordControl?.markAsTouched();
      confirmPasswordControl?.markAsTouched();

      // Update form validity
      component.frm.updateValueAndValidity();

      expect(userIdControl?.hasError('required')).toBeTruthy();
      expect(newPasswordControl?.hasError('required')).toBeTruthy();
      expect(confirmPasswordControl?.hasError('required')).toBeTruthy();
    });

    it('şifreler eşleşmeli', () => {
      const newPasswordControl = component.frm.get('newPassword');
      const confirmPasswordControl = component.frm.get('confirmPassword');

      newPasswordControl?.setValue('password123');
      confirmPasswordControl?.setValue('password456');
      expect(component.frm.hasError('passwordMismatch')).toBeTruthy();

      confirmPasswordControl?.setValue('password123');
      expect(component.frm.hasError('passwordMismatch')).toBeFalsy();
    });

    it('frmControls getter doğru kontrolleri döndürmeli', () => {
      const controls = component.frmControls;
      expect(controls).toBeDefined();
      expect(controls['userId']).toBeTruthy();
      expect(controls['newPassword']).toBeTruthy();
      expect(controls['confirmPassword']).toBeTruthy();
    });

    it('geçersiz form gönderildiğinde hata gösterilmeli', () => {
      component.frm.get('userId')?.setValue('');
      component.frm.get('newPassword')?.setValue('');
      component.frm.get('confirmPassword')?.setValue('');
      expect(component.frm.valid).toBeFalsy();
    });

    it('boş veri ile dialog açıldığında formda boş değerler olmalı', () => {
      expect(component.frm.get('userId')?.value).toBe('');
      expect(component.frm.get('newPassword')?.value).toBe('');
      expect(component.frm.get('confirmPassword')?.value).toBe('');
    });

    it('şifre değiştirme işlemi başarıyla çalışmalı', () => {
      const mockRequest = new ChangePassword();
      mockRequest.userId = 'test-user';
      mockRequest.newPassword = 'newPassword123';
      mockRequest.confirmPassword = 'newPassword123';

      mockUserAuthService.userChangePassword.and.returnValue(of({ 
        success: true, 
        message: 'Şifre başarıyla değiştirildi',
        title: 'Başarılı',
        status: 200,
        userId: 'test-user'
      }));
      component.frm.patchValue(mockRequest);
      component.onSubmit(mockRequest);
      expect(mockUserAuthService.userChangePassword).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('Mevcut veri ile dialog', () => {
    let component: ChangePasswordDialogComponent;
    let fixture: ComponentFixture<ChangePasswordDialogComponent>;
    const mockRequest = new ChangePassword();

    beforeEach(async () => {
      mockRequest.userId = 'test-user';
      mockRequest.newPassword = 'oldPassword123';
      mockRequest.confirmPassword = 'oldPassword123';

      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          ChangePasswordDialogComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: mockRequest },
          { provide: UserDefinitionsAuthService, useValue: mockResponseService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' },
          { provide: UserDefinitionsAuthService, useValue: mockUserAuthService }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ChangePasswordDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('güncelleme modunda form verileri doldurulmalı', () => {
      expect(component.frm.get('userId')?.value).toBe('test-user');
      expect(component.frm.get('newPassword')?.value).toBe('oldPassword123');
      expect(component.frm.get('confirmPassword')?.value).toBe('oldPassword123');
    });

    it('güncelleme işlemi başarıyla çalışmalı', () => {
      const updateData = new ChangePassword();
      updateData.userId = 'test-user';
      updateData.newPassword = 'newPassword456';
      updateData.confirmPassword = 'newPassword456';

      mockUserAuthService.userChangePassword.and.returnValue(of({ 
        success: true, 
        message: 'Şifre başarıyla güncellendi',
        title: 'Başarılı',
        status: 200,
        userId: 'test-user'
      }));
      component.frm.patchValue(updateData);
      component.onSubmit(updateData);
      expect(mockUserAuthService.userChangePassword).toHaveBeenCalledWith(updateData);
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






















