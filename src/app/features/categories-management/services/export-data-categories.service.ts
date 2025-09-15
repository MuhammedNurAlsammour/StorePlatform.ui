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
export class ExportDataCategoriesService {
  constructor(
    private excelService: ProfessionalExcelExportService,
    private htmlService: ProfessionalHtmlExportService,
    private csvService: ProfessionalCsvExportService,
    private jsonService: ProfessionalJsonExportService,
    private txtService: ProfessionalTxtExportService
  ) {}

  private getExcelConfig(): ReturnType<ExcelConfigBuilder['build']> {
    return new ExcelConfigBuilder()
      .setFileName('Categories_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080',
      })
      .addSheet('Categories_Listesi')
      .addColumn({
        field: 'name',
        header: 'Kategori Adı',
        width: 25,
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
        width: 30,
      })
      .addColumn({
        field: 'parentName',
        header: 'Üst Kategori',
        width: 20,
      })
      .addColumn({
        field: 'fullPath',
        header: 'Tam Yol',
        width: 35,
      })
      .addColumn({
        field: 'sortOrder',
        header: 'Sıralama',
        width: 12,
      })
      .addColumn({
        field: 'childrenCount',
        header: 'Alt Kategori Sayısı',
        width: 18,
      })
      .addColumn({
        field: 'createUserName',
        header: 'Oluşturan Kullanıcı',
        width: 20,
      })
      .addColumn({
        field: 'updateUserName',
        header: 'Güncelleyen Kullanıcı',
        width: 20,
      })
      .setFreezePane(0, 1)
      .done()
      .build();
  }

  private getCsvConfig(): ReturnType<CsvConfigBuilder['build']> {
    return new CsvConfigBuilder()
      .setFileName('Categories_Listesi')
      .addColumn({
        field: 'name',
        header: 'Kategori Adı',
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
      })
      .addColumn({
        field: 'parentName',
        header: 'Üst Kategori',
      })
      .addColumn({
        field: 'fullPath',
        header: 'Tam Yol',
      })
      .addColumn({
        field: 'sortOrder',
        header: 'Sıralama',
      })
      .addColumn({
        field: 'childrenCount',
        header: 'Alt Kategori Sayısı',
      })
      .addColumn({
        field: 'createUserName',
        header: 'Oluşturan Kullanıcı',
      })
      .addColumn({
        field: 'updateUserName',
        header: 'Güncelleyen Kullanıcı',
      })
      .build();
  }

  private getHTMLConfig(): ReturnType<HTMLConfigBuilder['build']> {
    return new HTMLConfigBuilder()
      .setFileName('Categories_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080',
      })
      .addSheet('Categories_Listesi')
      .addColumn({
        field: 'name',
        header: 'Kategori Adı',
        width: 25,
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
        width: 30,
      })
      .addColumn({
        field: 'parentName',
        header: 'Üst Kategori',
        width: 20,
      })
      .addColumn({
        field: 'fullPath',
        header: 'Tam Yol',
        width: 35,
      })
      .addColumn({
        field: 'sortOrder',
        header: 'Sıralama',
        width: 12,
      })
      .addColumn({
        field: 'childrenCount',
        header: 'Alt Kategori Sayısı',
        width: 18,
      })
      .addColumn({
        field: 'createUserName',
        header: 'Oluşturan Kullanıcı',
        width: 20,
      })
      .addColumn({
        field: 'updateUserName',
        header: 'Güncelleyen Kullanıcı',
        width: 20,
      })
      .setFreezePane(0, 1)
      .done()
      .build();
  }

  private getJsonConfig(): ReturnType<JsonConfigBuilder['build']> {
    return new JsonConfigBuilder()
      .setFileName('Categories_Listesi')
      .addColumn({
        field: 'name',
        header: 'Kategori Adı',
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
      })
      .addColumn({
        field: 'parentName',
        header: 'Üst Kategori',
      })
      .addColumn({
        field: 'fullPath',
        header: 'Tam Yol',
      })
      .addColumn({
        field: 'sortOrder',
        header: 'Sıralama',
      })
      .addColumn({
        field: 'childrenCount',
        header: 'Alt Kategori Sayısı',
      })
      .addColumn({
        field: 'createUserName',
        header: 'Oluşturan Kullanıcı',
      })
      .addColumn({
        field: 'updateUserName',
        header: 'Güncelleyen Kullanıcı',
      })
      .setPrettyPrint(true)
      .build();
  }

  private getTxtConfig(): ReturnType<TxtConfigBuilder['build']> {
    return new TxtConfigBuilder()
      .setFileName('Categories_Listesi')
      .setColumnSeparator('\t')
      .addColumn({
        field: 'name',
        header: 'Kategori Adı',
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
      })
      .addColumn({
        field: 'parentName',
        header: 'Üst Kategori',
      })
      .addColumn({
        field: 'fullPath',
        header: 'Tam Yol',
      })
      .addColumn({
        field: 'sortOrder',
        header: 'Sıralama',
      })
      .addColumn({
        field: 'childrenCount',
        header: 'Alt Kategori Sayısı',
      })
      .addColumn({
        field: 'createUserName',
        header: 'Oluşturan Kullanıcı',
      })
      .addColumn({
        field: 'updateUserName',
        header: 'Güncelleyen Kullanıcı',
      })
      .build();
  }

  exportCategoriesRequests(data: any[], format: ExportFormat): void {
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

