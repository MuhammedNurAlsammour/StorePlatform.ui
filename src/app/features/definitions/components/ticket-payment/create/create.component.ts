import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionsService } from '@coder-pioneers/shared';
import { AlertConfig, AlertPosition, AlertService } from '@coder-pioneers/shared';
import { DialogService } from '@coder-pioneers/shared';
import { TicketPaymentCreateDialogComponent } from '@features/definitions/dialogs/ticket-payment/ticket-payment-create-dialog.component';
import { BaseComponent } from '@coder-pioneers/shared';
import { CoderPioneersCreateComponent } from '@coder-pioneers/ui-layout-components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CoderPioneersCreateComponent
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent extends BaseComponent implements OnInit{
// Bileşenden dışarıya yayılacak olaylar
@Output() created = new EventEmitter();
@Output() searchFilter = new EventEmitter<string>();
@Output() excel = new EventEmitter();
@Output() csv = new EventEmitter();
@Output() txt = new EventEmitter();
@Output() json = new EventEmitter();
@Output() html = new EventEmitter();

@Output() filtre1 = new EventEmitter();
@Output() filtre2 = new EventEmitter();
@Output() filtre3 = new EventEmitter();
@Output() filtre4 = new EventEmitter();

/**
 * Dışa aktarma seçenekleri.
 * Her seçenek, dosya türfiltre1ü, ikon ve etiket içerir.
 */
exportOptions = [
  {
    type: 'excel',
    title: 'Excel Dışa Aktar',
    description: 'Düzenli Tablolar',
    icon: 'table_chart',
    class: 'excel-item'
  },
  {
    type: 'csv',
    title: 'CSV Dışa Aktar',
    description: 'Virgülle Ayrılmış Veriler',
    icon: 'text_snippet',
    class: 'csv-item'
  },
  {
    type: 'txt',
    title: 'TXT Dışa Aktar',
    description: 'Metin Dosyası',
    icon: 'description',
    class: 'txt-item'
  },
  {
    type: 'json',
    title: 'JSON Dışa Aktar',
    description: 'JSON Formatı',
    icon: 'code',
    class: 'json-item'
  },
  {
    type: 'html',
    title: 'HTML Dışa Aktar',
    description: 'Web Sayfası',
    icon: 'language',
    class: 'html-item'
  }
];


/**
 * Filtreleme seçenekleri.
 * Her seçenek, fltreleme türü, ikon ve etiket içerir.
 */
filterOptions = [
  {
    type: 'filtre1',
    title: 'Excel Dışa Aktar',
    description: 'Düzenli Tablolar',
    icon: 'table_chart',
    class: 'excel-item'
  },
  {
    type: 'filtre2',
    title: 'CSV Dışa Aktar',
    description: 'Virgülle Ayrılmış Veriler',
    icon: 'text_snippet',
    class: 'csv-item'
  },
  {
    type: 'filtre3',
    title: 'TXT Dışa Aktar',
    description: 'Metin Dosyası',
    icon: 'description',
    class: 'txt-item'
  },
  {
    type: 'filtre4',
    title: 'JSON Dışa Aktar',
    description: 'JSON Formatı',
    icon: 'code',
    class: 'json-item'
  }
];

constructor(
  private dialogService: DialogService,
  private alertService: AlertService,
  public permissionsService: PermissionsService,
  spinner: NgxSpinnerService
) {
  super(spinner);

  // Uyarı servisi için varsayılan yapılandırma
  const config = new AlertConfig();
  config.duration = 5000;
  config.positionY = AlertPosition.Top; 
  config.positionX = AlertPosition.Right; 
  alertService.setConfig(config);
}

/**
 * ngOnInit yaşam döngüsü metodu.
 * Başlangıç ayarları veya veri yükleme işlemleri burada yapılabilir.
 */
ngOnInit(): void {
}

//#region Dialog Yönetimi
/**
 * Yeni bir tatil tanımı oluşturmak için dialog açar.
 * Kullanıcının gerekli izni olup olmadığını kontrol eder.
 */
create() {
  if (this.permissionsService.ifPermit('POST.Writing.YemekKartiTanimiEkle')) {
    this.dialogService.openDialog({
      componentType: TicketPaymentCreateDialogComponent,
      options: { width: '730px' },
      disableClose: true,
      data: {},
      afterClosed: () => this.created.emit()
    });
  }
}

/**
 * Kullanıcının yeterli izni olmadığı durumda uyarı gösterir.
 */
createalert() {
  this.alertService.warning('Yetkiniz yok');
}
//#endregion


filterList(value: string) {
  this.searchFilter.emit(value);
}
//#endregion

//#region Dışa Aktarma Fonksiyonu

handleExport(type: string): void {
  switch (type) {
    case 'excel':
      this.excel.emit();
      break;
    case 'csv':
      this.csv.emit();
      break;
    case 'txt':
      this.txt.emit();
      break;
    case 'json':
      this.json.emit();
      break;
    case 'html':
      this.html.emit();
      break;
    default:
      console.error('Bilinmeyen dışa aktarma türü:', type);
  }
}
//#endregion


//#region Filtreleme Fonksiyonu

handleFilter(type: string): void {
  switch (type) {
    case 'filtre1':
      this.filtre1.emit();
      break;
    case 'filtre2':
      this.filtre2.emit();
      break;
    case 'filtre3':
      this.filtre3.emit();
      break;
    case 'filtre4':
      this.filtre4.emit();
      break;
    default:
      console.error('Bilinmeyen dışa aktarma türü:', type);
  }
}
//#endregion
}























