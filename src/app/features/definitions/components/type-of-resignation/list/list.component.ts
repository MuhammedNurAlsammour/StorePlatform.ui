import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { ExportFormat } from '@coder-pioneers/shared';
import { DialogService } from '@coder-pioneers/shared';
import { RequestTypeOfResignation } from '@features/definitions/contracts/requests/request-type-of-resignation';
import { ResultTypeOfResignation, TypeOfResignationResponse } from '@features/definitions/contracts/responses/type-of-resignation-response';
import { TypeOfResignationCreateDialogComponent } from '@features/definitions/dialogs/type-of-resignation/type-of-resignation-create-dialog.component';
import { ExportDataTypeOfResignationService } from '@features/definitions/services/export-data-type-of-resignation.service';
import { TypeOfResignationService } from '@features/definitions/services/type-of-resignation.service';
import { BaseComponent, SpinnerType } from '@coder-pioneers/shared';
import { CoderPioneersListComponent, ColumnDefinition, PaginationState, TableAction, TableConfig, TableFeatures, TableSortConfig } from '@coder-pioneers/ui-layout-components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CoderPioneersListComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent extends BaseComponent implements OnInit {
//#region ViewChild Tanımlamaları
@ViewChild(CoderPioneersListComponent) 
baseTable?: CoderPioneersListComponent<ResultTypeOfResignation>;
@ViewChild(MatTable) table!: MatTable<ResultTypeOfResignation>;
@ViewChild(MatPaginator) paginator!: MatPaginator;
//#endregion

//#region Component Properties - Komponent Özellikleri
/** Tablo verileri */
tableData: ResultTypeOfResignation[] = [];
isDataLoading: boolean = false;
@Input() filterValue?: string = '';
@Input() totalRows: number = 0;
@Input() initialPageIndex: number = 0;
//#endregion

//#region Formatlama
// Formatlama
onRowClick(row: ResultTypeOfResignation) {
}

onSortChange(sortEvent: { column: string; direction: 'asc' | 'desc' | null }) {
  this.getList();
}

async onPageChange(event: PaginationState) {
  await this.getList(event);
}
//#endregion


//#region Base
columns: ColumnDefinition[] = [
  {
    name: 'typeName',
    label: 'istifa tanimi adi',
    visible: true,
    sortable: true,
    type: 'string',
    showTooltip: true
  }
];

sortConfig: TableSortConfig = {
  storagePrefix: 'TypeOfResignation-type-devs',
};

tableConfig: TableConfig = {
  showCheckbox: true,
  showActions: true,
  showActionsHeader: true,
  showActionsRow: true,
  defaultPageSize: 15,
  stickyHeader: true,
  enableRowHover: true,
  enableStriped: true,
  rowHeight: '48px'
};

tableFeatures: TableFeatures = {
  sort: true,
  filter: true,
  paginator: true,
  columnResize: false,
  contextMenu: true,
  rowSelection: true,
  export: true,
  search: true
};

tableActions: TableAction = {
  title: 'Kullanılabilir Veri Yok',
  subtitle: 'Görüntülenecek herhangi bir kayıt bulunamadı',
  approvePermission: '',
  hasEditOrDeletePermission: false,
  label: 'Düzenle',
  icon: 'edit_note',
  color: 'blue',
  updatePermission: 'PUT.Updating.IstifaTanimiGüncelle',
  deletePermission: 'DELETE.Deleting.IstifaTanimiSil',
  deleteController: 'DocumentType',
  deleteAction: 'DeleteDocumentType',
  handler: (element) => {}
};
//#endregion

constructor(
  private dialogService:DialogService,
  spinner: NgxSpinnerService,
  private cdr: ChangeDetectorRef,
  private typeOfResignationService: TypeOfResignationService,
  private exportTypeOfResignationService:ExportDataTypeOfResignationService,
)
{
  super(spinner);
}


//#region ngOnInit
// Sayfa yüklendiğinde ilk çalışacak işlemler
ngOnInit(): void {
  this.getList();
}
//#endregion


//#region Listeleme
// Verileri listeleyen fonksiyonları
async getList(paginationState?: PaginationState) {
  this.isDataLoading = true;
  const customerId = sessionStorage.getItem('customerId') || null;
  const institutionId = sessionStorage.getItem('institutionId') || null;
  const responseTotalRows = await this.typeOfResignationService.read({
    customerId,
    institutionId,
    page: paginationState?.pageIndex || 0,
    size: paginationState?.pageSize || 1
  });

  if (responseTotalRows) {
    this.totalRows = Number(responseTotalRows.refId);
  }

  const response = await this.typeOfResignationService.read(
    {
      customerId,
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || this.totalRows
    }
  );

  if (response) {
    const allProduct: TypeOfResignationResponse = response;
    this.tableData = [...allProduct.result];
    this.totalRows = Number(allProduct.refId);
    requestAnimationFrame(() => {
      if (this.baseTable) {
        this.baseTable.dataSource._updateChangeSubscription();
        this.cdr.detectChanges();
      }
    });
    this.isDataLoading = false;
  } else {
    this.isDataLoading = false;
  }
}
//#endregion

//#region dialog
// Güncelleme/ekleme işlemi için diyalog açma fonksiyonu
update(element: ResultTypeOfResignation) {
 const updateUserId = sessionStorage.getItem('userId')!;
  const model = new RequestTypeOfResignation();
  model.id = element.id;
  model.userId = updateUserId;
  model.updateUserId = updateUserId;
  model.customerId = element.customerId;
  model.typeName = element.typeName;
  this.dialogService.openDialog({
   componentType: TypeOfResignationCreateDialogComponent,
   options: {
     width: '430px'
   },
   disableClose: true,
   data: model,
   afterClosed: () =>  void this.getList()
 });
}
//#endregion

//#region indirme
// indirme fonksiyonu
export(format: ExportFormat): void {
  if (!this.baseTable) return;
  const formattedData = this.getFormattedData(
    this.baseTable.selection.selected,
    this.baseTable.dataSource.data
  );

  if (format === 'html') {
    this.exportTypeOfResignationService.exportTypeOfResignationRequests(formattedData,'html');
  } else if (format === 'excel') {
    this.exportTypeOfResignationService.exportTypeOfResignationRequests(formattedData,'excel');
  } else if (format === 'csv') {
    this.exportTypeOfResignationService.exportTypeOfResignationRequests(formattedData,'csv');
  } else if (format === 'json') {
    this.exportTypeOfResignationService.exportTypeOfResignationRequests(formattedData,'json');
  } else if (format === 'txt') {
    this.exportTypeOfResignationService.exportTypeOfResignationRequests(formattedData,'txt');
  }
}

private getFormattedData(selection: any[], dataSource: any[]): ResultTypeOfResignation[] {
  const data = selection.length > 0 ? selection : dataSource;
  return data.map(item => ({
    id: item.id,
    customerId: item.customerId,
    customerName: item.customerName,
    institutionId: item.institutionId,
    institutionName: item.institutionName,
    typeName: item.typeName,
    createdUserId: item.createdBy,
    createdAt: item.createdDate,
    updatedUserId: item.modifiedBy || null,
    updatedAt: item.modifiedDate || null,
    isActive: 1
  }));
}


exportToExcel = () => this.export('excel');
exportToCSV = () => this.export('csv');
exportToJSON = () => this.export('json');
exportToTXT = () => this.export('txt');
exportToHTML = () => this.export('html');
//#endregion

}























