import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService, CoderBaseDialogComponent, MaterialDialogModule, MY_FORMATS } from '@coder-pioneers/shared';
import { ResultSelecte } from '@contracts/response-selecte-personel';
import { RequestProduct } from '@features/product-catalog/contracts/requests/request-product';
import { CategoryResult } from '@features/product-catalog/contracts/responses/categories-response';
import { CategoriesService } from '@features/product-catalog/services/categories.service';
import { ProductService } from '@features/product-catalog/services/product.service';
import { BaseDialogComponent, FormFieldConfig } from '@shared/components/base/dialog/base-dialog/base-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-product-create-dialog',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MaterialDialogModule
  ],
  templateUrl: './product-create-dialog.component.html',
  styleUrl: './product-create-dialog.component.scss',
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
export class ProductCreateDialogComponent
  extends CoderBaseDialogComponent<ProductCreateDialogComponent>
  implements OnInit {
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];
  isFormVisible: boolean = false;
  Products: ResultSelecte[] = [];
  hascearte:boolean= false;

  // #region listeleme İşlemleri
  categories: CategoryResult[] = [];
  // #endregion

  constructor(
    dialogRef: MatDialogRef<ProductCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestProduct,
    alertService: AlertService,
    spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private ProductService: ProductService,
    private categoryService: CategoriesService,
  )
  {
    super(dialogRef, spinner, alertService);
    this.dialogTitle = 'Product Ekle';
    this.titleIcon = 'add';
    this.initializeForm();
    this.setupInitialData();
  }

  // #region Form İşlemleri
  private initializeForm(): void {
    const customerId = sessionStorage.getItem('customerId') || null;
    const institutionId = sessionStorage.getItem('institutionId') || null;
    const userId = sessionStorage.getItem('userId');
    const employeeId = sessionStorage.getItem('employeeId') || '94851aaa-b365-4524-9790-b84fcca21bb9' || null;

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

      name:                 [null,Validators.required],
      description:          [null,Validators.required],
      price:                [null,Validators.required],
      stock:                [null,Validators.required],
      categoryId:           [null],
      productId:            [null],
      hasInventoryTracking: [true],
      defaultLocation:      [null],
      barcode:              [null],
      qrCode:               [null],

    });

    // Setup fields configuration for BaseDialogComponent
    this.setupFieldsConfig();

    if (this.data?.id || this.data?.categoryId) {
      this.frm.patchValue(this.data);
    }
  }

  private setupFieldsConfig(): void {
    // Form alanlarını Bootstrap Grid sistemine göre yapılandırma
    // Her satır ayrı container ve row olarak yapılandırılacak
    this.fields = [
      // İlk satır: Ürün Adı ve Açıklaması
      {
        name: 'name',
        label: 'Ürün Adı',
        type: 'text',
        required: true,
        maxLength: 50,
        placeholder: 'Ürün adını giriniz',
        col: 'col', // col sınıfı (sayı olmadan)
        rowStart: true // Yeni satır başlangıcı
      },
      {
        name: 'description',
        label: 'Ürün Açıklaması',
        type: 'text',
        required: true,
        maxLength: 50,
        placeholder: 'Ürün açıklamasını giriniz',
        col: 'col', // col sınıfı (sayı olmadan)
        rowEnd: true // Satır sonu
      },

      // İkinci satır: Fiyat ve Stok
      {
        name: 'price',
        label: 'Ürün Fiyatı',
        type: 'number',
        required: true,
        placeholder: 'Fiyat giriniz',
        col: 'col', // col sınıfı (sayı olmadan)
        rowStart: true // Yeni satır başlangıcı
      },
      {
        name: 'stock',
        label: 'Ürün Stok',
        type: 'number',
        required: true,
        placeholder: 'Stok miktarı giriniz',
        col: 'col', // col sınıfı (sayı olmadan)
        rowEnd: true // Satır sonu
      },

      // Üçüncü satır: Kategori seçimi
      {
        name: 'categoryId',
        label: 'Kategori Seçiniz',
        type: 'selectAutocomplete',
        required: false,
        placeholder: 'Kategori ara...',
        col: 'col', // col sınıfı (sayı olmadan)
        rowStart: true, // Yeni satır başlangıcı
        rowEnd: true, // Satır sonu
        autocompleteOptions: this.categories,
        displayFn: (item: CategoryResult) => item ? item.name : '',
        filterFn: (value: string, options: CategoryResult[]) => {
          const filterValue = value.toLowerCase();
          return options.filter(option =>
            option.name.toLowerCase().includes(filterValue)
          );
        }
      },

      // Dördüncü satır: Konum ve Envanter Takibi
      {
        name: 'defaultLocation',
        label: 'Varsayılan Konum',
        type: 'text',
        required: true,
        maxLength: 100,
        placeholder: 'Örn: Depo A, Raf 1, Bölüm 2',
        col: 'col', // col sınıfı (sayı olmadan)
        rowStart: true // Yeni satır başlangıcı
      },
      {
        name: 'hasInventoryTracking',
        label: 'Envanter Takibi',
        type: 'select',
        required: true,
        col: 'col', // col sınıfı (sayı olmadan)
        rowEnd: true, // Satır sonu
        options: [
          { id: true, name: '✅ Evet - Envanter takibi yapılsın' },
          { id: false, name: '❌ Hayır - Envanter takibi yapılmasın' }
        ]
      },
      {
        name: 'barcode',
        label: 'Barkod',
        type: 'text',
        required: false,
        placeholder: 'Örn: 1234567890',
        col: 'col', // col sınıfı (sayı olmadan)
      },
      {
        name: 'qrCode',
        label: 'QR Kod',
        type: 'text',
        required: false,
        placeholder: 'Örn: https://qr.io/1234567890',
        col: 'col', // col sınıfı (sayı olmadan)
      }
    ];
  }
  //#endregion

  //#region ngOnInit
  ngOnInit() {
    this.loadInitialData();
  }
  //#endregion

  // #region Kategori güncelleme  yapıldı  zaman  önemli İşlemleri
  private setupInitialData(): void {
    // Kategorileri yükleme işlemini ngOnInit'e bırak
    // Burada sadece form varsayılan değerlerini ayarla

    // Set default values for new/existing products
    if (!this.data?.id || !this.data?.categoryId) {
      // Yeni ürün için varsayılan değerler
      this.frm?.patchValue({
        hasInventoryTracking: true,
        defaultLocation: ''
      });
    } else {
      // Mevcut ürün için eksik değerleri ayarla
      if (this.data.hasInventoryTracking === null || this.data.hasInventoryTracking === undefined) {
        this.frm?.patchValue({
          hasInventoryTracking: true
        });
      }
      if (!this.data.defaultLocation) {
        this.frm?.patchValue({
          defaultLocation: ''
        });
      }
    }
  }

    /**
   * Update işlemi için kategori seçimini ayarla
   */
  private setCategoryForUpdate(): void {
    if (!this.data?.categoryId || !this.categories?.length) {
      return;
    }

    // String karşılaştırması için toString() kullan
    const selectedCategory = this.categories.find(
      category => {
        const categoryIdStr = category.id?.toString();
        const dataCategoryIdStr = this.data.categoryId?.toString();
        const esit = categoryIdStr === dataCategoryIdStr;
        return esit;
      }
    );

    if (selectedCategory) {
      this.frm?.get('categoryId')?.setValue(selectedCategory);
      this.updateFieldsWithCategories();
    }
  }
  // #endregion


  // #region Kategori arama İşlemleri
  private async loadInitialData(): Promise<void> {
    try {
      this.spinner.show();
      await this.loadCategories();

      // Update işlemi için kategori seçimini ayarla (kategoriler yüklendikten sonra)
      if (this.data?.categoryId || this.data?.id) {
        this.setCategoryForUpdate();
      }
    } catch (error) {
      this.alertService.error('Error loading data');
    } finally {
      this.spinner.hide();
    }
  }

    private async loadCategories(): Promise<void> {
    try {
      const response = await this.categoryService.readDropbox({
        page: 0,
        size: 1000,
      });

      if (response?.result?.categories) {
        this.categories = response.result.categories;
        // Update fields configuration with loaded categories
        this.updateFieldsWithCategories();
      }
    } catch (error) {
      this.alertService.error('Error loading categorie data');
    }
  }

  private updateFieldsWithCategories(): void {
    const categoryField = this.fields.find(field => field.name === 'categoryId');
    if (categoryField && this.categories.length > 0) {
      categoryField.autocompleteOptions = this.categories;
      // Trigger change detection for the field
      this.fields = [...this.fields];
    }
  }


  //#region Getters
  get frmControls() {
    return this.frm?.controls;
  }
  //#endregion

  //#region OnSubmit
  override onSubmit(requestProduct: RequestProduct)  {
    const numericId = this.data?.id || undefined;

    // Validate form before submission
    if (this.frm?.invalid) {
      this.alertService.error('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }

    const updatedRequest = {
      ...requestProduct,
    };

    // Handle category selection from BaseDialogComponent
    const selectedCategory = this.frm?.get('categoryId')?.value;
    if (selectedCategory && selectedCategory.id) {
      updatedRequest.categoryId = selectedCategory.id;
    }

    // Ensure boolean values are properly set
    const hasInventoryTracking = this.frm?.get('hasInventoryTracking')?.value;
    if (hasInventoryTracking !== null && hasInventoryTracking !== undefined) {
      updatedRequest.hasInventoryTracking = hasInventoryTracking;
    }

    // Ensure defaultLocation is properly set
    const defaultLocation = this.frm?.get('defaultLocation')?.value;
    if (defaultLocation !== null && defaultLocation !== undefined) {
      updatedRequest.defaultLocation = defaultLocation;
    }

    this.submitForm(
      (data) => this.ProductService.create(data),
      (data) => this.ProductService.update(data),
      updatedRequest,
      numericId
    );
  }
  //#endregion
}















