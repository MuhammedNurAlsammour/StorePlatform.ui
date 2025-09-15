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
import { RequestBusinesses } from '@features/Businesses-management/contracts/requests/request-Businesses';
import { ResultBusinesse } from '@features/Businesses-management/contracts/responses/Businesses-response';
import { BusinessesService } from '@features/Businesses-management/services/Businesses.service';
import {
  BaseDialogComponent,
  FormFieldConfig,
} from '@shared/components/base/dialog/base-dialog/base-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-Businesses-create-dialog',
  standalone: true,
  imports: [BaseDialogComponent, MaterialDialogModule],
  templateUrl: './Businesses-create-dialog.component.html',
  styleUrl: './Businesses-create-dialog.component.scss',
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
export class BusinessesCreateDialogComponent
  extends CoderBaseDialogComponent<BusinessesCreateDialogComponent>
  implements OnInit
{
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];
  isFormVisible: boolean = false;
  Businessess: ResultBusinesse[] = [];
  hascearte: boolean = false;
  constructor(
    dialogRef: MatDialogRef<BusinessesCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestBusinesses,
    alertService: AlertService,
    spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private BusinessesService: BusinessesService
  ) {
    super(dialogRef, spinner, alertService);
    this.dialogTitle = 'Businesses Ekle';
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
      // Businesses alanları
      name: [null, Validators.required],
      description: [null],
      subDescription: [null],
      categoryId: [null],
      subCategoryId: [null],
      provinceId: [null],
      countriesId: [null],
      districtId: [null],
      address: [null],
      latitude: [null],
      longitude: [null],
      phone: [null],
      mobile: [null],
      email: [null],
      website: [null],
      facebookUrl: [null],
      instagramUrl: [null],
      whatsApp: [null],
      telegram: [null],
      primaryContactType1: [null],
      primaryContactValue1: [null],
      primaryContactType2: [null],
      primaryContactValue2: [null],
      subscriptionType: [null],
      isVerified: [false],
      isFeatured: [false],
      workingHours: [null],
      icon: [null],
      ownerId: [null],
      createUserId: [userId],
    });

    // Setup fields configuration for BaseDialogComponent
    this.setupFieldsConfig();

    if (this.data?.id) {
      this.frm.patchValue(this.data);
    }
  }
  //#endregion

  //#region satır ve sütün yapılandırma
  private setupFieldsConfig(): void {
    // Form alanlarını Bootstrap Grid sistemine göre yapılandırma
    // Her satır ayrı container ve row olarak yapılandırılacak
    this.fields = [
      // İlk satır: İşletme Adı ve Açıklaması
      {
        name: 'name',
        label: 'İşletme Adı',
        type: 'text',
        required: true,
        maxLength: 100,
        placeholder: 'İşletme adını giriniz',
        col: 'col',
        rowStart: true,
      },
      {
        name: 'description',
        label: 'Açıklama',
        type: 'textarea',
        required: false,
        maxLength: 500,
        placeholder: 'İşletme açıklamasını giriniz',
        col: 'col',
        rowEnd: true,
      },

      // İkinci satır: Alt Açıklama ve Kategori
      {
        name: 'subDescription',
        label: 'Alt Açıklama',
        type: 'textarea',
        required: false,
        maxLength: 300,
        placeholder: 'Alt açıklama giriniz',
        col: 'col',
        rowStart: true,
      },
      {
        name: 'categoryId',
        label: 'Kategori',
        type: 'text',
        required: false,
        placeholder: 'Kategori ID giriniz',
        col: 'col',
        rowEnd: true,
      },

      // Üçüncü satır: İletişim Bilgileri
      {
        name: 'phone',
        label: 'Telefon',
        type: 'text',
        required: false,
        placeholder: 'Telefon numarası giriniz',
        col: 'col',
        rowStart: true,
      },
      {
        name: 'mobile',
        label: 'Mobil',
        type: 'text',
        required: false,
        placeholder: 'Mobil numara giriniz',
        col: 'col',
        rowEnd: true,
      },

      // Dördüncü satır: Email ve Website
      {
        name: 'email',
        label: 'E-posta',
        type: 'text',
        required: false,
        placeholder: 'E-posta adresi giriniz',
        col: 'col',
        rowStart: true,
      },
      {
        name: 'website',
        label: 'Website',
        type: 'text',
        required: false,
        placeholder: 'Website adresi giriniz',
        col: 'col',
        rowEnd: true,
      },

      // Beşinci satır: Adres
      {
        name: 'address',
        label: 'Adres',
        type: 'textarea',
        required: false,
        maxLength: 200,
        placeholder: 'Adres bilgilerini giriniz',
        col: 'col-12',
        rowStart: true,
        rowEnd: true,
      },

      // Altıncı satır: Konum Koordinatları
      {
        name: 'latitude',
        label: 'Enlem',
        type: 'number',
        required: false,
        placeholder: 'Enlem değeri giriniz',
        col: 'col',
        rowStart: true,
      },
      {
        name: 'longitude',
        label: 'Boylam',
        type: 'number',
        required: false,
        placeholder: 'Boylam değeri giriniz',
        col: 'col',
        rowEnd: true,
      },

      // Yedinci satır: Sosyal Medya
      {
        name: 'facebookUrl',
        label: 'Facebook URL',
        type: 'text',
        required: false,
        placeholder: 'Facebook sayfası URL',
        col: 'col',
        rowStart: true,
      },
      {
        name: 'instagramUrl',
        label: 'Instagram URL',
        type: 'text',
        required: false,
        placeholder: 'Instagram sayfası URL',
        col: 'col',
        rowEnd: true,
      },

      // Sekizinci satır: WhatsApp ve Telegram
      {
        name: 'whatsApp',
        label: 'WhatsApp',
        type: 'text',
        required: false,
        placeholder: 'WhatsApp numarası',
        col: 'col',
        rowStart: true,
      },
      {
        name: 'telegram',
        label: 'Telegram',
        type: 'text',
        required: false,
        placeholder: 'Telegram kullanıcı adı',
        col: 'col',
        rowEnd: true,
      },

      // Dokuzuncu satır: Çalışma Saatleri
      {
        name: 'workingHours',
        label: 'Çalışma Saatleri',
        type: 'textarea',
        required: false,
        maxLength: 200,
        placeholder: 'Çalışma saatlerini giriniz',
        col: 'col-12',
        rowStart: true,
        rowEnd: true,
      },

      // Onuncu satır: Durum Seçenekleri
      {
        name: 'isVerified',
        label: 'Doğrulanmış',
        type: 'select',
        required: false,
        col: 'col',
        rowStart: true,
        options: [
          { id: true, name: 'Evet' },
          { id: false, name: 'Hayır' },
        ],
      },
      {
        name: 'isFeatured',
        label: 'Öne Çıkan',
        type: 'select',
        required: false,
        col: 'col',
        rowEnd: true,
        options: [
          { id: true, name: 'Evet' },
          { id: false, name: 'Hayır' },
        ],
      },
    ];
  }
  //#endregion

  //#region ngOnInit
  ngOnInit() {}
  //#endregion

  //#region Getters
  get frmControls() {
    return this.frm?.controls;
  }
  //#endregion

  //#region OnSubmit
  override onSubmit(requestBusinesses: RequestBusinesses) {
    const numericId = this.data?.id || undefined;

    this.submitForm(
      (data) => this.BusinessesService.create(data),
      (data) => this.BusinessesService.update(data),
      requestBusinesses,
      numericId
    );
  }
  //#endregion
}
