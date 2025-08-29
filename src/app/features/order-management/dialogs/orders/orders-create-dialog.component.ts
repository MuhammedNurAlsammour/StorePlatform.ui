import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService, CoderBaseDialogComponent, MaterialDialogModule, MY_FORMATS } from '@coder-pioneers/shared';
import { RequestOrders } from '@features/order-management/contracts/requests/request-orders';
import { OrderItemsService } from '@features/order-management/services/order-items.service';
import { OrdersService } from '@features/order-management/services/orders.service';
import { BaseDialogComponent, FormFieldConfig } from '@shared/components/base/dialog/base-dialog/base-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-orders-create-dialog',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MaterialDialogModule
  ],
  templateUrl: './orders-create-dialog.component.html',
  styleUrl: './orders-create-dialog.component.scss',
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
export class OrdersCreateDialogComponent
  extends CoderBaseDialogComponent<OrdersCreateDialogComponent>
  implements OnInit {
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];
  isFormVisible: boolean = false;
  hascearte:boolean= false;
  constructor(
    dialogRef: MatDialogRef<OrdersCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestOrders,
    alertService: AlertService,
    spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private OrdersService: OrdersService,
    private OrderItemsService: OrderItemsService,
  )
  {
    super(dialogRef, spinner, alertService);
    this.dialogTitle = 'Sipariş İşlemleri';
    this.titleIcon = 'add';
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
      rowIsActive: [true],
      rowIsDeleted: [false],
      rowCreatedDate: [new Date()],
      rowUpdatedDate: [new Date()],
      authCustomerId: [customerId],
      authUserId: [userId],
      customerId: [customerId],
      institutionId:[institutionId],
      employeeId: [employeeId],
      userId: [userId],
      //yeni alanlar
      cartId: [null,Validators.required],
      totalAmount: [null,Validators.required],
      productId: [null,Validators.required],
      quantity: [null,Validators.required],
    });

    // Setup fields configuration for BaseDialogComponent
    this.setupFieldsConfig();

    if (this.data?.id || this.data?.cartId) {
      this.frm.patchValue(this.data);
    }
  }
  //#endregion


  //#region satır ve sütün yapılandırma
  private setupFieldsConfig(): void {
    this.fields = [
      {
        name: 'quantity',
        label: 'Adet',
        type: 'number',
        required: true,
        placeholder: 'Adet giriniz',
        col: 'col', // col sınıfı (sayı olmadan)
        rowStart: true
      },
      {
        name: 'totalAmount',
        label: 'Toplam Tutar',
        type: 'number',
        required: true,
        placeholder: 'Toplam tutar giriniz',
        col: 'col', // col sınıfı (sayı olmadan)
        rowEnd: true // Satır sonu
      },
    ];
  }
  //#endregion

  //#region ngOnInit
  ngOnInit() { }
  //#endregion

  //#region Getters
  get frmControls() {
    return this.frm?.controls;
  }
  //#endregion

  //#region OnSubmit
  override onSubmit(requestOrders: RequestOrders)  {
    const numericId = this.data?.id || undefined;

    this.submitForm(
      (data) => this.OrdersService.create(data) && this.OrderItemsService.post1(data),
      (data) => this.OrdersService.update(data),
      requestOrders,
      numericId
    );
  }
  //#endregion
}







