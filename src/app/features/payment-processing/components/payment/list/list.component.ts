import { AfterViewInit,ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { DialogService } from '@coder-pioneers/shared';
import { RequestCountry } from '@features/area-definitions/contracts/requests/request-country';
import { ListCountryResponse, ResultCountry } from '@features/area-definitions/contracts/responses/list-country-response';
import { CountryDefinitionsCreateDialogComponent } from '@features/area-definitions/dialogs/country-definitions-create-dialog/country-definitions-create-dialog.component';
import { CountryService } from '@features/area-definitions/services/country.service';
import { CoderPioneersListComponent, ColumnDefinition, PaginationState, TableAction, TableConfig, TableFeatures, TableSortConfig } from '@coder-pioneers/ui-layout-components';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '@coder-pioneers/shared';
import { ExportFormat } from '@coder-pioneers/shared';

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
@ViewChild(CoderPioneersListComponent) baseTable?: CoderPioneersListComponent<ResultPayment>;

@ViewChild(MatTable) table!: MatTable<ResultPayment>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
//#endregion

//#region Component Properties - Komponent Özellikleri
/** Tablo verileri */
tableData: ResultPayment[] = [];
isDataLoading: boolean = false;

/** Filtre değeri */
@Input() filterValue?: string = '';

/** Toplam satır sayısı */
@Input() totalRows: number = 0;

/** İlk sayfa indeksi */
@Input() initialPageIndex: number = 0;
//#endregion

//#region Formatlama
// Formatlama
onRowClick(row: ResultPayment) {
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
    name: 'Name',
    label: ' Adı',
    visible: true,
    sortable: true,
    type: 'string',
    showTooltip: true
  }
];

sortConfig: TableSortConfig = {
  storagePrefix: 'Payment-type-devs',
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
  search: true,
  dragDrop: false
};

tableActions: TableAction = {
  title: 'Kullanılabilir Veri Yok',
  subtitle: 'Görüntülenecek herhangi bir kayıt bulunamadı',
  approvePermission: '',
  hasEditOrDeletePermission: false,
  label: 'Düzenle',
  icon: 'edit_note',
  color: 'blue',
  updatePermission: 'PUT.Updating.ÖdemelerGüncelemek',
  deletePermission: 'DELETE.Deleting.ÖdemelerSilme',
  deleteController: '',
  deleteAction: '',
  handler: (element) => {}
};
//#endregion

constructor(
  private dialogService:DialogService,
  spinner: NgxSpinnerService,
  private cdr: ChangeDetectorRef,
  private PaymentService: PaymentService,
  private exportPaymentService:ExportPaymentService,
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
  const responseTotalRows = await this.PaymentService.read({
    customerId,
    institutionId,
    page: paginationState?.pageIndex || 0,
    size: paginationState?.pageSize || 1
  });

  if (responseTotalRows) {
    this.totalRows = Number(responseTotalRows.result.totalCount);
  }

  const response = await this.PaymentService.read(
    {
      customerId,
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || this.totalRows
    }
  );

  if (response) {
    const allProduct: PaymentResponse = response;
    this.tableData = [...allProduct.result.Payment];
    this.totalRows = Number(allProduct.result.totalCount);
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
update(element: ResultPayment) {
 const updateUserId = sessionStorage.getItem('userId')!;
  const model = new RequestPayment();
  model.id = element.id;
  model.institutionId = element.institutionId;
  model.customerId = element.customerId;
  model.authCustomerId = element.authCustomerId;
  model.authUserId = element.authUserId;
  model.userId = updateUserId;
  model.productId = element.productId;
  //yeni alanlar
  model.Name = element.Name;
  this.dialogService.openDialog({
   componentType: PaymentCreateDialogComponent,
   options: {
     width: '730px'
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
    this.exportPaymentService.exportRequests(formattedData,'html');
  } else if (format === 'excel') {
    this.exportPaymentService.exportRequests(formattedData,'excel');
  } else if (format === 'csv') {
    this.exportPaymentService.exportRequests(formattedData,'csv');
  } else if (format === 'json') {
    this.exportPaymentService.exportRequests(formattedData,'json');
  } else if (format === 'txt') {
    this.exportPaymentService.exportRequests(formattedData,'txt');
  }
}

private getFormattedData(selection: any[], dataSource: any[]): ResultPayment[] {
  const data = selection.length > 0 ? selection : dataSource;
  return data.map(item => ({
    id: item.id,
    productId: item.productId,
    authUserId: item.authUserId,
    authCustomerId: item.authCustomerId,
    rowCreatedDate: item.rowCreatedDate,
    rowUpdatedDate: item.rowUpdatedDate,
    customerId: item.customerId,
    customerName: item.customerName,
    institutionId: item.institutionId,
    institutionName: item.institutionName,
    createdUserId: item.createdBy,
    createdAt: item.createdDate,
    updatedUserId: item.modifiedBy,
    updatedAt: item.modifiedDate,
    isActive: 1,
    Name: item.Name,
  }));
}


exportToExcel = () => this.export('excel');
exportToCSV = () => this.export('csv');
exportToJSON = () => this.export('json');
exportToTXT = () => this.export('txt');
exportToHTML = () => this.export('html');
//#endregion

}









