import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AlertService,
  CoderBaseDialogComponent,
  MaterialDialogModule,
  MY_FORMATS,
} from '@coder-pioneers/shared';
import { ProductResult } from '@features/product-catalog/contracts/responses/product-response';
import { ProductService } from '@features/product-catalog/services/product.service';
import { RequestCart } from '@features/shopping-cart/contracts/requests/request-cart';
import { CartService } from '@features/shopping-cart/services/cart.service';
import {
  BaseDialogComponent,
  FormFieldConfig,
} from '@shared/components/base/dialog/base-dialog/base-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cart-create-dialog',
  standalone: true,
  imports: [BaseDialogComponent, MaterialDialogModule],
  templateUrl: './cart-create-dialog.component.html',
  styleUrl: './cart-create-dialog.component.scss',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CartCreateDialogComponent
  extends CoderBaseDialogComponent<CartCreateDialogComponent>
  implements OnInit
{
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];
  isFormVisible: boolean = false;
  hascearte: boolean = false;

  // Ürün bilgileri için
  selectedProduct: ProductResult | null = null;
  unitPrice: number = 0;
  products: ProductResult[] = [];
  constructor(
    dialogRef: MatDialogRef<CartCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestCart,
    alertService: AlertService,
    spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private CartService: CartService,
    private productService: ProductService
  ) {
    super(dialogRef, spinner, alertService);
    this.dialogTitle = 'Cart Ekle';
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
      id: [null],
      rowIsActive: [true],
      rowIsDeleted: [false],
      rowCreatedDate: [new Date()],
      rowUpdatedDate: [new Date()],
      authCustomerId: [customerId],
      authUserId: [userId],
      customerId: [customerId],
      institutionId: [institutionId],
      employeeId: [employeeId],
      userId: [userId],
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0],
      disprice: [0],
    });

    // Setup fields configuration for BaseDialogComponent
    this.setupFieldsConfig();

    // Form değişikliklerini izle
    this.setupFormSubscriptions();

    if (this.data?.id) {
      this.frm.patchValue(this.data);
    }
  }
  //#endregion

  //#region Form Subscriptions
  private setupFormSubscriptions(): void {
    // ProductId değişikliklerini izle
    this.frm.get('productId')?.valueChanges.subscribe((value) => {
      this.onProductChange(value);
    });

    // Quantity değişikliklerini izle
    this.frm.get('quantity')?.valueChanges.subscribe((value) => {
      this.onQuantityChange(value);
    });
  }
  //#endregion

  //#region satır ve sütün yapılandırma
  private setupFieldsConfig(): void {
    // Her satır ayrı container ve row olarak yapılandırılacak
    this.fields = [
      {
        name: 'productId',
        label: 'Ürün',
        type: 'select',
        required: true,
        placeholder: 'Ürün seçiniz',
        col: 'col-12',
        rowStart: true,
        rowEnd: true,
        options: [], // Bu dinamik olarak doldurulacak
      },
      {
        name: 'quantity',
        label: 'Miktar',
        type: 'number',
        required: true,
        placeholder: 'Miktarı giriniz',
        col: 'col-6',
        rowStart: true,
      },
      {
        name: 'disprice',
        label: 'Toplam Fiyat',
        type: 'number',
        required: true,
        placeholder: 'Toplam fiyat (otomatik hesaplanır)',
        col: 'col-6',
        rowEnd: true,
      },
    ];

    // Price field'ı devre dışı bırak
    this.frm.get('disprice')?.disable();
  }
  //#endregion

  //#region ngOnInit
  ngOnInit() {
    this.loadProducts();
  }
  //#endregion

  //#region Load Products
  private async loadProducts(): Promise<void> {
    try {
      this.spinner.show();
      const response = await this.productService.read();

      if (response?.operationStatus && response.result?.products) {
        const productOptions = response.result.products.map(
          (product: ProductResult) => ({
            id: product.id,
            name: `${product.productName} - ${product.productPrice} TL`,
          })
        );

        // Update field options
        const productField = this.fields.find((f) => f.name === 'productId');
        if (productField) {
          productField.options = productOptions;
        }

        // Store products for reference
        this.products = response.result.products;
      }
    } catch (error) {
      this.alertService.error('Ürünler yüklenirken hata oluştu.');
      console.error('Product loading error:', error);
    } finally {
      this.spinner.hide();
    }
  }
  //#endregion

  //#region Product Change Handler
  onProductChange(productId: string): void {
    if (!productId) {
      this.selectedProduct = null;
      this.unitPrice = 0;
      this.updateTotalPrice();
      return;
    }

    // Find selected product from stored products
    this.selectedProduct =
      this.products.find((p) => p.id === productId) || null;

    if (this.selectedProduct) {
      this.unitPrice = this.selectedProduct.productPrice;
      this.updateTotalPrice();
    }
  }
  //#endregion

  //#region Quantity Change Handler
  onQuantityChange(quantity: number): void {
    this.updateTotalPrice();
  }
  //#endregion

  //#region Update Total Price
  private updateTotalPrice(): void {
    const quantity = this.frm.get('quantity')?.value || 0;
    const totalPrice = this.unitPrice * quantity;

    // Temporarily enable price field to update value, then disable it
    const dispriceControl = this.frm.get('disprice');
    const priceControl = this.frm.get('price');   

    
    if (dispriceControl) {
      dispriceControl.enable();
      dispriceControl.setValue(totalPrice);
      priceControl?.setValue(totalPrice);
      dispriceControl.disable();
    }

  }
  //#endregion

  //#region Getters
  get frmControls() {
    return this.frm?.controls;
  }
  //#endregion

  //#region OnSubmit
  override onSubmit(requestCart: RequestCart) {
    const numericId = this.data?.id || undefined;

    // Enable price field before submitting
    const priceControl = this.frm.get('disprice');
    if (priceControl) {
      priceControl.enable();
    }


    this.submitForm(
      (data) => this.CartService.create(data),
      (data) => this.CartService.update(data),
      requestCart,
      numericId
    );

    // Disable price field again after submit
    if (priceControl) {
      priceControl.disable();
    }
  }
  //#endregion
}






