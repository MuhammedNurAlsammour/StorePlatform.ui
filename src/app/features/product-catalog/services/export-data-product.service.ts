import { Injectable } from '@angular/core';
import { ExcelConfigBuilder } from '@coder-pioneers/shared';
import { CsvConfigBuilder, ProfessionalCsvExportService } from '@coder-pioneers/shared';
import { ProfessionalExcelExportService } from '@coder-pioneers/shared';
import { JsonConfigBuilder, ProfessionalJsonExportService } from '@coder-pioneers/shared';
import { HTMLConfigBuilder, ProfessionalHtmlExportService } from '@coder-pioneers/shared';
import { ProfessionalTxtExportService, TxtConfigBuilder } from '@coder-pioneers/shared';
import { ExportFormat } from '@coder-pioneers/shared';

@Injectable({
  providedIn: 'root'
})
export class ExportDataProductService {

  constructor(
    private excelService: ProfessionalExcelExportService,
    private htmlService: ProfessionalHtmlExportService,
    private csvService: ProfessionalCsvExportService,
    private jsonService: ProfessionalJsonExportService,
    private txtService: ProfessionalTxtExportService
  ) {}

  // إن شاء الله aşağıdaki fonksiyonlar ürün dışa aktarma için güncellenmiştir.

  // Excel yapılandırması
  private getExcelConfig(): ReturnType<ExcelConfigBuilder['build']> {
    // ExcelConfigBuilder ile dosya ve kolon ayarları yapılır
    return new ExcelConfigBuilder()
      .setFileName('Product_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('Product_Listesi')
        .addColumn({
          field: 'productName',
          header: 'Ürün Adı',
          width: 20
        })
        .addColumn({
          field: 'productDescription',
          header: 'Açıklama',
          width: 40
        })
        .addColumn({
          field: 'productPrice',
          header: 'Fiyat',
          width: 15,
          format: ProfessionalHtmlExportService.formatters.number()
        })
        .addColumn({
          field: 'productStock',
          header: 'Stok',
          width: 15,
          format: ProfessionalHtmlExportService.formatters.number()
        })
        .addColumn({
          field: 'productIsActive',
          header: 'Aktif mi?',
          width: 12
        })
        .setFreezePane(0, 1)
        .done()
      .build();
  }

  // CSV yapılandırması
  private getCsvConfig(): ReturnType<CsvConfigBuilder['build']> {
    // CsvConfigBuilder ile dosya ve kolon ayarları yapılır
    return new CsvConfigBuilder()
      .setFileName('Product_Listesi')
      .addColumn({
        field: 'productName',
        header: 'Ürün Adı',
      })
      .addColumn({
        field: 'productDescription',
        header: 'Açıklama',
      })
      .addColumn({
        field: 'productPrice',
        header: 'Fiyat',
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'productStock',
        header: 'Stok',
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'productIsActive',
        header: 'Aktif mi?',
      })
      .build();
  }

  // HTML yapılandırması
  private getHTMLConfig(): ReturnType<HTMLConfigBuilder['build']> {
    // HTMLConfigBuilder ile dosya ve kolon ayarları yapılır
    return new HTMLConfigBuilder()
      .setFileName('Product_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('Product_Listesi')
        .addColumn({
          field: 'productName',
          header: 'Ürün Adı',
          width: 20
        })
        .addColumn({
          field: 'productDescription',
          header: 'Açıklama',
          width: 40
        })
        .addColumn({
          field: 'productPrice',
          header: 'Fiyat',
          width: 15,
          format: ProfessionalHtmlExportService.formatters.number()
        })
        .addColumn({
          field: 'productStock',
          header: 'Stok',
          width: 15,
          format: ProfessionalHtmlExportService.formatters.number()
        })
        .addColumn({
          field: 'productIsActive',
          header: 'Aktif mi?',
          width: 12
        })
        .setFreezePane(0, 1)
        .done()
      .build();
  }

  // JSON yapılandırması
  private getJsonConfig(): ReturnType<JsonConfigBuilder['build']> {
    // JsonConfigBuilder ile dosya ve kolon ayarları yapılır
    return new JsonConfigBuilder()
      .setFileName('Product_Listesi')
      .addColumn({
        field: 'productName',
        header: 'Ürün Adı',
      })
      .addColumn({
        field: 'productDescription',
        header: 'Açıklama',
      })
      .addColumn({
        field: 'productPrice',
        header: 'Fiyat',
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'productStock',
        header: 'Stok',
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'productIsActive',
        header: 'Aktif mi?',
      })
      .setPrettyPrint(true)
      .build();
  }

  // TXT yapılandırması
  private getTxtConfig(): ReturnType<TxtConfigBuilder['build']> {
    // TxtConfigBuilder ile dosya ve kolon ayarları yapılır
    return new TxtConfigBuilder()
      .setFileName('Product_Listesi')
      .setColumnSeparator('\t')
      .addColumn({
        field: 'productName',
        header: 'Ürün Adı',
        width: 20
      })
      .addColumn({
        field: 'productDescription',
        header: 'Açıklama',
        width: 40
      })
      .addColumn({
        field: 'productPrice',
        header: 'Fiyat',
        width: 15,
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'productStock',
        header: 'Stok',
        width: 15,
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'productIsActive',
        header: 'Aktif mi?',
        width: 12
      })
      .build();
  }

  exportProductRequests(data: any[],format: ExportFormat): void {
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



















