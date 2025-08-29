import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService,FormFieldConfig, MaterialDialogModule } from '@coder-pioneers/shared';
import { ChangePassword } from '@features/identity-management/contracts/requests/change-password';
import { UserDefinitionsAuthService } from '@features/identity-management/services/user-definitions-auth.service';
import { BaseDialogComponent } from '@shared/components/base/dialog/base-dialog/base-dialog.component';
import { CoderBaseDialogComponent } from '@coder-pioneers/shared';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MaterialDialogModule,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss'
})
export class ChangePasswordDialogComponent
  extends CoderBaseDialogComponent<ChangePasswordDialogComponent>
  implements OnInit {
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];

  hide = true;
  hided = true;

  constructor(
    dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:ChangePassword,
    spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private userDefinitionsAuthService: UserDefinitionsAuthService,
    alertService: AlertService
  )
  {
    super(dialogRef,spinner,alertService);
    this.dialogTitle = 'Müşteri Tanımı Ekleme';
    this.titleIcon = 'account_circle';
    this.initializeForm();
  }

  private initializeForm(): void {
    this.frm = this.formBuilder.group({
      userId: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
    if (this.data?.userId) {
      this.frm.patchValue(this.data);
    }
  }

  ngOnInit() {}

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value &&
      confirmPassword.value &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  get frmControls() {
    return this.frm?.controls;
  }

  onSubmit(changePassword: ChangePassword) {
    if (this.frm?.invalid)
      return;
      this.spinner.show('s2');
      (this.userDefinitionsAuthService.userChangePassword(changePassword))
      .subscribe(result => {
        this.spinner.hide('s2');
        const susccessMessage: string = result?.message || 'Başarıyla değiştirildi';
        this.alertService.success(susccessMessage);
        this.dialogRef.close();
      },(errorResponse: HttpErrorResponse) => {
        const errorMessage: string = errorResponse?.error?.message;
        this.alertService.error(errorMessage);
        this.spinner.hide('s2');
       });
    this.spinner.hide('s2');
  }
}





















