import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService, CoderBaseDialogComponent, FormFieldConfig, MaterialDialogModule } from '@coder-pioneers/shared';
import { ResultSelecte } from '@contracts/response-selecte-personel';
import { RequestUserAddEmployee } from '@features/identity-management/contracts/requests/request-user-add-employee';
import { EmployeeDefinitionSelectService } from '@features/identity-management/services/employee-definition-select.service';
import { EmployeesDefinitionsService } from '@features/identity-management/services/employees-definitions.service';
import { BaseDialogComponent } from '@shared/components/base/dialog/base-dialog/base-dialog.component';
import { MY_FORMATS } from '@shared/pipes/date-format';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-user-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    MaterialDialogModule,
    BaseDialogComponent
  ],
  templateUrl: './user-add-employee-create-dialog.component.html',
  styleUrl: './user-add-employee-create-dialog.component.scss',
    providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class UserAddEmployeeCreateDialogComponent
  extends CoderBaseDialogComponent<UserAddEmployeeCreateDialogComponent>
  implements OnInit {
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];

  // #region listeleme İşlemleri
  filteredEmployee$!: Observable<ResultSelecte[]>;
  employees: ResultSelecte[] = [];
  // #endregion

  constructor(
    dialogRef: MatDialogRef<UserAddEmployeeCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestUserAddEmployee,
    private formBuilder: FormBuilder,
    private adapter: DateAdapter<any>,
    private employeesDefinitionsService:EmployeesDefinitionsService,
    spinner: NgxSpinnerService,
    alertService:AlertService,
    private employeeDefinitionSelectService:EmployeeDefinitionSelectService,
  )
  {
    super(dialogRef,spinner,alertService);
    this.dialogTitle = 'Personel Atama İşlemleri';
    this.titleIcon = 'person';
    this.initializeForm();
    this.setupInitialData();
  }

  // #region Form İşlemleri
  private initializeForm(): void {
    this.frm = this.formBuilder.group({
      userId: [null],
      employeeId: [null],
    });
    this.frm?.patchValue({
      ...this.data
    });
  }
  // #endregion

  ngOnInit() {
    this.loadInitialData();
    this.adapter.getFirstDayOfWeek = () => 1;
  }

  // #region personel güncelleme  yapıldı  zaman  önemli İşlemleri
  private async setupInitialData(): Promise<void> {
    await this.loadEmployees();

    if (this.data?.employeeId) {
      const selectedEmployee = this.employees.find(
        employee => employee.employeeId === this.data.employeeId
      ) || null;

      if (selectedEmployee) {
        this.frm?.patchValue({
          ...this.data,
          employeeId: selectedEmployee
        });
      }
    }
  }
  // #endregion


  // #region personel arama İşlemleri
  private async loadInitialData(): Promise<void> {
    try {
      this.spinner.show();
      await this.loadEmployees();
    } catch (error) {
      this.alertService.error('Error loading data');
    } finally {
      this.spinner.hide();
    }
  }

  private async loadEmployees(): Promise<void> {
    try {
      const response = await this.employeeDefinitionSelectService.readEmployeeSelecte();
      if (response?.result) {
        this.employees = response.result;
        this.setupEmployeeAutocomplete();
      }
    } catch (error) {
      this.alertService.error('Error loading employee data');
    }
  }

  private setupEmployeeAutocomplete(): void {
    this.filteredEmployee$ = this.frm.get('employeeId')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value?.firstName),
      map(value => typeof value === 'string' ? value : value?.lastName),
      map(name => name ? this._filterEmployees(name) : this.employees.slice()),
    );
  }

  private _filterEmployees(value: string): ResultSelecte[] {
    const filterValue = value.toLowerCase();
    return this.employees.filter(employee =>
      employee.firstName.toLowerCase().includes(filterValue) ||
      employee.lastName.toLowerCase().includes(filterValue)
    );
  }

  displayEmployeeFn(employees: ResultSelecte): string {
    return employees ? `${employees.firstName} ${employees.lastName}` : '';
  }

  onEmployeeSelected(event: MatAutocompleteSelectedEvent): void {
    this.frm?.get('employeeId')?.setValue(event.option.value);
  }
  // #endregion

  get frmControls() {
    return this.frm?.controls;
  }

  onSubmit(requestUserAddEmployee: RequestUserAddEmployee) {
    if (this.frm?.invalid)
      return;

    const updatedRequest = {
     ...requestUserAddEmployee,
    };

    const selectedEmployee = this.frm?.get('employeeId')!.value;
    if (selectedEmployee) {
      updatedRequest.employeeId = selectedEmployee.employeeId;
    }

    this.submitForm(
      (data) => this.employeesDefinitionsService.put1(updatedRequest),
      (data) => this.employeesDefinitionsService.put1(updatedRequest),
      requestUserAddEmployee,
      updatedRequest.employeeId || ''
    );
  }
}























