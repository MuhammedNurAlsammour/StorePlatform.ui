import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@coder-pioneers/shared';
import { RequestTicketPayment } from '@features/definitions/contracts/requests/request-ticket-payment';
import { TicketPaymentService } from '@features/definitions/services/ticket-payment.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'projects/shared/src/environments/environment.development.development';
import { of } from 'rxjs';
import { TicketPaymentCreateDialogComponent } from './ticket-payment-create-dialog.component';

describe('TicketPaymentCreateDialogComponent', () => {
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<TicketPaymentCreateDialogComponent>>;
  let mockTicketPaymentService: jasmine.SpyObj<TicketPaymentService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
    const ticketPaymentServiceSpy = jasmine.createSpyObj('TicketPaymentService', ['create', 'update']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['success', 'error']);
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    mockDialogRef = dialogRefSpy;
    mockTicketPaymentService = ticketPaymentServiceSpy;
    mockAlertService = alertServiceSpy;
    mockSpinnerService = spinnerServiceSpy;
  });

  describe('Boş veri ile dialog', () => {
    let component: TicketPaymentCreateDialogComponent;
    let fixture: ComponentFixture<TicketPaymentCreateDialogComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          TicketPaymentCreateDialogComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: null },
          { provide: TicketPaymentService, useValue: mockTicketPaymentService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(TicketPaymentCreateDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('bileşen başarıyla oluşturulmalı', () => {
      expect(component).toBeTruthy();
    });

    it('dialog başlığı ve ikonu doğru ayarlanmalı', () => {
      expect(component.dialogTitle).toBe('Yemek Kartı Tanımları');
      expect(component.titleIcon).toBe('approval');
    });

    it('form doğru şekilde başlatılmalı', () => {
      expect(component.frm).toBeDefined();
      expect(component.frm.get('id')).toBeTruthy();
      expect(component.frm.get('year')).toBeTruthy();
      expect(component.frm.get('month')).toBeTruthy();
      expect(component.frm.get('mealPrice')).toBeTruthy();
    });

    it('mealPrice alanı zorunlu olmalı', () => {
      const mealPriceControl = component.frm.get('mealPrice');
      expect(mealPriceControl?.hasError('required')).toBeTruthy();
      mealPriceControl?.setValue(100);
      expect(mealPriceControl?.hasError('required')).toBeFalsy();
    });

    it('frmControls getter doğru kontrolleri döndürmeli', () => {
      const controls = component.frmControls;
      expect(controls).toBeDefined();
      expect(controls['year']).toBeTruthy();
      expect(controls['month']).toBeTruthy();
      expect(controls['mealPrice']).toBeTruthy();
      expect(controls['id']).toBeTruthy();
    });

    it('geçersiz form gönderildiğinde hata gösterilmeli', () => {
      component.frm.get('mealPrice')?.setValue('');
      expect(component.frm.valid).toBeFalsy();
    });

    it('boş veri ile dialog açıldığında formda null değerler olmalı', () => {
      expect(component.frm.get('id')?.value).toBeNull();
      expect(component.frm.get('year')?.value).toBeNull();
      expect(component.frm.get('month')?.value).toBeNull();
      expect(component.frm.get('mealPrice')?.value).toBeNull();
    });

    it('yeni kayıt ekleme işlemi başarıyla çalışmalı', () => {
      const mockRequest = new RequestTicketPayment();
      mockRequest.year = 2024;
      mockRequest.month = 1;
      mockRequest.mealPrice = 100;
      mockRequest.id = null;
      mockRequest.createdUserId = 'test-user';
      mockRequest.customerId = 'test-customer';
      mockRequest.institutionId = 'test-institution';
      mockTicketPaymentService.create.and.returnValue(of({ success: true }));
      component.frm.patchValue(mockRequest);
      component.onSubmit(mockRequest);
      expect(mockTicketPaymentService.create).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('Mevcut veri ile dialog', () => {
    let component: TicketPaymentCreateDialogComponent;
    let fixture: ComponentFixture<TicketPaymentCreateDialogComponent>;
    const mockRequest = new RequestTicketPayment();
    beforeEach(async () => {
      mockRequest.id = '1';
      mockRequest.year = 2024;
      mockRequest.month = 1;
      mockRequest.mealPrice = 100;
      mockRequest.createdUserId = 'test-user';
      mockRequest.customerId = 'test-customer';
      mockRequest.institutionId = 'test-institution';

      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          TicketPaymentCreateDialogComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: mockRequest },
          { provide: TicketPaymentService, useValue: mockTicketPaymentService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(TicketPaymentCreateDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('güncelleme modunda form verileri doldurulmalı', () => {
      expect(component.frm.get('id')?.value).toBe('1');
      expect(component.frm.get('year')?.value).toBe(2024);
      expect(component.frm.get('month')?.value).toBe(1);
      expect(component.frm.get('mealPrice')?.value).toBe(100);
    });

    it('güncelleme işlemi başarıyla çalışmalı', () => {
      const updateData = new RequestTicketPayment();
      updateData.id = '1';
      updateData.year = 2024;
      updateData.month = 2;
      updateData.mealPrice = 150;
      updateData.createdUserId = 'test-user';
      updateData.customerId = 'test-customer';
      updateData.institutionId = 'test-institution';
      mockTicketPaymentService.update.and.returnValue(of({ success: true }));
      component.frm.patchValue(updateData);
      component.onSubmit(updateData);
      expect(mockTicketPaymentService.update).toHaveBeenCalledWith(updateData);
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























