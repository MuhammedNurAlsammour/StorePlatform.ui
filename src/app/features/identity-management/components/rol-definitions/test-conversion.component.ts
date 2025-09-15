import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  convertJsonToMenusFormat,
  createAssignEndpointsRequest,
  createSampleRequest,
  sampleInputData,
  type AssignEndpointsToRoleRequest,
  type ConvertedMenu,
  type Menu
} from '../../utils/json-converter.util';

@Component({
  selector: 'app-test-conversion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2>JSON Dönüştürme Testi</h2>

      <div class="mb-4">
        <h3>Giriş Verisi:</h3>
        <pre class="bg-gray-100 p-2 rounded">{{ inputData | json }}</pre>
      </div>

      <div class="mb-4">
        <button (click)="convertData()" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Dönüştür
        </button>
        <button (click)="createRequest()" class="bg-green-500 text-white px-4 py-2 rounded">
          Request Oluştur
        </button>
      </div>

      <div class="mb-4" *ngIf="convertedData">
        <h3>Dönüştürülmüş Veri:</h3>
        <pre class="bg-green-100 p-2 rounded">{{ convertedData | json }}</pre>
      </div>

      <div class="mb-4" *ngIf="menusArray">
        <h3>Menus Array:</h3>
        <pre class="bg-yellow-100 p-2 rounded">{{ menusArray | json }}</pre>
      </div>

      <div class="mb-4" *ngIf="requestObject">
        <h3>Tam Request Object:</h3>
        <pre class="bg-purple-100 p-2 rounded">{{ requestObject | json }}</pre>
      </div>

      <div class="mb-4" *ngIf="sampleRequest">
        <h3>Örnek Request:</h3>
        <pre class="bg-orange-100 p-2 rounded">{{ sampleRequest | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  `]
})
export class TestConversionComponent {
  inputData: Menu[] = sampleInputData;
  convertedData: ConvertedMenu[] | null = null;
  menusArray: { menus: ConvertedMenu[] } | null = null;
  requestObject: AssignEndpointsToRoleRequest | null = null;
  sampleRequest: AssignEndpointsToRoleRequest | null = null;

  convertData() {
    this.convertedData = convertJsonToMenusFormat(this.inputData);
    this.menusArray = { menus: this.convertedData };

    console.log('Dönüştürülmüş veri:', this.convertedData);
    console.log('Menus array:', this.menusArray);
  }

  createRequest() {
    // Manuel request oluştur
    this.requestObject = createAssignEndpointsRequest(
      'SuperAdmin',
      '17b48d1e-54a6-42c5-8c20-e2a523dfc1ac',
      '72c54b1a-8e1c-45ea-8edd-b5da1091e325',
      this.inputData
    );

    // Örnek request oluştur
    this.sampleRequest = createSampleRequest();

    console.log('Request object:', this.requestObject);
    console.log('Sample request:', this.sampleRequest);
  }
}






















