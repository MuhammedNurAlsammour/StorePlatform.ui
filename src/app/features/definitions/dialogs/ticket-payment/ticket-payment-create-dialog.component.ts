import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialDialogModule } from '@coder-pioneers/shared';
import { MY_FORMATS } from '@shared/pipes/date-format';
import { List_Id_And_Names } from '@coder-pioneers/shared';
import { AlertService } from '@coder-pioneers/shared';
import { RequestTicketPayment } from '@features/definitions/contracts/requests/request-ticket-payment';
import { TicketPaymentService } from '@features/definitions/services/ticket-payment.service';
import { BaseDialogComponent, FormFieldConfig } from '@coder-pioneers/shared';
import { CoderBaseDialogComponent } from '@coder-pioneers/shared';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-ticket-payment',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MaterialDialogModule
  ],
  templateUrl: './ticket-payment-create-dialog.component.html',
  styleUrl: './ticket-payment-create-dialog.component.scss',
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
export class TicketPaymentCreateDialogComponent
  extends CoderBaseDialogComponent<TicketPaymentCreateDialogComponent>
  implements OnInit {
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];
  isFormVisible: boolean = false;

  years: List_Id_And_Names[] = [
    {id: 2025, name: '2025'},
    {id: 2026, name: '2026'},
    {id: 2027, name: '2027'},
    {id: 2028, name: '2028'},
    {id: 2029, name: '2029'},
    {id: 2030, name: '2030'},
    {id: 2031, name: '2031'},
    {id: 2032, name: '2032'},
    {id: 2033, name: '2033'},
    {id: 2034, name: '2034'},
    {id: 2035, name: '2035'},
    {id: 2036, name: '2036'},
    {id: 2037, name: '2037'},
    {id: 2038, name: '2038'},
    {id: 2039, name: '2039'},
    {id: 2040, name: '2040'},
    {id: 2041, name: '2041'},
    {id: 2042, name: '2042'},
    {id: 2043, name: '2043'},
    {id: 2044, name: '2044'},
    {id: 2045, name: '2045'},
    {id: 2046, name: '2046'},
    {id: 2047, name: '2047'},
    {id: 2048, name: '2048'},
    {id: 2049, name: '2049'},
    {id: 2050, name: '2050'},
  ];

  months: List_Id_And_Names[] = [
    {id: 1, name: 'Ocak'},
    {id: 2, name: 'Şubat'},
    {id: 3, name: 'Mart'},
    {id: 4, name: 'Nisan'},
    {id: 5, name: 'Mayıs'},
    {id: 6, name: 'Haziran'},
    {id: 7, name: 'Temmuz'},
    {id: 8, name: 'Ağustos'},
    {id: 9, name: 'Eylül'},
    {id: 10, name: 'Ekim'},
    {id: 11, name: 'Kasım'},
    {id: 12, name: 'Aralık'},
  ];
  constructor(
    dialogRef: MatDialogRef<TicketPaymentCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestTicketPayment,
    alertService: AlertService,
    spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private TicketPaymentService: TicketPaymentService,

  )
  {
    super(dialogRef, spinner, alertService);
    this.dialogTitle = 'Yemek Kartı Tanımları';
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
      createdUserId: [userId],
      updatedUserId: [userId],
      year: [null],
      month: [null],
      mealPrice: [null,[Validators.required]],
    });

    if (this.data?.id) {
      this.frm.patchValue(this.data);
    }
  }

  ngOnInit() {

  }

  get frmControls() {
    return this.frm?.controls;
  }

  override onSubmit(requestTicketPayment: RequestTicketPayment)  {
    const numericId = this.data?.id || undefined;

    this.submitForm(
      (data) => this.TicketPaymentService.create(data),
      (data) => this.TicketPaymentService.update(data),
      requestTicketPayment,
      numericId
    );
  }
}




















