import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AlertConfig,
  AlertPosition,
  AlertService,
  BaseComponent,
  DialogService,
  MaterialCreateModule,
  PermissionsService,
} from '@coder-pioneers/shared';
import { CoderPioneersCreateComponent } from '@coder-pioneers/ui-layout-components';
import { CustomerDefinitionsCreateDialogComponent } from '@features/identity-management/dialogs/customer-definitions/customer-definitions-create-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [MaterialCreateModule, CoderPioneersCreateComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent extends BaseComponent implements OnInit {
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

  constructor(
    private dialogService: DialogService,
    private alertService: AlertService,
    public permissionsService: PermissionsService,
    spinner: NgxSpinnerService
  ) {
    super(spinner);
    const config = new AlertConfig();
    config.duration = 5000;
    config.positionY = AlertPosition.Top;
    config.positionX = AlertPosition.Right;
    alertService.setConfig(config);
  }

  ngOnInit(): void {}

  //#region dialog
  create(): void {
    if (this.permissionsService.ifPermit('POST.Writing.CreateCustomer')) {
      this.dialogService.openDialog({
        componentType: CustomerDefinitionsCreateDialogComponent,
        options: { width: '730px' },
        disableClose: true,
        data: {},
        afterClosed: () => void this.created.emit(),
      });
    }
  }
  //#endregion

  /**
   * Kullanıcının yeterli izni olmadığı durumda uyarı gösterir.
   */
  createalert() {
    this.alertService.warning('Yetkiniz yok');
  }
  //#endregion

  //#region Arama Fonksiyonu
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



