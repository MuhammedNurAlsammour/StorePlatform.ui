import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialDialogModule } from '@coder-pioneers/shared';
import { RequestOrderItems } from '@features/order-management/contracts/requests/request-order-items';
import { OrderItemsService } from '@features/order-management/services/order-items.service';
import { BaseDialogComponent, FormFieldConfig } from '@shared/components/base/dialog/base-dialog/base-dialog.component';
import { CoderBaseDialogComponent } from '@coder-pioneers/shared';
import { NgxSpinnerService } from 'ngx-spinner';
import { MY_FORMATS } from '@coder-pioneers/shared';
import { AlertService } from '@coder-pioneers/shared';
@Component({
  selector: 'app-order-items-create-dialog',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MaterialDialogModule
  ],
  templateUrl: './order-items-create-dialog.component.html',
  styleUrl: './order-items-create-dialog.component.scss',
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
export class OrderItemsCreateDialogComponent
  extends CoderBaseDialogComponent<OrderItemsCreateDialogComponent>
  implements OnInit {
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];
  isFormVisible: boolean = false;
  hascearte:boolean= false;
  constructor(
    dialogRef: MatDialogRef<OrderItemsCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestOrderItems,
    alertService: AlertService,
    spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private OrderItemsService: OrderItemsService,
  )
  {
    super(dialogRef, spinner, alertService);
    this.dialogTitle = 'Sipariş Ürün İşlemleri';
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
      orderId:[null], 
      productId:[null],
      quantity:[null],
      price:[null],    
    });


    if (this.data?.id || this.data?.orderId) {
      this.frm.patchValue(this.data);
    }
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
  override onSubmit(requestOrderItems: RequestOrderItems)  {
    const numericId = this.data?.id || undefined;

    this.submitForm(
      (data) => this.OrderItemsService.create(data),
      (data) => this.OrderItemsService.update(data),
      requestOrderItems,
      numericId
    );
  }
  //#endregion
}





