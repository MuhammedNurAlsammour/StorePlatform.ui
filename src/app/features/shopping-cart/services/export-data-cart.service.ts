import { Injectable } from '@angular/core';
import { CsvConfigBuilder, ExcelConfigBuilder, ExportFormat, HTMLConfigBuilder, JsonConfigBuilder, ProfessionalCsvExportService, ProfessionalExcelExportService, ProfessionalHtmlExportService, ProfessionalJsonExportService, ProfessionalTxtExportService, TxtConfigBuilder } from '@coder-pioneers/shared';

@Injectable({
  providedIn: 'root'
})
export class ExportDataCartService {

  constructor(
    private excelService: ProfessionalExcelExportService,
    private htmlService: ProfessionalHtmlExportService,
    private csvService: ProfessionalCsvExportService,
    private jsonService: ProfessionalJsonExportService,
    private txtService: ProfessionalTxtExportService
  ) {}

  // Excel yapılandırması
  private getExcelConfig(): ReturnType<ExcelConfigBuilder['build']> {
    // Excel dosyası için başlıklar ve sütunlar tanımlanıyor
    return new ExcelConfigBuilder()
      .setFileName('Cart_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('Cart_Listesi')
        .addColumn({
          field: 'customerName',
          header: 'Müşteri Adı',
          width: 20
        })
        .addColumn({
          field: 'institutionName',
          header: 'Kurum Adı',
          width: 20
        })
        .addColumn({
          field: 'Name',
          header: 'Ürün Adı',
          width: 20
        })
        .addColumn({
          field: 'quantity',
          header: 'Miktar',
          width: 15,
          format: ProfessionalHtmlExportService.formatters.number()
        })
        .addColumn({
          field: 'price',
          header: 'Fiyat',
          width: 15,
          format: ProfessionalHtmlExportService.formatters.number()
        })
        .addColumn({
          field: 'rowCreatedDate',
          header: 'Oluşturulma Tarihi',
          width: 20,
          format: ProfessionalHtmlExportService.formatters.date()
        })
        .addColumn({
          field: 'rowUpdatedDate',
          header: 'Güncellenme Tarihi',
          width: 20,
          format: ProfessionalHtmlExportService.formatters.date()
        })
        .setFreezePane(0, 1)
        .done()
      .build();
  }

  // CSV yapılandırması
  private getCsvConfig(): ReturnType<CsvConfigBuilder['build']> {
    // CSV dosyası için başlıklar ve sütunlar tanımlanıyor
    return new CsvConfigBuilder()
      .setFileName('Cart_Listesi')
      .addColumn({
        field: 'customerName',
        header: 'Müşteri Adı',
      })
      .addColumn({
        field: 'institutionName',
        header: 'Kurum Adı',
      })
      .addColumn({
        field: 'Name',
        header: 'Ürün Adı',
      })
      .addColumn({
        field: 'quantity',
        header: 'Miktar',
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'price',
        header: 'Fiyat',
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'rowCreatedDate',
        header: 'Oluşturulma Tarihi',
        format: ProfessionalHtmlExportService.formatters.date()
      })
      .addColumn({
        field: 'rowUpdatedDate',
        header: 'Güncellenme Tarihi',
        format: ProfessionalHtmlExportService.formatters.date()
      })
      .build();
  }

  // HTML yapılandırması
  private getHTMLConfig(): ReturnType<HTMLConfigBuilder['build']> {
    // HTML dosyası için başlıklar ve sütunlar tanımlanıyor
    return new HTMLConfigBuilder()
      .setFileName('Cart_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('Cart_Listesi')
        .addColumn({
          field: 'customerName',
          header: 'Müşteri Adı',
          width: 20
        })
        .addColumn({
          field: 'institutionName',
          header: 'Kurum Adı',
          width: 20
        })
        .addColumn({
          field: 'Name',
          header: 'Ürün Adı',
          width: 20
        })
        .addColumn({
          field: 'quantity',
          header: 'Miktar',
          width: 15,
          format: ProfessionalHtmlExportService.formatters.number()
        })
        .addColumn({
          field: 'price',
          header: 'Fiyat',
          width: 15,
          format: ProfessionalHtmlExportService.formatters.number()
        })
        .addColumn({
          field: 'rowCreatedDate',
          header: 'Oluşturulma Tarihi',
          width: 20,
          format: ProfessionalHtmlExportService.formatters.date()
        })
        .addColumn({
          field: 'rowUpdatedDate',
          header: 'Güncellenme Tarihi',
          width: 20,
          format: ProfessionalHtmlExportService.formatters.date()
        })
        .setFreezePane(0, 1)
        .done()
      .build();
  }

  // JSON yapılandırması
  private getJsonConfig(): ReturnType<JsonConfigBuilder['build']> {
    // JSON dosyası için başlıklar ve sütunlar tanımlanıyor
    return new JsonConfigBuilder()
      .setFileName('Cart_Listesi')
      .addColumn({
        field: 'customerName',
        header: 'Müşteri Adı',
      })
      .addColumn({
        field: 'institutionName',
        header: 'Kurum Adı',
      })
      .addColumn({
        field: 'Name',
        header: 'Ürün Adı',
      })
      .addColumn({
        field: 'quantity',
        header: 'Miktar',
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'price',
        header: 'Fiyat',
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'rowCreatedDate',
        header: 'Oluşturulma Tarihi',
        format: ProfessionalHtmlExportService.formatters.date()
      })
      .addColumn({
        field: 'rowUpdatedDate',
        header: 'Güncellenme Tarihi',
        format: ProfessionalHtmlExportService.formatters.date()
      })
      .setPrettyPrint(true)
      .build();
  }

  // TXT yapılandırması
  private getTxtConfig(): ReturnType<TxtConfigBuilder['build']> {
    // TXT dosyası için başlıklar ve sütunlar tanımlanıyor
    return new TxtConfigBuilder()
      .setFileName('Cart_Listesi')
      .setColumnSeparator('\t')
      .addColumn({
        field: 'customerName',
        header: 'Müşteri Adı',
        width: 20
      })
      .addColumn({
        field: 'institutionName',
        header: 'Kurum Adı',
        width: 20
      })
      .addColumn({
        field: 'Name',
        header: 'Ürün Adı',
        width: 20
      })
      .addColumn({
        field: 'quantity',
        header: 'Miktar',
        width: 15,
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'price',
        header: 'Fiyat',
        width: 15,
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'rowCreatedDate',
        header: 'Oluşturulma Tarihi',
        width: 20,
        format: ProfessionalHtmlExportService.formatters.date()
      })
      .addColumn({
        field: 'rowUpdatedDate',
        header: 'Güncellenme Tarihi',
        width: 20,
        format: ProfessionalHtmlExportService.formatters.date()
      })
      .build();
  }

  exportCartRequests(data: any[],format: ExportFormat): void {
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













