import { Injectable } from '@angular/core';
import {
  CsvConfigBuilder,
  ExcelConfigBuilder,
  ExportFormat,
  HTMLConfigBuilder,
  JsonConfigBuilder,
  ProfessionalCsvExportService,
  ProfessionalExcelExportService,
  ProfessionalHtmlExportService,
  ProfessionalJsonExportService,
  ProfessionalTxtExportService,
  TxtConfigBuilder,
} from '@coder-pioneers/shared';

@Injectable({
  providedIn: 'root',
})
export class ExportDataBusinessesService {
  constructor(
    private excelService: ProfessionalExcelExportService,
    private htmlService: ProfessionalHtmlExportService,
    private csvService: ProfessionalCsvExportService,
    private jsonService: ProfessionalJsonExportService,
    private txtService: ProfessionalTxtExportService
  ) {}

  private getExcelConfig(): ReturnType<ExcelConfigBuilder['build']> {
    return new ExcelConfigBuilder()
      .setFileName('Businesses_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080',
      })
      .addSheet('Businesses_Listesi')
      .addColumn({
        field: 'name',
        header: 'İşletme Adı',
        width: 25,
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
        width: 30,
      })
      .addColumn({
        field: 'phone',
        header: 'Telefon',
        width: 15,
      })
      .addColumn({
        field: 'email',
        header: 'E-posta',
        width: 25,
      })
      .addColumn({
        field: 'address',
        header: 'Adres',
        width: 35,
      })
      .addColumn({
        field: 'isVerified',
        header: 'Doğrulanmış',
        width: 12,
      })
      .addColumn({
        field: 'isFeatured',
        header: 'Öne Çıkan',
        width: 12,
      })
      .addColumn({
        field: 'authUserName',
        header: 'Kullanıcı Adı',
        width: 20,
      })
      .addColumn({
        field: 'rowCreatedDate',
        header: 'Oluşturulma Tarihi',
        width: 20,
      })
      .setFreezePane(0, 1)
      .done()
      .build();
  }

  private getCsvConfig(): ReturnType<CsvConfigBuilder['build']> {
    return new CsvConfigBuilder()
      .setFileName('Businesses_Listesi')
      .addColumn({
        field: 'name',
        header: 'İşletme Adı',
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
      })
      .addColumn({
        field: 'phone',
        header: 'Telefon',
      })
      .addColumn({
        field: 'email',
        header: 'E-posta',
      })
      .addColumn({
        field: 'address',
        header: 'Adres',
      })
      .addColumn({
        field: 'isVerified',
        header: 'Doğrulanmış',
      })
      .addColumn({
        field: 'isFeatured',
        header: 'Öne Çıkan',
      })
      .addColumn({
        field: 'authUserName',
        header: 'Kullanıcı Adı',
      })
      .addColumn({
        field: 'rowCreatedDate',
        header: 'Oluşturulma Tarihi',
      })
      .build();
  }

  private getHTMLConfig(): ReturnType<HTMLConfigBuilder['build']> {
    return new HTMLConfigBuilder()
      .setFileName('Businesses_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080',
      })
      .addSheet('Businesses_Listesi')
      .addColumn({
        field: 'name',
        header: 'İşletme Adı',
        width: 25,
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
        width: 30,
      })
      .addColumn({
        field: 'phone',
        header: 'Telefon',
        width: 15,
      })
      .addColumn({
        field: 'email',
        header: 'E-posta',
        width: 25,
      })
      .addColumn({
        field: 'address',
        header: 'Adres',
        width: 35,
      })
      .addColumn({
        field: 'isVerified',
        header: 'Doğrulanmış',
        width: 12,
      })
      .addColumn({
        field: 'isFeatured',
        header: 'Öne Çıkan',
        width: 12,
      })
      .addColumn({
        field: 'authUserName',
        header: 'Kullanıcı Adı',
        width: 20,
      })
      .addColumn({
        field: 'rowCreatedDate',
        header: 'Oluşturulma Tarihi',
        width: 20,
      })
      .setFreezePane(0, 1)
      .done()
      .build();
  }

  private getJsonConfig(): ReturnType<JsonConfigBuilder['build']> {
    return new JsonConfigBuilder()
      .setFileName('Businesses_Listesi')
      .addColumn({
        field: 'name',
        header: 'İşletme Adı',
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
      })
      .addColumn({
        field: 'phone',
        header: 'Telefon',
      })
      .addColumn({
        field: 'email',
        header: 'E-posta',
      })
      .addColumn({
        field: 'address',
        header: 'Adres',
      })
      .addColumn({
        field: 'isVerified',
        header: 'Doğrulanmış',
      })
      .addColumn({
        field: 'isFeatured',
        header: 'Öne Çıkan',
      })
      .addColumn({
        field: 'authUserName',
        header: 'Kullanıcı Adı',
      })
      .addColumn({
        field: 'rowCreatedDate',
        header: 'Oluşturulma Tarihi',
      })
      .setPrettyPrint(true)
      .build();
  }

  private getTxtConfig(): ReturnType<TxtConfigBuilder['build']> {
    return new TxtConfigBuilder()
      .setFileName('Businesses_Listesi')
      .setColumnSeparator('\t')
      .addColumn({
        field: 'name',
        header: 'İşletme Adı',
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
      })
      .addColumn({
        field: 'phone',
        header: 'Telefon',
      })
      .addColumn({
        field: 'email',
        header: 'E-posta',
      })
      .addColumn({
        field: 'address',
        header: 'Adres',
      })
      .addColumn({
        field: 'isVerified',
        header: 'Doğrulanmış',
      })
      .addColumn({
        field: 'isFeatured',
        header: 'Öne Çıkan',
      })
      .addColumn({
        field: 'authUserName',
        header: 'Kullanıcı Adı',
      })
      .addColumn({
        field: 'rowCreatedDate',
        header: 'Oluşturulma Tarihi',
      })
      .build();
  }

  exportBusinessesRequests(data: any[], format: ExportFormat): void {
    switch (format) {
      case 'excel':
        this.exportExcelRequests(data);
        break;
      case 'csv':
        this.exportCsvRequests(data);
        break;
      case 'json':
        this.exportJsonRequests(data);
        break;
      case 'html':
        this.exportHtmlRequests(data);
        break;
      case 'txt':
        this.exportTxtRequests(data);
        break;
      default:
    }
  }

  exportExcelRequests(data: any[]): void {
    const configExcel = this.getExcelConfig();
    this.excelService.export(data, configExcel);
  }

  exportHtmlRequests(data: any[]): void {
    const config = this.getHTMLConfig();
    this.htmlService.export(data, config);
  }

  exportCsvRequests(data: any[]): void {
    const config = this.getCsvConfig();
    this.csvService.export(data, config);
  }

  exportJsonRequests(data: any[]): void {
    const config = this.getJsonConfig();
    this.jsonService.export(data, config);
  }

  exportTxtRequests(data: any[]): void {
    const config = this.getTxtConfig();
    this.txtService.export(data, config);
  }
}
