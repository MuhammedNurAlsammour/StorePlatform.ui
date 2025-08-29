import { Injectable } from '@angular/core';
import { CsvConfigBuilder, ExcelConfigBuilder, ExportFormat, HTMLConfigBuilder, JsonConfigBuilder, ProfessionalCsvExportService, ProfessionalExcelExportService, ProfessionalHtmlExportService, ProfessionalJsonExportService, ProfessionalTxtExportService, TxtConfigBuilder } from '@coder-pioneers/shared';

@Injectable({
  providedIn: 'root'
})
export class ExportDataInventorySnapshotService {

  constructor(
    private excelService: ProfessionalExcelExportService,
    private htmlService: ProfessionalHtmlExportService,
    private csvService: ProfessionalCsvExportService,
    private jsonService: ProfessionalJsonExportService,
    private txtService: ProfessionalTxtExportService
  ) {}

  private getExcelConfig(): ReturnType<ExcelConfigBuilder['build']> {
    return new ExcelConfigBuilder()
      .setFileName('InventorySnapshot_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('InventorySnapshot_Listesi')
          .addColumn({
          field: 'authUserName',
          header: 'Kullanıcı Adı',
          width: 20
        })
        .addColumn({
          field: 'authCustomerName',
          header: 'Müşteri Adı',
          width: 20
        })
        .setFreezePane(0, 1)
        .done()
      .build();
  }

  private getCsvConfig(): ReturnType<CsvConfigBuilder['build']> {
    return new CsvConfigBuilder()
      .setFileName('InventorySnapshot_Listesi')
      .addColumn({
        field: 'InventorySnapshotName',
        header: 'InventorySnapshot Adı',
      })
      .addColumn({
        field: 'authUserName',
        header: 'Kullanıcı Adı',
      })
      .addColumn({
        field: 'authCustomerName',
        header: 'Müşteri Adı',
      })
      .build();
  }


  private getHTMLConfig(): ReturnType<HTMLConfigBuilder['build']> {
    return new HTMLConfigBuilder()
      .setFileName('InventorySnapshot_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('InventorySnapshot_Listesi')
        .addColumn({
          field: 'authUserName',
          header: 'Kullanıcı Adı',
          width: 20
        })
        .addColumn({
          field: 'authCustomerName',
          header: 'Müşteri Adı',
          width: 20
        })
        .setFreezePane(0, 1)
        .done()
      .build();
  }

  private getJsonConfig(): ReturnType<JsonConfigBuilder['build']> {
    return new JsonConfigBuilder()
      .setFileName('InventorySnapshot_Listesi')
        .addColumn({
          field: 'authUserName',
          header: 'Kullanıcı Adı',
        })
        .addColumn({
          field: 'authCustomerName',
          header: 'Müşteri Adı',
        })
      .setPrettyPrint(true)
      .build();
  }

  private getTxtConfig(): ReturnType<TxtConfigBuilder['build']> {
    return new TxtConfigBuilder()
      .setFileName('InventorySnapshot_Listesi')
      .setColumnSeparator('\t')
      .addColumn({
        field: 'InventorySnapshotName',
        header: 'InventorySnapshot Adı',
      })
      .addColumn({
        field: 'authUserName',
        header: 'Kullanıcı Adı',
      })
      .addColumn({
        field: 'authCustomerName',
        header: 'Müşteri Adı',
      })
      .build();
  }

  exportInventorySnapshotRequests(data: any[],format: ExportFormat): void {
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


