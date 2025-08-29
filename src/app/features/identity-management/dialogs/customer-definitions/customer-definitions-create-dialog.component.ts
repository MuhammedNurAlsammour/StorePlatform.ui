import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService, CoderBaseDialogComponent, FormFieldConfig, MaterialDialogModule } from '@coder-pioneers/shared';
import { BaseDialogComponent } from '@shared/components/base/dialog/base-dialog/base-dialog.component';
import { RequestCustomerDefinitions } from '@features/identity-management/contracts/requests/request-customer-definitions';
import { CustomerDefinitionsService } from '@features/identity-management/services/customer-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-customer-definitions',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MaterialDialogModule,

  ],
  templateUrl: './customer-definitions-create-dialog.component.html',
  styleUrl: './customer-definitions-create-dialog.component.scss',
  providers: [
    provideNativeDateAdapter()
  ],
})
export class CustomerDefinitionsCreateDialogComponent
  extends CoderBaseDialogComponent<CustomerDefinitionsCreateDialogComponent>
  implements OnInit {
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];

  constructor(
    dialogRef: MatDialogRef<CustomerDefinitionsCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestCustomerDefinitions,
    private formBuilder: FormBuilder,
    private adapter: DateAdapter<any>,
    private customerDefinitionsService:CustomerDefinitionsService,
    spinner: NgxSpinnerService,
    alertService:AlertService
  )
  {
    super(dialogRef,spinner,alertService);
    this.dialogTitle = 'Müşteri Tanımı Ekleme';
    this.titleIcon = 'account_circle';
    this.initializeForm();
  }

  private initializeForm(): void {
    this.frm = this.formBuilder.group({
      id: [null],
      name:['', [Validators.required]],
      logo:[''],
      address:[''],
      email: ['', [Validators.maxLength(200), Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      webSite:[''],
      description:[''],
      country:[''],
      city:[''],
      county:[''],
    });
    if (this.data?.id) {
      this.frm.patchValue(this.data);
    }
  }

  ngOnInit() {
    this.adapter.getFirstDayOfWeek = () => 1;
  }

  get frmControls() {
    return this.frm?.controls;
  }

  override onSubmit(requestCustomerDefinitions: RequestCustomerDefinitions)  {
    const numericId = this.data?.id || undefined;
    this.submitForm(
      (data) => this.customerDefinitionsService.create(data),
      (data) => this.customerDefinitionsService.update(data),
      requestCustomerDefinitions,
      numericId
    );
  }
}




















