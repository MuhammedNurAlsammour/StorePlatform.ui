import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionsService } from '@coder-pioneers/shared';
import { AlertConfig, AlertPosition, AlertService } from '@coder-pioneers/shared';
import { DialogService } from '@coder-pioneers/shared';
import { TypeOfResignationCreateDialogComponent } from '@features/definitions/dialogs/type-of-resignation/type-of-resignation-create-dialog.component';
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
)
{
  super(spinner);
  const config = new AlertConfig();
  config.duration = 5000;
  config.positionY = AlertPosition.Top;
  config.positionX = AlertPosition.Right;
  alertService.setConfig(config);
}

ngOnInit(): void {}

//#region Dialog Yönetimi
create() {
  if (this.permissionsService.ifPermit('POST.Writing.IstifaTanimiEkle')) {
    this.dialogService.openDialog({
      componentType: TypeOfResignationCreateDialogComponent,
      options: {
        width: '730px'
      },
      disableClose: true,
      data: {},
      afterClosed: () => this.created.emit()
    });
  }
}

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




















