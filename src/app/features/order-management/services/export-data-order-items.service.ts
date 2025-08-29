import { Injectable } from '@angular/core';
import { CsvConfigBuilder, ExcelConfigBuilder, ExportFormat, HTMLConfigBuilder, JsonConfigBuilder, ProfessionalCsvExportService, ProfessionalExcelExportService, ProfessionalHtmlExportService, ProfessionalJsonExportService, ProfessionalTxtExportService, TxtConfigBuilder } from '@coder-pioneers/shared';

@Injectable({
  providedIn: 'root'
})
export class ExportDataOrderItemsService {

  constructor(
    private excelService: ProfessionalExcelExportService,
    private htmlService: ProfessionalHtmlExportService,
    private csvService: ProfessionalCsvExportService,
    private jsonService: ProfessionalJsonExportService,
    private txtService: ProfessionalTxtExportService
  ) {}

  // Excel dışa aktarma yapılandırması
  private getExcelConfig(): ReturnType<ExcelConfigBuilder['build']> {
    return new ExcelConfigBuilder()
      .setFileName('OrderItems_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('OrderItems_Listesi')
        // Sütunlar ekleniyor
        .addColumn({
          field: 'quantity',
          header: 'Adet',
          width: 15
        })
        .addColumn({
          field: 'price',
          header: 'Fiyat',
          width: 15
        })
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

  // CSV dışa aktarma yapılandırması
  private getCsvConfig(): ReturnType<CsvConfigBuilder['build']> {
    // CsvConfigBuilder ile yapılandırma oluşturuluyor
    return new CsvConfigBuilder()
      .setFileName('OrderItems_Listesi')
      .addColumn({
        field: 'quantity',
        header: 'Adet',
      })
      .addColumn({
        field: 'price',
        header: 'Fiyat',
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

  // HTML dışa aktarma yapılandırması
  private getHTMLConfig(): ReturnType<HTMLConfigBuilder['build']> {
    // HTMLConfigBuilder ile yapılandırma oluşturuluyor
    return new HTMLConfigBuilder()
      .setFileName('OrderItems_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('OrderItems_Listesi')
        .addColumn({
          field: 'quantity',
          header: 'Adet',
          width: 15
        })
        .addColumn({
          field: 'price',
          header: 'Fiyat',
          width: 15
        })
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

  // JSON dışa aktarma yapılandırması
  private getJsonConfig(): ReturnType<JsonConfigBuilder['build']> {
    // JsonConfigBuilder ile yapılandırma oluşturuluyor
    return new JsonConfigBuilder()
      .setFileName('OrderItems_Listesi')
      .addColumn({
        field: 'quantity',
        header: 'Adet',
      })
      .addColumn({
        field: 'price',
        header: 'Fiyat',
      })
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

  // TXT dışa aktarma yapılandırması
  private getTxtConfig(): ReturnType<TxtConfigBuilder['build']> {
    // TxtConfigBuilder ile yapılandırma oluşturuluyor
    return new TxtConfigBuilder()
      .setFileName('OrderItems_Listesi')
      .setColumnSeparator('\t')
      .addColumn({
        field: 'quantity',
        header: 'Adet',
        width: 15
      })
      .addColumn({
        field: 'price',
        header: 'Fiyat',
        width: 15
      })
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
      .build();
  }

  exportOrderItemsRequests(data: any[],format: ExportFormat): void {
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







