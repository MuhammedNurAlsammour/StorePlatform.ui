import { Injectable } from '@angular/core';
import { CsvConfigBuilder, ExcelConfigBuilder, ExportFormat, HTMLConfigBuilder, JsonConfigBuilder, ProfessionalCsvExportService, ProfessionalExcelExportService, ProfessionalHtmlExportService, ProfessionalJsonExportService, ProfessionalTxtExportService, TxtConfigBuilder } from '@coder-pioneers/shared';

@Injectable({
  providedIn: 'root'
})
export class ExportDataCategoriesService {

  constructor(
    private excelService: ProfessionalExcelExportService,
    private htmlService: ProfessionalHtmlExportService,
    private csvService: ProfessionalCsvExportService,
    private jsonService: ProfessionalJsonExportService,
    private txtService: ProfessionalTxtExportService
  ) {}

  // aşağıdaki fonksiyonlar yeni gereksinimlere göre güncellenmiştir.
  // Tüm konfigürasyonlarda sadece "name" ve "description" alanları bulunmaktadır.

  // Excel yapılandırması
  private getExcelConfig(): ReturnType<ExcelConfigBuilder['build']> {
    // ExcelConfigBuilder ile dosya ve kolon ayarları yapılır
    return new ExcelConfigBuilder()
      .setFileName('Categories_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('Categories_Listesi')
        .addColumn({
          field: 'name',
          header: 'Adı',
          width: 20
        })
        .addColumn({
          field: 'description',
          header: 'Açıklama',
          width: 40
        })
        .setFreezePane(0, 1)
        .done()
      .build();
  }

  // CSV yapılandırması
  private getCsvConfig(): ReturnType<CsvConfigBuilder['build']> {
    // CsvConfigBuilder ile dosya ve kolon ayarları yapılır
    return new CsvConfigBuilder()
      .setFileName('Categories_Listesi')
      .addColumn({
        field: 'name',
        header: 'Adı',
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
      })
      .build();
  }

  // HTML yapılandırması
  private getHTMLConfig(): ReturnType<HTMLConfigBuilder['build']> {
    // HTMLConfigBuilder ile dosya ve kolon ayarları yapılır
    return new HTMLConfigBuilder()
      .setFileName('Categories_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('Categories_Listesi')
        .addColumn({
          field: 'name',
          header: 'Adı',
          width: 20
        })
        .addColumn({
          field: 'description',
          header: 'Açıklama',
          width: 40
        })
        .setFreezePane(0, 1)
        .done()
      .build();
  }

  // JSON yapılandırması
  private getJsonConfig(): ReturnType<JsonConfigBuilder['build']> {
    // JsonConfigBuilder ile dosya ve kolon ayarları yapılır
    return new JsonConfigBuilder()
      .setFileName('Categories_Listesi')
      .addColumn({
        field: 'name',
        header: 'Adı',
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
      })
      .setPrettyPrint(true)
      .build();
  }

  // TXT yapılandırması
  private getTxtConfig(): ReturnType<TxtConfigBuilder['build']> {
    // TxtConfigBuilder ile dosya ve kolon ayarları yapılır
    return new TxtConfigBuilder()
      .setFileName('Categories_Listesi')
      .setColumnSeparator('\t')
      .addColumn({
        field: 'name',
        header: 'Adı',
        width: 20
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
        width: 40
      })
      .build();
  }

  exportCategoriesRequests(data: any[],format: ExportFormat): void {
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















