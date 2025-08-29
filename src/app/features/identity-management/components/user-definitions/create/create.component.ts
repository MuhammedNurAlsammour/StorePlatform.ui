import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertConfig, AlertPosition, AlertService, BaseComponent, DialogService,  MaterialCreateModule, PermissionsService } from '@coder-pioneers/shared';
import { CoderPioneersCreateComponent } from '@coder-pioneers/ui-layout-components';
import { FilterBottomSheetService } from '@features/identity-management/bottom-sheet/filter-bottom-sheet.service';
import { UserDefinitionsCreateDialogComponent } from '@features/identity-management/dialogs/user-definitions-create-dialog/user-definitions-create-dialog.component';
import { UserDefinitionsService } from '@features/identity-management/services/user-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CoderPioneersCreateComponent,
    MaterialCreateModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent extends BaseComponent{
  @Output() created = new EventEmitter();
  @Output() searchFilter = new EventEmitter<string>();
  @Output() filterStatus = new EventEmitter<number>();

  //#region İndirme
  // html,json,excel,csv,txt
  //#endregion
  @Output() excel = new EventEmitter();
  @Output() csv = new EventEmitter();
  @Output() txt = new EventEmitter();
  @Output() json = new EventEmitter();
  @Output() html = new EventEmitter();

  //#region filtreleme
  //filtre1: Aktif veya Pasif kullanıcıları filtreleyin
  //#endregion
  @Output() filtre1 = new EventEmitter();
  @Output() filtre2 = new EventEmitter();
  @Output() filtre3 = new EventEmitter();
  @Output() filtre4 = new EventEmitter();

  @Output() durumuChanged = new EventEmitter<boolean>();
  selectedStatus: boolean | null = null;
  constructor(
    private dialogService: DialogService,
    private userDefinitionService: UserDefinitionsService,
    private alertService: AlertService,
    private filterService: FilterBottomSheetService,
    spinner: NgxSpinnerService,
    public permissionsService:PermissionsService,
 )
 {
    super(spinner);
    const config = new AlertConfig();
    config.duration = 5000;
    config.positionY = AlertPosition.Top;
    config.positionX = AlertPosition.Right;
    alertService.setConfig(config);
  }


  //#region Oluşturma
  //created: Kullanıcı oluşturulduğunda tetiklenir
  create(): void {
    if (this.permissionsService.ifPermit('POST.Writing.OnaySüreciOluştur')){
      this.dialogService.openDialog({
        componentType: UserDefinitionsCreateDialogComponent,
        options: { width: '730px' },
        disableClose: true,
        data: {},
        afterClosed: () => void this.created.emit()
      });
    } else {
      this.alertService.warning('yetkiniz yok');
    }
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
  //#endregion

  //#region Filtreleme Fonksiyonu
  handleFilter(type: string): void {
    switch (type) {
      case 'filtre1':
        this.openStatusFilter();
        break;
      default:
        console.error('Bilinmeyen dışa aktarma türü:', type);
    }
  }

  filterOptions = [
    {
      type: 'filtre1',
      title: 'Kullanıcı Durumu Filtreleme',
      description: 'Aktif veya Pasif kullanıcıları filtreleyin',
      icon: 'person_outline',
      class: 'excel-item'
    }
  ];

  openStatusFilter(): void {
    this.filterService.openStatusFilter(this.selectedStatus)
      .subscribe(result => {
        if (result !== undefined) {

          this.selectedStatus = result;
          this.durumuChanged.emit(result!);
        }
      });
  }

  filterList(value: string) {
    this.searchFilter.emit(value);
  }
  //#endregion



}




















