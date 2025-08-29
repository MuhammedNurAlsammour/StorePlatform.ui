import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService, BaseDialogComponent, CoderBaseDialogComponent, MaterialDialogModule } from '@coder-pioneers/shared';
import { RequestRolDefinitions } from '@features/identity-management/contracts/requests/request-rol-definitions';
import { DataRols } from '@features/identity-management/contracts/responses/response-select-get-rol';
import { RolDefinitionsService } from '@features/identity-management/services/rol-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-rol-definitions-update-dialog',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MaterialDialogModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './rol-definitions-update-dialog.component.html',
  styleUrl: './rol-definitions-update-dialog.component.scss'
})
export class RolDefinitionsUpdateDialogComponent
  extends CoderBaseDialogComponent<RolDefinitionsUpdateDialogComponent>
  implements OnInit {
  frm!: FormGroup;
  AddRol: DataRols[] = [];

  constructor(
    dialogRef: MatDialogRef<RolDefinitionsUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestRolDefinitions,
    private formBuilder: FormBuilder,
    private rolDefinitionsService: RolDefinitionsService,
    alertService: AlertService,
    spinner: NgxSpinnerService,
  )
  {
    super(dialogRef,spinner,alertService);
    this.dialogTitle = 'Rol İşlemleri';
    this.titleIcon = 'account_circle';
    this.initializeForm();
  }

  // #region Form İşlemleri
  private initializeForm(): void {
    this.frm = this.formBuilder.group({
      id: [],
      name: ['', [Validators.required]]
    });
    if (this.data?.id) {
      this.frm.patchValue(this.data);
    }
  }
  //#endregion

  ngOnInit() { }

  get frmControls() {
    return this.frm?.controls;
  }


  override onSubmit(RequestRolDefinitions: RequestRolDefinitions)  {
    const numericId = this.data?.id || undefined;

    this.submitForm(
      (data) => this.rolDefinitionsService.create(data),
      (data) => this.rolDefinitionsService.update(data),
      RequestRolDefinitions,
      numericId
    );
  }
}




















