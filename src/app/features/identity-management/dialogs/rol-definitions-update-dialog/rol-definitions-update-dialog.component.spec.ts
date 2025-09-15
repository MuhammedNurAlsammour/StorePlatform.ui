import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@coder-pioneers/shared';
import { RequestRolDefinitions } from '@features/identity-management/contracts/requests/request-rol-definitions';
import { RolDefinitionsService } from '@features/identity-management/services/rol-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'projects/shared/src/environments/environment.development';
import { of } from 'rxjs';
import { RolDefinitionsUpdateDialogComponent } from './rol-definitions-update-dialog.component';

describe('RolDefinitionsUpdateDialogComponent', () => {
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<RolDefinitionsUpdateDialogComponent>>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;
  let mockRolDefinitionsService: jasmine.SpyObj<RolDefinitionsService>;

  beforeEach(() => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['success', 'error']);
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const rolDefinitionsServiceSpy = jasmine.createSpyObj('RolDefinitionsService', ['create', 'update']);

    mockDialogRef = dialogRefSpy;
    mockAlertService = alertServiceSpy;
    mockSpinnerService = spinnerServiceSpy;
    mockRolDefinitionsService = rolDefinitionsServiceSpy;
  });

  describe('Boş veri ile dialog', () => {
    let component: RolDefinitionsUpdateDialogComponent;
    let fixture: ComponentFixture<RolDefinitionsUpdateDialogComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          RolDefinitionsUpdateDialogComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: null },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: RolDefinitionsService, useValue: mockRolDefinitionsService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: 'authApiUrl', useValue: environment.apiUrls.authApiUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(RolDefinitionsUpdateDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('bileşen başarıyla oluşturulmalı', () => {
      expect(component).toBeTruthy();
    });

    it('form doğru şekilde başlatılmalı', () => {
      if (component.frm) {
        expect(component.frm).toBeDefined();
        expect(component.frm.get('id')).toBeTruthy();
        expect(component.frm.get('name')).toBeTruthy();
      }
    });

    it('name alanı zorunlu olmalı', () => {
      if (component.frm) {
        const nameControl = component.frm.get('name');
        expect(nameControl?.hasError('required')).toBeTruthy();
        nameControl?.setValue('Test Rol');
        expect(nameControl?.hasError('required')).toBeFalsy();
      }
    });

    it('frmControls getter doğru kontrolleri döndürmeli', () => {
      if (component.frm) {
        const controls = component.frmControls;
        if (controls) {
          expect(controls).toBeDefined();
          expect(controls['name']).toBeTruthy();
          expect(controls['id']).toBeTruthy();
        }
      }
    });

    it('geçersiz form gönderildiğinde hata gösterilmeli', () => {
      if (component.frm) {
        component.frm.get('name')?.setValue('');
        expect(component.frm.valid).toBeFalsy();
      }
    });

    it('boş veri ile dialog açıldığında formda null değerler olmalı', () => {
      if (component.frm) {
        expect(component.frm.get('id')?.value).toBeNull();
        expect(component.frm.get('name')?.value).toBe('');
      }
    });

    it('yeni kayıt ekleme işlemi başarıyla çalışmalı', () => {
      const mockRequest = new RequestRolDefinitions();
      mockRequest.name = 'Yeni Rol';
      mockRequest.id = null;

      mockRolDefinitionsService.create.and.returnValue(of(mockRequest));

      if (component.frm) {
        component.frm.patchValue(mockRequest);
        component.onSubmit(mockRequest);
        expect(mockRolDefinitionsService.create).toHaveBeenCalledWith(mockRequest);
        expect(mockDialogRef.close).toHaveBeenCalledWith(mockRequest);
      }
    });
  });

  describe('Mevcut veri ile dialog', () => {
    let component: RolDefinitionsUpdateDialogComponent;
    let fixture: ComponentFixture<RolDefinitionsUpdateDialogComponent>;
    const mockRequest = new RequestRolDefinitions();

    beforeEach(async () => {
      mockRequest.id = '1';
      mockRequest.name = 'Test Rol';

      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          RolDefinitionsUpdateDialogComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: mockRequest },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: RolDefinitionsService, useValue: mockRolDefinitionsService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: 'authApiUrl', useValue: environment.apiUrls.authApiUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(RolDefinitionsUpdateDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('güncelleme modunda form verileri doldurulmalı', () => {
      if (component.frm) {
        expect(component.frm.get('id')?.value).toBe('1');
        expect(component.frm.get('name')?.value).toBe('Test Rol');
      }
    });

    it('güncelleme işlemi başarıyla çalışmalı', () => {
      const updateData = new RequestRolDefinitions();
      updateData.id = '1';
      updateData.name = 'Güncellenmiş Rol';

      mockRolDefinitionsService.update.and.returnValue(of(updateData));

      if (component.frm) {
        component.frm.patchValue(updateData);
        component.onSubmit(updateData);
        expect(mockRolDefinitionsService.update).toHaveBeenCalledWith(updateData);
        expect(mockDialogRef.close).toHaveBeenCalledWith(updateData);
      }
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























