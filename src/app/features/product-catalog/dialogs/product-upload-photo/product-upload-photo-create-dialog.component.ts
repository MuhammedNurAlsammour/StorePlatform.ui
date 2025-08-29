/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  AlertService,
  CoderBaseDialogComponent,
  MaterialDialogModule,
} from '@coder-pioneers/shared';
import { RequestProductUploadPhoto } from '@features/product-catalog/contracts/requests/request-product-upload-photo';
import { ProductUploadPhotoService } from '@features/product-catalog/services/product-upload-photo.service';
import {
  BaseDialogComponent,
  FormFieldConfig,
} from '@shared/components/base/dialog/base-dialog/base-dialog.component';
import {
  ActualFileObject,
  FilePondInitialFile,
  FilePondOptions,
} from 'filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import { NgxSpinnerService } from 'ngx-spinner';

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
);
@Component({
  selector: 'app-product-upload-photo-create-dialog',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MaterialDialogModule,
    FilePondModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './product-upload-photo-create-dialog.component.html',
  styleUrl: './product-upload-photo-create-dialog.component.scss',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class ProductUploadPhotoCreateDialogComponent
  extends CoderBaseDialogComponent<ProductUploadPhotoCreateDialogComponent>
  implements OnInit
{
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];
  isFormVisible: boolean = false;
  hascearte: boolean = false;

  fileFormData: FormData | null = null;
  pondFiles: (string | FilePondInitialFile | Blob | ActualFileObject)[] = [];
  pondOptions: FilePondOptions = {
    allowMultiple: false,
    acceptedFileTypes: ['image/*'],
    server: {
      process: (
        fieldName: string,
        file: any,
        metadata: any,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        load: Function,
        error: Function,
        progress: Function,
        abort: Function
      ) => {
        const formData = new FormData();
        formData.append('file', file, file.name);

        this.fileFormData = formData;

        load(file.name);
      },
    },
  };

  photoByteArray: number[] = [];
  constructor(
    dialogRef: MatDialogRef<ProductUploadPhotoCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestProductUploadPhoto,
    alertService: AlertService,
    spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private ProductUploadPhotoService: ProductUploadPhotoService
  ) {
    super(dialogRef, spinner, alertService);
    this.dialogTitle = 'ProductUploadPhoto Ekle';
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
      //yeni alanlar
      productId: [this.data?.productId || null, Validators.required], // ProductId zorunlu alan
      photoPath: [null],
      photoBase64: [null],
    });

    this.pondFiles = this.pondFiles.map((file) => {
      if (typeof file !== 'string') {
        return {
          source: (file as FilePondInitialFile).source,
          options: { type: 'local' },
        };
      }
      return file;
    });

    // Setup fields configuration for BaseDialogComponent
    this.setupFieldsConfig();

    if (this.data?.id) {
      this.frm.patchValue(this.data);
    }
  }
  //#endregion

  //#region satır ve sütün yapılandırma
  private setupFieldsConfig(): void {}
  //#endregion

  //#region ngOnInit
  ngOnInit() {}
  //#endregion

  //#region Getters
  get frmControls() {
    return this.frm?.controls;
  }
  //#endregion

  pondHandleInit() {}

  pondHandleAddFile(event: any) {
    // Dosya eklendiğinde base64'e çevir
    const file = event.file;
    if (file) {
      try {
        // FilePond'dan gelen dosya objesini kontrol et
        let fileToRead: File | Blob;

        // FilePond'un farklı dosya formatlarını kontrol et
        if (file instanceof File || file instanceof Blob) {
          fileToRead = file;
        } else if (
          file.file &&
          (file.file instanceof File || file.file instanceof Blob)
        ) {
          fileToRead = file.file;
        } else if (
          file.source &&
          (file.source instanceof File || file.source instanceof Blob)
        ) {
          fileToRead = file.source;
        } else if (typeof file.getFile === 'function') {
          const getFileResult = file.getFile();
          if (getFileResult instanceof File || getFileResult instanceof Blob) {
            fileToRead = getFileResult;
          } else {
            throw new Error('getFile() methodu geçerli bir dosya döndürmedi');
          }
        } else {
          // FilePond'un server process'inden gelen dosya
          if (file.filename && typeof file.get === 'function') {
            fileToRead = file.get();
          } else {
            throw new Error('Desteklenmeyen dosya formatı');
          }
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (e.target && e.target.result) {
            const result = e.target.result.toString();
            const base64String = result.includes(',')
              ? result.split(',')[1]
              : result;
            this.frm.patchValue({
              photoBase64: base64String,
              photoPath: file.name || file.filename || 'uploaded_file',
            });
          }
        };
        reader.onerror = () => {
          this.alertService.error('Dosya okuma hatası oluştu.');
        };
        reader.readAsDataURL(fileToRead);
      } catch (error) {
        console.error('Dosya işleme hatası:', error);
        this.alertService.error(
          'Dosya işlenirken hata oluştu: ' + (error as Error).message
        );
      }
    }
  }
  pondHandleActivateFile(event: any) {}

  //#region OnSubmit
  override onSubmit(requestProductUploadPhoto: RequestProductUploadPhoto) {
    const numericId = this.data?.id || undefined;

    // Form validasyonu
    if (this.frm?.invalid) {
      this.alertService.error('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    // Dosya kontrolü
    if (!this.frm.get('photoBase64')?.value) {
      this.alertService.error('Lütfen bir resim dosyası yükleyin.');
      return;
    }

    // ProductId kontrolü
    if (!this.frm.get('productId')?.value) {
      this.alertService.error('ProductId zorunludur.');
      return;
    }

    this.spinner.show('s2');

    // Form verilerini hazırla
    const formData = {
      ...this.frm.value,
      productId: this.frm.get('productId')?.value,
      photoPath: this.frm.get('photoPath')?.value,
      photoBase64: this.frm.get('photoBase64')?.value,
    };

    this.submitForm(
      (data) => this.ProductUploadPhotoService.create(data),
      (data) => this.ProductUploadPhotoService.create(data),
      formData,
      numericId
    );
  }
  //#endregion
}



