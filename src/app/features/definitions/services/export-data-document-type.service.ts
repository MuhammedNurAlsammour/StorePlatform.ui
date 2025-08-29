import { Injectable } from '@angular/core';
import { HTMLConfigBuilder, ProfessionalHtmlExportService } from '@coder-pioneers/shared';
import { ExcelConfigBuilder, ProfessionalExcelExportService } from '@coder-pioneers/shared';
import { CsvConfigBuilder, ProfessionalCsvExportService } from '@coder-pioneers/shared';
import { JsonConfigBuilder, ProfessionalJsonExportService } from '@coder-pioneers/shared';
import { ProfessionalTxtExportService, TxtConfigBuilder } from '@coder-pioneers/shared';
import { ExportFormat } from '@coder-pioneers/shared';

@Injectable({
  providedIn: 'root'
})
export class ExportDataDocumentTypeService {


  constructor(
    private excelService: ProfessionalExcelExportService,
    private htmlService: ProfessionalHtmlExportService,
    private csvService: ProfessionalCsvExportService,
    private jsonService: ProfessionalJsonExportService,
    private txtService: ProfessionalTxtExportService
  ) {}

  private getExcelConfig(): ReturnType<ExcelConfigBuilder['build']> {
    return new ExcelConfigBuilder()
      .setFileName('Dokümen_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('Dokümen Tanımları Listesi')
         .addColumn({
           field: 'name',
           header: 'Dokümen Adı',
           width: 20
         })
         .addColumn({
          field: 'institutionName',
          header: 'Kurum Adı',
          width: 20
        })
        .addColumn({
          field: 'customerName',
          header: 'Müşteri Adı',
          width: 20
        })

        .setFreezePane(0, 1)
        .done()
      .build();
  }

  private getCsvConfig(): ReturnType<CsvConfigBuilder['build']> {
    return new CsvConfigBuilder()
      .setFileName('Dokümen_Listesi')
      .addColumn({
        field: 'name',
        header: 'Dokümen Adı',
      })
      .addColumn({
       field: 'institutionName',
       header: 'Kurum Adı',
     })
     .addColumn({
       field: 'customerName',
       header: 'Müşteri Adı',
     })
      .build();
  }


  private getHTMLConfig(): ReturnType<HTMLConfigBuilder['build']> {
    return new HTMLConfigBuilder()
      .setFileName('Overtime_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('Dokümen Tanımları Listesi')
      .addColumn({
        field: 'name',
        header: 'Dokümen Adı',
      })
      .addColumn({
       field: 'institutionName',
       header: 'Kurum Adı',
     })
     .addColumn({
       field: 'customerName',
       header: 'Müşteri Adı',
     })
        .setFreezePane(0, 1)
        .done()
      .build();
  }

  private getJsonConfig(): ReturnType<JsonConfigBuilder['build']> {
    return new JsonConfigBuilder()
      .setFileName('Dokümen_Listesi')
      .addColumn({
        field: 'name',
        header: 'Dokümen Adı',
      })
      .addColumn({
       field: 'institutionName',
       header: 'Kurum Adı',
     })
     .addColumn({
       field: 'customerName',
       header: 'Müşteri Adı',
     })
      .setPrettyPrint(true)
      .build();
  }

  private getTxtConfig(): ReturnType<TxtConfigBuilder['build']> {
    return new TxtConfigBuilder()
      .setFileName('Dokümen_Listesi')
      .setColumnSeparator('\t')
      .addColumn({
        field: 'name',
        header: 'Dokümen Adı',
      })
      .addColumn({
       field: 'institutionName',
       header: 'Kurum Adı',
     })
     .addColumn({
       field: 'customerName',
       header: 'Müşteri Adı',
     })
      .build();
  }

  exportDocumentTypeRequests(data: any[],format: ExportFormat): void {
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




















