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
export class ExportDataTicketPaymentService {

  constructor(
    private excelService: ProfessionalExcelExportService,
    private htmlService: ProfessionalHtmlExportService,
    private csvService: ProfessionalCsvExportService,
    private jsonService: ProfessionalJsonExportService,
    private txtService: ProfessionalTxtExportService
  ) {}

  private getExcelConfig(): ReturnType<ExcelConfigBuilder['build']> {
    return new ExcelConfigBuilder()
      .setFileName('Yemek Kartı Tanımları')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('Yemek Kartı Tanımları')
         .addColumn({
           field: 'year',
           header: 'Yıl',
           width: 20
         })
         .addColumn({
           field: 'month',
           header: 'Ay',
           width: 20
         })
         .addColumn({
           field: 'mealPrice',
           header: 'Yemek Fiyatı',
           format: ProfessionalExcelExportService.formatters.number()
         })
        .setFreezePane(0, 1)
        .done()
      .build();
  }

  private getCsvConfig(): ReturnType<CsvConfigBuilder['build']> {
    return new CsvConfigBuilder()
      .setFileName('Yemek Kartı Tanımları')
      .addColumn({
        field: 'year',
        header: 'Yıl',
      })
      .addColumn({
        field: 'month',
        header: 'Ay',
      })
      .addColumn({
        field: 'mealPrice',
        header: 'Yemek Fiyatı',
        format: ProfessionalCsvExportService.formatters.number()
      })

      .build();
  }


  private getHTMLConfig(): ReturnType<HTMLConfigBuilder['build']> {
    return new HTMLConfigBuilder()
      .setFileName('Yemek Kartı Tanımları')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('Yemek Kartı Tanımları')
        .addColumn({
          field: 'year',
          header: 'Yıl',
          width: 20
        })
        .addColumn({
          field: 'month',
          header: 'Ay',
          width: 20
        })
        .addColumn({
          field: 'mealPrice',
          header: 'Yemek Fiyatı',
          format: ProfessionalHtmlExportService.formatters.number()
        })

        .setFreezePane(0, 1)
        .done()
      .build();
  }

  private getJsonConfig(): ReturnType<JsonConfigBuilder['build']> {
    return new JsonConfigBuilder()
      .setFileName('Yemek Kartı Tanımları')
      .addColumn({
        field: 'year',
        header: 'Yıl',
      })
      .addColumn({
        field: 'month',
        header: 'Ay',
      })
      .addColumn({
        field: 'mealPrice',
        header: 'Yemek Fiyatı',
        format: ProfessionalCsvExportService.formatters.number()
      })

      .setPrettyPrint(true)
      .build();
  }

  private getTxtConfig(): ReturnType<TxtConfigBuilder['build']> {
    return new TxtConfigBuilder()
      .setFileName('Yemek Kartı Tanımları')
      .setColumnSeparator('\t')
      .addColumn({
        field: 'year',
        header: 'Yıl',
        width: 20
      })
      .addColumn({
        field: 'month',
        header: 'Ay',
        width: 20
      })
      .addColumn({
        field: 'mealPrice',
        header: 'Yemek Fiyatı',
        format: ProfessionalHtmlExportService.formatters.number()
      })
  
      .build();
  }

  exportTicketPaymentRequests(data: any[],format: ExportFormat): void {
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





















