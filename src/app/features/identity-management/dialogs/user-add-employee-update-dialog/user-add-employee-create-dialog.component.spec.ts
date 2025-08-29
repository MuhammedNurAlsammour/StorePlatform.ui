import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@coder-pioneers/shared';
import { EmployeeDefinitionSelectService } from '@features/identity-management/services/employee-definition-select.service';
import { EmployeesDefinitionsService } from '@features/identity-management/services/employees-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'projects/shared/src/environments/environment.development';
import { UserAddEmployeeCreateDialogComponent } from './user-add-employee-create-dialog.component';

describe('UserAddEmployeeCreateDialogComponent', () => {
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<UserAddEmployeeCreateDialogComponent>>;
  let mockEmployeesDefinitionsService: jasmine.SpyObj<EmployeesDefinitionsService>;
  let mockEmployeeDefinitionSelectService: jasmine.SpyObj<EmployeeDefinitionSelectService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
    const employeesDefinitionsServiceSpy = jasmine.createSpyObj('EmployeesDefinitionsService', ['userUpdateEmployee']);
    const employeeDefinitionSelectServiceSpy = jasmine.createSpyObj('EmployeeDefinitionSelectService', ['readEmployeeSelecte']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['success', 'error']);
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    mockDialogRef = dialogRefSpy;
    mockEmployeesDefinitionsService = employeesDefinitionsServiceSpy;
    mockEmployeeDefinitionSelectService = employeeDefinitionSelectServiceSpy;
    mockAlertService = alertServiceSpy;
    mockSpinnerService = spinnerServiceSpy;
  });

  describe('Boş veri ile dialog', () => {
    let component: UserAddEmployeeCreateDialogComponent;
    let fixture: ComponentFixture<UserAddEmployeeCreateDialogComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          UserAddEmployeeCreateDialogComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: null },
          { provide: EmployeesDefinitionsService, useValue: mockEmployeesDefinitionsService },
          { provide: EmployeeDefinitionSelectService,
          useValue: mockEmployeeDefinitionSelectService },
          { provide: AlertService, useValue: mockAlertService },
          { provide: NgxSpinnerService, useValue: mockSpinnerService },
          { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
          { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(UserAddEmployeeCreateDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('bileşen başarıyla oluşturulmalı', () => {
      expect(component).toBeTruthy();
    });

    it('dialog başlığı ve ikonu doğru ayarlanmalı', () => {
      expect(component.dialogTitle).toBe('Personel Atama İşlemleri');
      expect(component.titleIcon).toBe('person');
    });

    it('form doğru şekilde başlatılmalı', () => {
      expect(component.frm).toBeDefined();
      expect(component.frm.get('userId')).toBeTruthy();
      expect(component.frm.get('employeeId')).toBeTruthy();
    });

    it('personel seçimi başarılı olmalı', async () => {
      const mockEmployee = {
        employeeId: '1',
        firstName: 'Test',
        lastName: 'User',
        employeeIds: ['1']
      };

      mockEmployeeDefinitionSelectService.readEmployeeSelecte.and.returnValue(Promise.resolve({
        result: [mockEmployee],
        refId: 1
      }));

      await component['loadEmployees']();
      expect(component.employees.length).toBe(1);
      expect(component.employees[0]).toEqual(mockEmployee);
    });

  });
});




















