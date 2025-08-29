import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { BaseComponent, DialogService, ExportFormat } from '@coder-pioneers/shared';
import { CoderPioneersListComponent, ColumnDefinition, PaginationState, TableAction, TableConfig, TableFeatures, TableSortConfig } from '@coder-pioneers/ui-layout-components';
import { RequestOrderItems } from '@features/order-management/contracts/requests/request-order-items';
import { RequestOrders } from '@features/order-management/contracts/requests/request-orders';
import { OrdersResponse, ResultOrder } from '@features/order-management/contracts/responses/orders-response';
import { OrderItemsCreateDialogComponent } from '@features/order-management/dialogs/order-items/order-items-create-dialog.component';
import { OrdersCreateDialogComponent } from '@features/order-management/dialogs/orders/orders-create-dialog.component';
import { ExportDataOrdersService } from '@features/order-management/services/export-data-orders.service';
import { OrdersService } from '@features/order-management/services/orders.service';
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
@ViewChild(CoderPioneersListComponent) baseTable?: CoderPioneersListComponent<ResultOrder>;

@ViewChild(MatTable) table!: MatTable<ResultOrder>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
//#endregion

//#region Component Properties - Komponent Özellikleri
/** Tablo verileri */
tableData: ResultOrder[] = [];
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
onRowClick(row: ResultOrder) {
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
    name: 'rowCreatedDate',
    label: 'Sipariş Tarihi',
    visible: true,
    sortable: true,
    type: 'date',
    showTooltip: true
  },
  {
    name: 'status',
    label: 'Durum',
    visible: true,
    sortable: true,
    type: 'number',
    showTooltip: true
  },
  {
    name: 'totalAmount',
    label: 'Toplam Tutar',
    visible: true,
    sortable: true,
    type: 'number',
    showTooltip: true
  },
  {
    name: 'authUserName',
    label: 'Kullanıcı Adı',
    visible: true,
    sortable: false,
    type: 'string',
    showTooltip: false
  },
  {
    name: 'authCustomerName',
    label: 'Müşteri Adı',
    visible: true,
    sortable: false,
    type: 'string',
    showTooltip: false
  }
];

sortConfig: TableSortConfig = {
  storagePrefix: 'Orders-type',
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
  updatePermission: 'PUT.Updating.SiparişlerGüncelemek',
  deletePermission: 'DELETE.Deleting.SiparişlerSilme',
  deleteController: '',
  deleteAction: '',
  handler: (element) => {}
};
//#endregion

constructor(
  private dialogService:DialogService,
  spinner: NgxSpinnerService,
  private cdr: ChangeDetectorRef,
  private OrdersService: OrdersService,
  private exportOrdersService:ExportDataOrdersService,
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
  const responseTotalRows = await this.OrdersService.read({
    customerId,
    institutionId,
    page: paginationState?.pageIndex || 0,
    size: paginationState?.pageSize || 1
  });

  if (responseTotalRows) {
    this.totalRows = Number(responseTotalRows.result?.totalCount || 0);
  }

  const response = await this.OrdersService.read(
    {
      customerId,
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || this.totalRows
    }
  );

  if (response) {
    const allProduct: OrdersResponse = response;
    this.tableData = [...allProduct.result?.orders || []];
    this.totalRows = Number(allProduct.result?.totalCount || 0);
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
update(element: ResultOrder) {
 const updateUserId = sessionStorage.getItem('userId')!;
  const model = new RequestOrders();
  model.id = element.id;
  model.authCustomerId = element.authCustomerId;
  model.authUserId = element.authUserId;
  model.userId = updateUserId;
  //yeni alanlar
  model.totalAmount = element.totalAmount;
  this.dialogService.openDialog({
   componentType: OrdersCreateDialogComponent,
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
    this.exportOrdersService.exportOrdersRequests(formattedData,'html');
  } else if (format === 'excel') {
    this.exportOrdersService.exportOrdersRequests(formattedData,'excel');
  } else if (format === 'csv') {
    this.exportOrdersService.exportOrdersRequests(formattedData,'csv');
  } else if (format === 'json') {
    this.exportOrdersService.exportOrdersRequests(formattedData,'json');
  } else if (format === 'txt') {
    this.exportOrdersService.exportOrdersRequests(formattedData,'txt');
  }
}

private getFormattedData(selection: any[], dataSource: any[]): ResultOrder[] {
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
    username: item.username,
    institutionId: item.institutionId,
    institutionName: item.institutionName,
    createdUserId: item.createdBy,
    createdAt: item.createdDate,
    updatedUserId: item.modifiedBy,
    updatedAt: item.modifiedDate,
    isActive: 1,
    Name: item.Name,
    cartId: item.cartId,
    orderDate: item.orderDate,
    status: item.status,
    totalAmount: item.totalAmount,
    quantity: item.quantity,
    rowIsActive: item.rowIsActive,
    rowIsDeleted: item.rowIsDeleted,
    rowActiveAndNotDeleted: item.rowActiveAndNotDeleted,
    rowIsNotDeleted: item.rowIsNotDeleted,
    orderId: item.orderId,
    authUserName: item.authUserName,
    authCustomerName: item.authCustomerName
  }));
}


exportToExcel = () => this.export('excel');
exportToCSV = () => this.export('csv');
exportToJSON = () => this.export('json');
exportToTXT = () => this.export('txt');
exportToHTML = () => this.export('html');
//#endregion

}








