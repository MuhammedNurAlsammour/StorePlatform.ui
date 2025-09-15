import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService, BaseDialogComponent, CoderBaseDialogComponent, FormFieldConfig, MaterialDialogModule } from '@coder-pioneers/shared';
import { RequestTypeOfResignation } from '@features/definitions/contracts/requests/request-type-of-resignation';
import { TypeOfResignationService } from '@features/definitions/services/type-of-resignation.service';
import { MY_FORMATS } from '@shared/pipes/date-format';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-type-of-resignation',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MaterialDialogModule
  ],
  templateUrl: './type-of-resignation-create-dialog.component.html',
  styleUrl: './type-of-resignation-create-dialog.component.scss',
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
export class TypeOfResignationCreateDialogComponent
  extends CoderBaseDialogComponent<TypeOfResignationCreateDialogComponent>
  implements OnInit {
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];
  isFormVisible: boolean = false;
  hascearte:boolean= false;

  constructor(
    dialogRef: MatDialogRef<TypeOfResignationCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestTypeOfResignation,
    alertService: AlertService,
    spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private typeOfResignationService: TypeOfResignationService,
  )
  {
    super(dialogRef, spinner, alertService);
    this.dialogTitle = 'İstifa İşlemleri';
    this.titleIcon = 'approval';
    this.initializeForm();
  }

  // #region Form İşlemleri
  private initializeForm(): void {
    const customerId = sessionStorage.getItem('customerId') || null;
    const institutionId = sessionStorage.getItem('institutionId') || null;
    const userId = sessionStorage.getItem('userId');
    const employeeId = sessionStorage.getItem('employeeId');

    this.frm = this.formBuilder.group({
      id:[null],
      customerId: [customerId],
      institutionId:[institutionId],
      updateUserId: [userId],
      isActive: [1],
      typeName: [null,[Validators.required]],
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

  override onSubmit(requestTypeOfResignation: RequestTypeOfResignation)  {
    const numericId = this.data?.id || undefined;

    this.submitForm(
      (data) => this.typeOfResignationService.create(data),
      (data) => this.typeOfResignationService.update(data),
      requestTypeOfResignation,
      numericId
    );
  }
}























