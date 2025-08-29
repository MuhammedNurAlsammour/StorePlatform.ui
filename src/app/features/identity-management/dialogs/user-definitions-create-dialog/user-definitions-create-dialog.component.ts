import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService, CoderBaseDialogComponent, FormFieldConfig, MaterialDialogModule } from '@coder-pioneers/shared';
import { ListpersonelSelecteRespon, ResultSelecte } from '@contracts/response-selecte-personel';
import { Create_User_Definitions } from '@features/identity-management/contracts/requests/create-user-definitions';
import { ResultCustomerDefinitions } from '@features/identity-management/contracts/responses/customer-definitions-response';
import { EmployeeDefinitionSelectService } from '@features/identity-management/services/employee-definition-select.service';
import { UserDefinitionsService } from '@features/identity-management/services/user-definitions.service';
import { BaseDialogComponent } from '@shared/components/base/dialog/base-dialog/base-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-definitions-create-dialog',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MaterialDialogModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './user-definitions-create-dialog.component.html',
  styleUrl: './user-definitions-create-dialog.component.scss'
})
export class UserDefinitionsCreateDialogComponent
  extends CoderBaseDialogComponent<UserDefinitionsCreateDialogComponent>
  implements OnInit {
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];
  Personels: ResultSelecte[] = [];
  customers: ResultCustomerDefinitions[] = [];

  hide = true;
  hided = true;
  constructor(
    dialogRef: MatDialogRef<UserDefinitionsCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:Create_User_Definitions,
    alertService: AlertService,
    spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private employeeDefinitionSelectService: EmployeeDefinitionSelectService,
    private userDefinitionService: UserDefinitionsService,
  )
  {
    super(dialogRef,spinner,alertService);
    this.dialogTitle = 'Kullanıcı İşlemleri';
    this.titleIcon = 'account_circle';
    this.initializeForm();
  }

// #region Form İşlemleri
private initializeForm(): void {
  const institutionId = sessionStorage.getItem('institutionId') || null;
  const customerId = sessionStorage.getItem('customerId') || null;

  this.getEmployees();
  // this.getCustomers();
  this.frm = this.formBuilder.group({
    id: [null],
    username: ['', [Validators.required]],
    nameSurname: ['' , [Validators.required]],
    institutionId: [institutionId],
    customerId:[customerId],
    password: ['', [Validators.required]],
    passwordConfirm: ['', [Validators.required]],
    employeeId: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });
  if (this.data?.id) {
    this.frm.patchValue(this.data);
  }
}
//#endregion

//#region ngOnInit
// Sayfa yüklendiğinde ilk çalışacak işlemler
ngOnInit() {
}
//#endregion


//#region Listeleme
// Verileri listeleyen fonksiyonları
getEmployees(): void{
  const customerId = sessionStorage.getItem('customerId') || null;
  const institutionId = sessionStorage.getItem('institutionId') || null;
  this.employeeDefinitionSelectService.readEmployeeSelecte(customerId,institutionId).then(
    (response: ListpersonelSelecteRespon | undefined) => {
      if (response && response.result) {
        this.Personels = response.result;
      }
    },
    (error: any) => {
      this.alertService.error('Server ile iletişim sağlanamadı lütfen daha sonra tekrar deneyiniz.');
    }
  );
}

passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('passwordConfirm');
  if (
    password &&
    confirmPassword &&
    confirmPassword.value !== null &&
    password.value !==
    confirmPassword.value
  ) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    if (confirmPassword) {
      confirmPassword.setErrors(null);
    }
    return null;
  }
}
//#endregion

//#region Form İşlemleri
get frmControls() {
  return this.frm?.controls;
}
//#endregion


onSubmit(data: Create_User_Definitions) {
  const emp = this.Personels.find(x=>x.employeeId == data.employeeId);
  this.frmControls?.['nameSurname'].setValue(emp?.firstName + ' ' + emp?.lastName);
  if (this.frm?.invalid)
    return;
  const numericId = this.data?.userId || undefined;

  this.submitForm(
    (data) => this.userDefinitionService.update(data,'UpdateEmployeeUserId','Employee'),
    (data) => this.userDefinitionService.update(data,'UpdateEmployeeUserId','Employee'),
    data,
    numericId
  );
}

}

export enum addState {
Close
}




















