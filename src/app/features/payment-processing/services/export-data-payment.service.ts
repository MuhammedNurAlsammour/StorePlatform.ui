import { Injectable } from '@angular/core';
import { CsvConfigBuilder, ExcelConfigBuilder, ExportFormat, HTMLConfigBuilder, JsonConfigBuilder, ProfessionalCsvExportService, ProfessionalExcelExportService, ProfessionalHtmlExportService, ProfessionalJsonExportService, ProfessionalTxtExportService, TxtConfigBuilder } from '@coder-pioneers/shared';

@Injectable({
  providedIn: 'root'
})
export class ExportDataPaymentService {

  constructor(
    private excelService: ProfessionalExcelExportService,
    private htmlService: ProfessionalHtmlExportService,
    private csvService: ProfessionalCsvExportService,
    private jsonService: ProfessionalJsonExportService,
    private txtService: ProfessionalTxtExportService
  ) {}

  private getExcelConfig(): ReturnType<ExcelConfigBuilder['build']> {
    return new ExcelConfigBuilder()
      .setFileName('Payment_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('Payment_Listesi')
         .addColumn({
           field: 'PaymentName',
           header: 'Payment Adı',
           width: 20
         })
         .addColumn({
           field: 'overtimeName',
           header: 'Fazla Mesai Türü',
           width: 20
         })
         .addColumn({
           field: 'startDate',
           header: 'Başlangıç Tarihi',
           format: ProfessionalHtmlExportService.formatters.date()
         })
         .addColumn({
           field: 'endDate',
           header: 'Bitiş Tarihi',
           format: ProfessionalHtmlExportService.formatters.date()
         })
         .addColumn({
           field: 'duration',
           header: 'Dk Sayısı',
           format: ProfessionalHtmlExportService.formatters.number()
         })
         .addColumn({
           field: 'description',
           header: 'Açıklama',
         })
         .addColumn({
           field: 'leaveManagerName',
           header: 'Onaylayacak Yönetici',
         })
         .addColumn({
           field: 'status',
           header: 'Durum',
           format: ProfessionalHtmlExportService.formatters.status()
         })
        .setFreezePane(0, 1)
        .done()
      .build();
  }

  private getCsvConfig(): ReturnType<CsvConfigBuilder['build']> {
    return new CsvConfigBuilder()
      .setFileName('Payment_Listesi')
      .addColumn({
        field: 'PaymentName',
        header: 'Payment Adı',
      })
      .addColumn({
        field: 'overtimeName',
        header: 'Fazla Mesai Türü',
      })
      .addColumn({
        field: 'startDate',
        header: 'Başlangıç Tarihi',
        format: ProfessionalHtmlExportService.formatters.date()
      })
      .addColumn({
        field: 'endDate',
        header: 'Bitiş Tarihi',
        format: ProfessionalHtmlExportService.formatters.date()
      })
      .addColumn({
        field: 'duration',
        header: 'Dk Sayısı',
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
      })
      .addColumn({
        field: 'leaveManagerName',
        header: 'Onaylayacak Yönetici',
      })
      .addColumn({
        field: 'status',
        header: 'Durum',
        format: ProfessionalHtmlExportService.formatters.status()
      })
      .build();
  }


  private getHTMLConfig(): ReturnType<HTMLConfigBuilder['build']> {
    return new HTMLConfigBuilder()
      .setFileName('Payment_Listesi')
      .setTheme({
        headerBackground: '1F497D',
        headerFontColor: 'FFFFFF',
        alternateRowColor: 'F2F2F2',
        borderColor: '808080'
      })
      .addSheet('Payment_Listesi')
        .addColumn({
          field: 'PaymentName',
          header: 'Payment Adı',
          width: 20
        })
        .addColumn({
          field: 'overtimeName',
          header: 'Fazla Mesai Türü',
          width: 20
        })
        .addColumn({
          field: 'startDate',
          header: 'Başlangıç Tarihi',
          format: ProfessionalHtmlExportService.formatters.date()
        })
        .addColumn({
          field: 'endDate',
          header: 'Bitiş Tarihi',
          format: ProfessionalHtmlExportService.formatters.date()
        })
        .addColumn({
          field: 'duration',
          header: 'Dk Sayısı',
          format: ProfessionalHtmlExportService.formatters.number()
        })
        .addColumn({
          field: 'description',
          header: 'Açıklama',
          width: 20
        })
        .addColumn({
          field: 'leaveManagerName',
          header: 'Onaylayacak Yönetici',
          width: 20
        })
        .addColumn({
          field: 'status',
          header: 'Durum',
          format: ProfessionalHtmlExportService.formatters.status()
        })
        .setFreezePane(0, 1)
        .done()
      .build();
  }

  private getJsonConfig(): ReturnType<JsonConfigBuilder['build']> {
    return new JsonConfigBuilder()
      .setFileName('Payment_Listesi')
      .addColumn({
        field: 'PaymentName',
        header: 'Payment Adı',
      })
      .addColumn({
        field: 'overtimeName',
        header: 'Fazla Mesai Türü',
      })
      .addColumn({
        field: 'startDate',
        header: 'Başlangıç Tarihi',
        format: ProfessionalHtmlExportService.formatters.date()
      })
      .addColumn({
        field: 'endDate',
        header: 'Bitiş Tarihi',
        format: ProfessionalHtmlExportService.formatters.date()
      })
      .addColumn({
        field: 'duration',
        header: 'Dk Sayısı',
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'description',
        header: 'Açıklama',
      })
      .addColumn({
        field: 'leaveManagerName',
        header: 'Onaylayacak Yönetici',
      })
      .addColumn({
        field: 'status',
        header: 'Durum',
        format: ProfessionalHtmlExportService.formatters.status()
      })
      .setPrettyPrint(true)
      .build();
  }

  private getTxtConfig(): ReturnType<TxtConfigBuilder['build']> {
    return new TxtConfigBuilder()
      .setFileName('Payment_Listesi')
      .setColumnSeparator('\t')
      .addColumn({
        field: 'PaymentName',
        header: 'Payment Adı',
        width: 20
      })
      .addColumn({
        field: 'startDate',
        header: 'Başlangıç Tarihi',
        format: ProfessionalHtmlExportService.formatters.date()
      })
      .addColumn({
        field: 'endDate',
        header: 'Bitiş Tarihi',
        format: ProfessionalHtmlExportService.formatters.date()
      })
      .addColumn({
        field: 'duration',
        header: 'Dk Sayısı',
        format: ProfessionalHtmlExportService.formatters.number()
      })
      .addColumn({
        field: 'status',
        header: 'Durum',
        format: ProfessionalHtmlExportService.formatters.status()
      })
      .build();
  }

  exportPaymentRequests(data: any[],format: ExportFormat): void {
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










