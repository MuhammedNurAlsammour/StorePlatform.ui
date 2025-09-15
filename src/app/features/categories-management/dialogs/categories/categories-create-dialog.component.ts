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
import { RequestCategory } from '@features/categories-management/contracts/requests/request-categories';
import { ResultCategory } from '@features/categories-management/contracts/responses/categories-response';
import { CategoriesService } from '@features/categories-management/services/categories.service';
import {
  BaseDialogComponent,
  FormFieldConfig,
} from '@shared/components/base/dialog/base-dialog/base-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-categories-create-dialog',
  standalone: true,
  imports: [BaseDialogComponent, MaterialDialogModule],
  templateUrl: './categories-create-dialog.component.html',
  styleUrl: './categories-create-dialog.component.scss',
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
export class CategoriesCreateDialogComponent
  extends CoderBaseDialogComponent<CategoriesCreateDialogComponent>
  implements OnInit
{
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];
  isFormVisible: boolean = false;
  Categoriess: ResultCategory[] = [];
  hascearte: boolean = false;
  constructor(
    dialogRef: MatDialogRef<CategoriesCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestCategory,
    alertService: AlertService,
    spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private CategoriesService: CategoriesService
  ) {
    super(dialogRef, spinner, alertService);
    this.dialogTitle = 'Kategoriler İşlemleri';
    this.titleIcon = 'category';
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
      // Kategori alanları
      name: [null, Validators.required],
      description: [null, Validators.required],
      parentId: [null],
      icon: [null],
      sortOrder: [0],
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
      // İlk satır: Kategori Adı ve Açıklaması
      {
        name: 'name',
        label: 'Kategori Adı',
        type: 'text',
        required: true,
        maxLength: 100,
        placeholder: 'Kategori adını giriniz',
        col: 'col',
        rowStart: true, // Yeni satır başlangıcı
      },
      {
        name: 'description',
        label: 'Kategori Açıklaması',
        type: 'textarea',
        required: true,
        maxLength: 500,
        placeholder: 'Kategori açıklamasını giriniz',
        col: 'col',
        rowEnd: true, // Satır sonu
      },
      // İkinci satır: Üst Kategori ve İkon
      {
        name: 'parentId',
        label: 'Üst Kategori',
        type: 'select',
        required: false,
        placeholder: 'Üst kategori seçiniz',
        col: 'col',
        rowStart: true,
      },
      {
        name: 'icon',
        label: 'İkon',
        type: 'text',
        required: false,
        maxLength: 50,
        placeholder: 'İkon adını giriniz (örn: fa-home)',
        col: 'col',
        rowEnd: true,
      },
      // Üçüncü satır: Sıralama
      {
        name: 'sortOrder',
        label: 'Sıralama',
        type: 'number',
        required: false,
        placeholder: 'Sıralama numarası',
        col: 'col',
        rowStart: true,
        rowEnd: true,
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
  override onSubmit(requestCategories: RequestCategory) {
    const numericId = this.data?.id || undefined;

    this.submitForm(
      (data) => this.CategoriesService.create(data),
      (data) => this.CategoriesService.update(data),
      requestCategories,
      numericId
    );
  }
  //#endregion
}

