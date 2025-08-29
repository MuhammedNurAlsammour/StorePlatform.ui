import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@coder-pioneers/shared';
import { EmployeeDefinitionSelectService } from '@common/services/select/employee-definition-select.service';
import { ListpersonelSelecteRespon } from '@contracts/entities/response-selecte-personel';
import { Create_User_Definitions } from '@features/identity-management/contracts/requests/create-user-definitions';
import { UserDefinitionsService } from '@features/identity-management/services/user-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'projects/shared/src/environments/environment.development';
import { of } from 'rxjs';
import { UserDefinitionsCreateDialogComponent } from './user-definitions-create-dialog.component';

describe('UserDefinitionsCreateDialogComponent', () => {
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<UserDefinitionsCreateDialogComponent>>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeDefinitionSelectService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;
  let mockUserDefinitionsService: jasmine.SpyObj<UserDefinitionsService>;

  beforeEach(() => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeDefinitionSelectService', ['readEmployeeSelecte']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['success', 'error']);
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const userDefinitionsServiceSpy = jasmine.createSpyObj('UserDefinitionsService', ['update']);

    mockDialogRef = dialogRefSpy;
    mockEmployeeService = employeeServiceSpy;
    mockAlertService = alertServiceSpy;
    mockSpinnerService = spinnerServiceSpy;
    mockUserDefinitionsService = userDefinitionsServiceSpy;

    // Mock the readEmployeeSelecte method to return a resolved promise
    const mockResponse: ListpersonelSelecteRespon = {
      result: [
        {
          employeeId: '1',
          employeeIds: ['1'],
          firstName: 'Test',
          lastName: 'User'
        }
      ],
      refId: 0
    };
    mockEmployeeService.readEmployeeSelecte.and.returnValue(Promise.resolve(mockResponse));

    // Mock the update method to return a successful response
    mockUserDefinitionsService.update.and.returnValue(of({ mesajDetay: 'Success' }));
  });

  describe('Boş veri ile dialog', () => {
    let component: UserDefinitionsCreateDialogComponent;
    let fixture: ComponentFixture<UserDefinitionsCreateDialogComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          UserDefinitionsCreateDialogComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: null },
          { provide: EmployeeDefinitionSelectService, useValue: mockEmployeeService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: UserDefinitionsService, useValue: mockUserDefinitionsService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(UserDefinitionsCreateDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('bileşen başarıyla oluşturulmalı', () => {
      expect(component).toBeTruthy();
    });

    it('dialog başlığı ve ikonu doğru ayarlanmalı', () => {
      expect(component.dialogTitle).toBe('Kullanıcı İşlemleri');
      expect(component.titleIcon).toBe('account_circle');
    });

    it('form doğru şekilde başlatılmalı', () => {
      expect(component.frm).toBeDefined();
      expect(component.frm.get('id')).toBeTruthy();
      expect(component.frm.get('username')).toBeTruthy();
      expect(component.frm.get('nameSurname')).toBeTruthy();
      expect(component.frm.get('password')).toBeTruthy();
      expect(component.frm.get('passwordConfirm')).toBeTruthy();
      expect(component.frm.get('employeeId')).toBeTruthy();
    });

    it('username alanı zorunlu olmalı', () => {
      const usernameControl = component.frm.get('username');
      expect(usernameControl?.hasError('required')).toBeTruthy();
      usernameControl?.setValue('testuser');
      expect(usernameControl?.hasError('required')).toBeFalsy();
    });

    it('password ve passwordConfirm eşleşmeli', () => {
      const passwordControl = component.frm.get('password');
      const passwordConfirmControl = component.frm.get('passwordConfirm');

      passwordControl?.setValue('password123');
      passwordConfirmControl?.setValue('password456');

      expect(component.frm.hasError('passwordMismatch')).toBeTruthy();

      passwordConfirmControl?.setValue('password123');
      expect(component.frm.hasError('passwordMismatch')).toBeFalsy();
    });

    it('yeni kayıt ekleme işlemi başarıyla çalışmalı', () => {
      const mockRequest = new Create_User_Definitions();
      mockRequest.username = 'testuser';
      mockRequest.nameSurname = 'Test User';
      mockRequest.password = 'password123';
      mockRequest.passwordConfirm = 'password123';
      mockRequest.employeeId = '1';
      mockRequest.institutionId = 'test-institution';
      mockRequest.customerId = 'test-customer';

      component.frm.patchValue(mockRequest);
      component.onSubmit(mockRequest);
      expect(mockDialogRef.close).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('Mevcut veri ile dialog', () => {
    let component: UserDefinitionsCreateDialogComponent;
    let fixture: ComponentFixture<UserDefinitionsCreateDialogComponent>;
    const mockRequest = new Create_User_Definitions();

    beforeEach(async () => {
      mockRequest.id = '1';
      mockRequest.username = 'testuser';
      mockRequest.nameSurname = 'Test User';
      mockRequest.password = 'password123';
      mockRequest.passwordConfirm = 'password123';
      mockRequest.employeeId = '1';
      mockRequest.institutionId = 'test-institution';
      mockRequest.customerId = 'test-customer';

      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          UserDefinitionsCreateDialogComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: mockRequest },
          { provide: EmployeeDefinitionSelectService, useValue: mockEmployeeService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: UserDefinitionsService, useValue: mockUserDefinitionsService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(UserDefinitionsCreateDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('güncelleme modunda form verileri doldurulmalı', () => {
      expect(component.frm.get('id')?.value).toBe('1');
      expect(component.frm.get('username')?.value).toBe('testuser');
      expect(component.frm.get('nameSurname')?.value).toBe('Test User');
      expect(component.frm.get('employeeId')?.value).toBe('1');
    });

    it('güncelleme işlemi başarıyla çalışmalı', () => {
      const updateData = new Create_User_Definitions();
      updateData.id = '1';
      updateData.username = 'updateduser';
      updateData.nameSurname = 'Updated User';
      updateData.password = 'newpassword123';
      updateData.passwordConfirm = 'newpassword123';
      updateData.employeeId = '2';
      updateData.institutionId = 'test-institution';
      updateData.customerId = 'test-customer';

      component.frm.patchValue(updateData);
      component.onSubmit(updateData);
      expect(mockDialogRef.close).toHaveBeenCalledWith(updateData);
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




















