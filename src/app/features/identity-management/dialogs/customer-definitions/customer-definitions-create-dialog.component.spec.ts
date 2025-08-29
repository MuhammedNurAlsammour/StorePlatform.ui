import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@coder-pioneers/shared';
import { RequestCustomerDefinitions } from '@features/identity-management/contracts/requests/request-customer-definitions';
import { CustomerDefinitionsService } from '@features/identity-management/services/customer-definitions.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'projects/shared/src/environments/environment.development';
import { of } from 'rxjs';
import { CustomerDefinitionsCreateDialogComponent } from './customer-definitions-create-dialog.component';

describe('CustomerDefinitionsCreateDialogComponent', () => {
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CustomerDefinitionsCreateDialogComponent>>;
  let mockCustomerDefinitionsService: jasmine.SpyObj<CustomerDefinitionsService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
    const customerDefinitionsServiceSpy = jasmine.createSpyObj('CustomerDefinitionsService', ['create', 'update']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['success', 'error']);
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    mockDialogRef = dialogRefSpy;
    mockCustomerDefinitionsService = customerDefinitionsServiceSpy;
    mockAlertService = alertServiceSpy;
    mockSpinnerService = spinnerServiceSpy;
  });

  describe('Boş veri ile dialog', () => {
    let component: CustomerDefinitionsCreateDialogComponent;
    let fixture: ComponentFixture<CustomerDefinitionsCreateDialogComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          CustomerDefinitionsCreateDialogComponent,
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: null },
          { provide: CustomerDefinitionsService, useValue: mockCustomerDefinitionsService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' },
          provideEnvironmentNgxMask(),

        ]
      }).compileComponents();

      fixture = TestBed.createComponent(CustomerDefinitionsCreateDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('bileşen başarıyla oluşturulmalı', () => {
      expect(component).toBeTruthy();
    });

    it('dialog başlığı ve ikonu doğru ayarlanmalı', () => {
      expect(component.dialogTitle).toBe('Müşteri Tanımı Ekleme');
      expect(component.titleIcon).toBe('account_circle');
    });

    it('form doğru şekilde başlatılmalı', () => {
      expect(component.frm).toBeDefined();
      expect(component.frm.get('id')).toBeTruthy();
      expect(component.frm.get('name')).toBeTruthy();
      expect(component.frm.get('email')).toBeTruthy();
      expect(component.frm.get('phoneNumber')).toBeTruthy();
    });

    it('name alanı zorunlu olmalı', () => {
      const nameControl = component.frm.get('name');
      expect(nameControl?.hasError('required')).toBeTruthy();
      nameControl?.setValue('Test Müşteri');
      expect(nameControl?.hasError('required')).toBeFalsy();
    });

    it('email alanı zorunlu ve geçerli format olmalı', () => {
      const emailControl = component.frm.get('email');
      expect(emailControl?.hasError('required')).toBeTruthy();
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();
      emailControl?.setValue('test@example.com');
      expect(emailControl?.hasError('email')).toBeFalsy();
      expect(emailControl?.hasError('required')).toBeFalsy();
    });

    it('phoneNumber alanı zorunlu olmalı', () => {
      const phoneControl = component.frm.get('phoneNumber');
      expect(phoneControl?.hasError('required')).toBeTruthy();
      phoneControl?.setValue('1234567890');
      expect(phoneControl?.hasError('required')).toBeFalsy();
    });

    it('frmControls getter doğru kontrolleri döndürmeli', () => {
      const controls = component.frmControls;
      expect(controls).toBeDefined();
      expect(controls['name']).toBeTruthy();
      expect(controls['email']).toBeTruthy();
      expect(controls['phoneNumber']).toBeTruthy();
    });

    it('geçersiz form gönderildiğinde hata gösterilmeli', () => {
      component.frm.get('name')?.setValue('');
      component.frm.get('email')?.setValue('');
      component.frm.get('phoneNumber')?.setValue('');
      expect(component.frm.valid).toBeFalsy();
    });

    it('boş veri ile dialog açıldığında formda null değerler olmalı', () => {
      expect(component.frm.get('id')?.value).toBeNull();
      expect(component.frm.get('name')?.value).toBe('');
      expect(component.frm.get('email')?.value).toBe('');
      expect(component.frm.get('phoneNumber')?.value).toBe('');
    });

  
  });

  describe('Mevcut veri ile dialog', () => {
    let component: CustomerDefinitionsCreateDialogComponent;
    let fixture: ComponentFixture<CustomerDefinitionsCreateDialogComponent>;
    const mockRequest = new RequestCustomerDefinitions();
    
    beforeEach(async () => {
      mockRequest.id = '1';
      mockRequest.name = 'Test Müşteri';
      mockRequest.email = 'test@example.com';
      mockRequest.phoneNumber = '1234567890';

      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          CustomerDefinitionsCreateDialogComponent,

        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: mockRequest },
          { provide: CustomerDefinitionsService, useValue: mockCustomerDefinitionsService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' },
          provideEnvironmentNgxMask(),
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(CustomerDefinitionsCreateDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('güncelleme modunda form verileri doldurulmalı', () => {
      expect(component.frm.get('id')?.value).toBe('1');
      expect(component.frm.get('name')?.value).toBe('Test Müşteri');
      expect(component.frm.get('email')?.value).toBe('test@example.com');
      expect(component.frm.get('phoneNumber')?.value).toBe('1234567890');
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



















