import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AlertService, ExportFormat, ProfessionalCsvExportService, ProfessionalExcelExportService, ProfessionalHtmlExportService, ProfessionalJsonExportService, ProfessionalTxtExportService } from '@coder-pioneers/shared';
import { environment } from 'src/environments/environment';

describe('ExportDataOrdersService', () => {
  let service: ExportDataOrdersService;
  let httpMock: HttpTestingController;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let excelServiceSpy: jasmine.SpyObj<ProfessionalExcelExportService>;
  let htmlServiceSpy: jasmine.SpyObj<ProfessionalHtmlExportService>;
  let csvServiceSpy: jasmine.SpyObj<ProfessionalCsvExportService>;
  let jsonServiceSpy: jasmine.SpyObj<ProfessionalJsonExportService>;
  let txtServiceSpy: jasmine.SpyObj<ProfessionalTxtExportService>;

  const mockData = [
    {
      name: 'Test Document',
      institutionName: 'Test Institution',
      customerName: 'Test Customer'
    }
  ];

  beforeEach(() => {
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['error']);
    excelServiceSpy = jasmine.createSpyObj('ProfessionalExcelExportService', ['export']);
    htmlServiceSpy = jasmine.createSpyObj('ProfessionalHtmlExportService', ['export']);
    csvServiceSpy = jasmine.createSpyObj('ProfessionalCsvExportService', ['export']);
    jsonServiceSpy = jasmine.createSpyObj('ProfessionalJsonExportService', ['export']);
    txtServiceSpy = jasmine.createSpyObj('ProfessionalTxtExportService', ['export']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ExportDataOrdersService,
        { AlertService, useValue: alertServiceSpy },
        { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
        { provide: ProfessionalExcelExportService, useValue: excelServiceSpy },
        { provide: ProfessionalHtmlExportService, useValue: htmlServiceSpy },
        { provide: ProfessionalCsvExportService, useValue: csvServiceSpy },
        { provide: ProfessionalJsonExportService, useValue: jsonServiceSpy },
        { provide: ProfessionalTxtExportService, useValue: txtServiceSpy }
      ]
    });


    service = TestBed.inject(ExportDataOrdersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('servis başarıyla oluşturulmalı', () => {
    expect(service).toBeTruthy();
  });

  it('verileri Excel formatında dışa aktarmalı', () => {
    service.exportOrdersRequests(mockData, 'excel' as ExportFormat);
    expect(excelServiceSpy.export).toHaveBeenCalled();
  });

  it('verileri HTML formatında dışa aktarmalı', () => {
    service.exportOrdersRequests(mockData, 'html' as ExportFormat);
    expect(htmlServiceSpy.export).toHaveBeenCalled();
  });

  it('verileri CSV formatında dışa aktarmalı', () => {
    service.exportOrdersRequests(mockData, 'csv' as ExportFormat);
    expect(csvServiceSpy.export).toHaveBeenCalled();
  });

  it('verileri JSON formatında dışa aktarmalı', () => {
    service.exportOrdersRequests(mockData, 'json' as ExportFormat);
    expect(jsonServiceSpy.export).toHaveBeenCalled();
  });

  it('verileri TXT formatında dışa aktarmalı', () => {
    service.exportOrdersRequests(mockData, 'txt' as ExportFormat);
    expect(txtServiceSpy.export).toHaveBeenCalled();
  });

  it('bilinmeyen format durumunda hiçbir dışa aktarma işlemi yapmamalı', () => {
    service.exportOrdersRequests(mockData, 'unknown' as ExportFormat);
    expect(excelServiceSpy.export).not.toHaveBeenCalled();
    expect(htmlServiceSpy.export).not.toHaveBeenCalled();
    expect(csvServiceSpy.export).not.toHaveBeenCalled();
    expect(jsonServiceSpy.export).not.toHaveBeenCalled();
    expect(txtServiceSpy.export).not.toHaveBeenCalled();
  });

  afterEach(() => {
    httpMock.verify();
  });
});









