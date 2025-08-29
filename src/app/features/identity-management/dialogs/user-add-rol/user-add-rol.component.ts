import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService, CoderBaseDialogComponent, FormFieldConfig, MaterialDialogModule } from '@coder-pioneers/shared';
import { RequestRolAddUser } from '@features/identity-management/contracts/requests/request-rol-add-user';
import { DataRols } from '@features/identity-management/contracts/responses/response-select-get-rol';
import { RolDefinitionsService } from '@features/identity-management/services/rol-definitions.service';
import { UserDefinitionsAuthService } from '@features/identity-management/services/user-definitions-auth.service';
import { BaseDialogComponent } from '@shared/components/base/dialog/base-dialog/base-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-add-rol',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MaterialDialogModule,
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './user-add-rol.component.html',
  styleUrl: './user-add-rol.component.scss'
})
export class UserAddRolComponent
  extends CoderBaseDialogComponent<UserAddRolComponent>
  implements OnInit {
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];
  AddRol: DataRols[] = [] ;
  totalRows: number = 0;

  constructor(
    dialogRef: MatDialogRef<UserAddRolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestRolAddUser,
    private formBuilder: FormBuilder,
    private rolDefinitionsService : RolDefinitionsService,
    private userDefinitionsAuthService: UserDefinitionsAuthService,
    alertService: AlertService,
    spinner: NgxSpinnerService,
  )
  {
    super(dialogRef,spinner,alertService);
    this.dialogTitle = 'Kullanıcı Rol Ekleme';
    this.titleIcon = 'account_circle';
    this.initializeForm();
  }

  private initializeForm(): void {
    this.frm = this.formBuilder.group({
      userId: [],
      roles: [null, [Validators.required]]
    });
    if (this.data?.userId) {
      this.frm.patchValue(this.data);
    }
  }

  ngOnInit() {
    this.loadRoles();
  }

  private async loadRoles(): Promise<void> {
    const customerId = sessionStorage.getItem('customerId') || null;
    const institutionId = sessionStorage.getItem('institutionId') || null;
     const responseTotalRows = await this.rolDefinitionsService.read(
       {
         page: 0,
         size: 1,
         customerId,
         institutionId
       }
     );

     if (responseTotalRows) {
       this.totalRows = Number(responseTotalRows.totalCount);
     }

     const responses = await this.rolDefinitionsService.read(
       {
         page: 0,
         size: this.totalRows,
         customerId,
         institutionId
       }
     );

     if (responses) {
      this.AddRol = responses.datas;
     }
  }

  get frmControls() {
    return this.frm?.controls;
  }

  override onSubmit(requestRolAddUser: RequestRolAddUser)  {
    const numericId = this.data?.userId || undefined;
    this.submitForm(
      (data) => this.userDefinitionsAuthService.createRoleToUser(data),
      (data) => this.userDefinitionsAuthService.createRoleToUser(data),
      requestRolAddUser,
      numericId
    );
  }
}




















