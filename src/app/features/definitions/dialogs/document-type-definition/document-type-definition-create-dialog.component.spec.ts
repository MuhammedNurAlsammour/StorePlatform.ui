import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@coder-pioneers/shared';
import { RequestDocumentTypeDefinition } from '@features/definitions/contracts/requests/request-document-type-definition';
import { DocumentTypeDefinitionService } from '@features/definitions/services/document-type-definition.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'projects/shared/projects/shared/src/environments/environment.development.development';
import { of } from 'rxjs';
import { DocumentTypeDefinitionCreateDialogComponent } from './document-type-definition-create-dialog.component';

describe('DocumentTypeDefinitionCreateDialogComponent', () => {{
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DocumentTypeDefinitionCreateDialogComponent>>;
  let mockResponseService: jasmine.SpyObj<DocumentTypeDefinitionService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {{
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
    const documentTypeServiceSpy = jasmine.createSpyObj('DocumentTypeDefinitionService', ['create', 'update']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['success', 'error']);
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    mockDialogRef = dialogRefSpy;
    mockResponseService = documentTypeServiceSpy;
    mockAlertService = alertServiceSpy;
    mockSpinnerService = spinnerServiceSpy;
  }});

  describe('Boş veri ile dialog', () => {{
    let component: DocumentTypeDefinitionCreateDialogComponent;
    let fixture: ComponentFixture<DocumentTypeDefinitionCreateDialogComponent>;

    beforeEach(async () => {{
      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          DocumentTypeDefinitionCreateDialogComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: null },
          { provide: DocumentTypeDefinitionService, useValue: mockResponseService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(DocumentTypeDefinitionCreateDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }});

    it('bileşen başarıyla oluşturulmalı', () => {{
      expect(component).toBeTruthy();
    }});

    it('dialog başlığı ve ikonu doğru ayarlanmalı', () => {{
      expect(component.dialogTitle).toBe('Doküman İşlemleri');
      expect(component.titleIcon).toBe('approval');
    }});

    it('form doğru şekilde başlatılmalı', () => {{
      expect(component.frm).toBeDefined();
      expect(component.frm.get('id')).toBeTruthy();
      expect(component.frm.get('name')).toBeTruthy();
    }});

    it('documentTypeName alanı zorunlu olmalı', () => {
      const nameControl = component.frm.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();
      expect(nameControl?.hasError('required')).toBeTruthy();
      nameControl?.setValue('Test Doküman');
      expect(nameControl?.hasError('required')).toBeFalsy();
    });

    it('frmControls getter doğru kontrolleri döndürmeli', () => {
      const controls = component.frmControls;
      expect(controls).toBeDefined();
      expect(controls['name']).toBeTruthy();
    });

    it('geçersiz form gönderildiğinde hata gösterilmeli', () => {
      const nameControl = component.frm.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();
      component.frm.updateValueAndValidity();
      expect(component.frm.valid).toBeFalsy();
    });

    it('boş veri ile dialog açıldığında formda null değerler olmalı', () => {{
      expect(component.frm.get('id')?.value).toBeNull();
      expect(component.frm.get('name')?.value).toBeNull();
    }});

    it('yeni kayıt ekleme işlemi başarıyla çalışmalı', () => {{
      const mockRequest = new RequestDocumentTypeDefinition();
      mockRequest.name = 'Test Doküman';      
      mockRequest.id = null;
      mockRequest.createdAt = new Date();
      mockRequest.isActive = 1;
      mockRequest.userId = 'test-user';
      mockRequest.customerId = 'test-customer';
      mockRequest.institutionId = 'test-institution';
      mockResponseService.create.and.returnValue(of({ success: true }));
      component.frm.patchValue(mockRequest);
      component.onSubmit(mockRequest);
      expect(mockResponseService.create).toHaveBeenCalledWith(mockRequest);
    }});
  }});

  describe('Mevcut veri ile dialog', () => {{
    let component: DocumentTypeDefinitionCreateDialogComponent;
    let fixture: ComponentFixture<DocumentTypeDefinitionCreateDialogComponent>;
    const mockRequest = new RequestDocumentTypeDefinition();
    beforeEach(async () => {{
      mockRequest.id = '1';
      mockRequest.name = 'Test Doküman';
      mockRequest.createdAt = new Date();
      mockRequest.isActive = 1;
      mockRequest.userId = 'test-user';
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
          DocumentTypeDefinitionCreateDialogComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: mockRequest },
          { provide: DocumentTypeDefinitionService, useValue: mockResponseService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(DocumentTypeDefinitionCreateDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }});

    it('güncelleme modunda form verileri doldurulmalı', () => {{
      expect(component.frm.get('id')?.value).toBe('1');
      expect(component.frm.get('name')?.value).toBe('Test Doküman');
    }});

    it('güncelleme işlemi başarıyla çalışmalı', () => {{
      const updateData = new RequestDocumentTypeDefinition();
      updateData.id = '1';
      updateData.createdAt = new Date();
      updateData.isActive = 1;
      updateData.userId = 'test-user';
      updateData.updateUserId = 'update-user';
      updateData.customerId = 'test-customer';
      updateData.institutionId = 'test-institution';
      updateData.name = 'kimlik';
      mockResponseService.update.and.returnValue(of({ success: true }));
      component.frm.patchValue(updateData);
      component.onSubmit(updateData);
      expect(mockResponseService.update).toHaveBeenCalledWith(updateData);
    }});
  }});

  describe('Dialog etkileşimleri', () => {{
    it('dialog kapatıldığında afterClosed çalışmalı', () => {{
      mockDialogRef.afterClosed.and.returnValue(of(true));
      const result = mockDialogRef.afterClosed();
      result.subscribe(value => {{
        expect(value).toBe(true);
      }});
    }});
  }});
}});




















