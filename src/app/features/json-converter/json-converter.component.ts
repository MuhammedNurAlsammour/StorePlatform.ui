import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonConverterService } from './services/json-converter.service';

@Component({
  selector: 'app-json-converter',
  templateUrl: './json-converter.component.html',
  styleUrls: ['./json-converter.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class JsonConverterComponent implements OnInit {
  converterForm: FormGroup;
  convertedTypeScript: string = '';
  sampleJson: string = '';
  isConverting: boolean = false;
  conversionSuccess: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private jsonConverterService: JsonConverterService
  ) {
    this.converterForm = this.fb.group({
      jsonInput: ['', [Validators.required, this.validateJson]]
    });
  }

  ngOnInit(): void {
    this.loadSampleJson();
  }

  /**
   * JSON örneğini yükle
   */
  private loadSampleJson(): void {
    this.sampleJson = `{
  "result": {
    "products": [
      {
        "productName": "Monster Tulpar T5 V21.1 - i5 12500H",
        "productDescription": "12. Nesil Intel Core i5-12500H işlemci, 16GB DDR4 RAM, RTX 3060 ekran kartı ve 15.6 inç 144Hz ekrana sahip yüksek performanslı Türk yapımı Monster laptop",
        "productPrice": 25000.00,
        "productStock": 20,
        "productCreatedDate": "2025-06-29T13:48:41.85297Z",
        "productUpdatedDate": "2025-06-29T13:48:41.924981Z",
        "productIsActive": true,
        "productIsDeleted": false,
        "productEmployeeId": "1530fcc1-8d44-4662-a35b-cddc8d6b1a5e",
        "categoryId": "3d12b7a8-38e9-41fe-a7b6-e2e60cf55665",
        "categoryName": "Bilgisayar ve Laptop",
        "categoryDescription": "Masaüstü bilgisayarlar, dizüstü bilgisayarlar ve bilgisayar aksesuarlar",
        "authUserName": "muhammed.nur",
        "authCustomerName": "Test Kurumu",
        "id": "7587d50b-39fa-4f8f-b02e-91daf35f8095",
        "customerId": null,
        "authCustomerId": null,
        "authUserId": null,
        "rowCreatedDate": "0001-01-01T00:00:00",
        "rowUpdatedDate": "0001-01-01T00:00:00",
        "rowIsActive": false,
        "rowIsDeleted": false
      }
    ]
  },
  "operationResult": {
    "referenceId": 3,
    "messageTitle": "İşlem Başarılı",
    "messageContent": "Görev listesi başarıyla getirildi.",
    "messageDetail": "Toplam Görev Veri Sayısı: 3",
    "result": 0
  },
  "refId": 3,
  "operationStatus": true,
  "statusCode": 0
}`;
  }

  /**
   * Örnek JSON'u input alanına yükle
   */
  loadSample(): void {
    this.converterForm.patchValue({
      jsonInput: this.sampleJson
    });
  }

  /**
   * JSON'u TypeScript'e dönüştür
   */
  convertToTypeScript(): void {
    if (this.converterForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isConverting = true;
    this.errorMessage = '';
    this.conversionSuccess = false;

    try {
      const jsonInput = this.converterForm.get('jsonInput')?.value;
      const parsedJson = JSON.parse(jsonInput);

      // ProductResponse tipinde olup olmadığını kontrol et
      this.convertedTypeScript = this.jsonConverterService.convertJsonToTypeScript(parsedJson);
      this.conversionSuccess = true;
    } catch (error: any) {
      this.errorMessage = `Dönüştürme hatası: ${error.message}`;
      this.conversionSuccess = false;
    } finally {
      this.isConverting = false;
    }
  }

  /**
   * TypeScript kodunu panoya kopyala
   */
  copyToClipboard(): void {
    if (this.convertedTypeScript) {
      navigator.clipboard.writeText(this.convertedTypeScript).then(() => {
        // Başarı mesajı göster
        console.log('TypeScript kodu panoya kopyalandı');
      });
    }
  }

  /**
   * Formu temizle
   */
  clearForm(): void {
    this.converterForm.reset();
    this.convertedTypeScript = '';
    this.conversionSuccess = false;
    this.errorMessage = '';
  }

  /**
   * JSON validatörü
   */
  private validateJson(control: any) {
    if (!control.value) return null;

    try {
      JSON.parse(control.value);
      return null;
    } catch {
      return { invalidJson: true };
    }
  }

  /**
   * Form alanlarını touched olarak işaretle
   */
  private markFormGroupTouched(): void {
    Object.keys(this.converterForm.controls).forEach(key => {
      const control = this.converterForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Form alanı hata mesajı
   */
  getFieldError(fieldName: string): string {
    const field = this.converterForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Bu alan zorunludur';
      if (field.errors['invalidJson']) return 'Geçerli bir JSON formatı giriniz';
    }
    return '';
  }
}









