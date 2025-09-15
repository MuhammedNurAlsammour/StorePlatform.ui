import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { ExportFormat } from '@coder-pioneers/shared';
import { DialogService } from '@coder-pioneers/shared';
import { RequestTicketPayment } from '@features/definitions/contracts/requests/request-ticket-payment';
import { ResultTicketPayment, TicketPaymentResponse } from '@features/definitions/contracts/responses/ticket-payment-response';
import { TicketPaymentCreateDialogComponent } from '@features/definitions/dialogs/ticket-payment/ticket-payment-create-dialog.component';
import { ExportDataTicketPaymentService } from '@features/definitions/services/export-data-ticket-payment.service';
import { TicketPaymentService } from '@features/definitions/services/ticket-payment.service';
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
baseTable?: CoderPioneersListComponent<ResultTicketPayment>;
@ViewChild(MatTable) table!: MatTable<ResultTicketPayment>;
@ViewChild(MatPaginator) paginator!: MatPaginator;
//#endregion

//#region Component Properties - Komponent Özellikleri
/** Tablo verileri */
tableData: ResultTicketPayment[] = [];
isDataLoading: boolean = false;
@Input() filterValue?: string = '';
@Input() totalRows: number = 0;
@Input() initialPageIndex: number = 0;
//#endregion

//#region Formatlama
// Formatlama
onRowClick(row: ResultTicketPayment) {
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
    name: 'year',
    label: 'Yıl',
    visible: true,
    sortable: true,
    type: 'number',
    showTooltip: true
  },
  {
    name: 'month',
    label: 'Ay',
    visible: true,
    sortable: true,
    type: 'month',
    showTooltip: true
  },
  {
    name: 'mealPrice',
    label: 'Yemek Fiyatı',
    visible: true,
    sortable: true,
    type: 'number',
    showTooltip: true
  }
];

sortConfig: TableSortConfig = {
  storagePrefix: 'Ticket-Payment-type',
};

tableConfig: TableConfig = {
  showCheckbox: true,
  showActions: true,
  showActionsHeader: true,
  showActionsRow: true,
  pageSizeOptions: [15, 20, 25],
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
  hasEditOrDeletePermission: true,
  label: 'Düzenle',
  icon: 'edit_note',
  color: 'blue',
  updatePermission: 'PUT.Updating.YemekKartiTanimiGüncelle',
  deletePermission: 'DELETE.Deleting.YemekKartiTanimiSil',
  deleteController: 'TicketPayment',
  deleteAction: 'DeleteTicketPayment',
  handler: (element) => {}
};
//#endregion

constructor(
  private dialogService:DialogService,
  spinner: NgxSpinnerService,
  private cdr: ChangeDetectorRef,
  private TicketPaymentService: TicketPaymentService,
  private exportTicketPaymentService:ExportDataTicketPaymentService,
)
{
  super(spinner);
}

//#region ngOnInit
// Sayfa yüklendiğinde ilk çalışacak işlemler
//#endregion
ngOnInit(): void {
  this.getList();
}

//#region Listeleme
// Verileri listeleyen fonksiyonları
//#endregion
async getList(paginationState?: PaginationState) {
  this.isDataLoading = true;
  const customerId = sessionStorage.getItem('customerId') || null;
  const institutionId = sessionStorage.getItem('institutionId') || null;
  const responseTotalRows = await this.TicketPaymentService.read({
    customerId,
    institutionId,
    page: paginationState?.pageIndex || 0,
    size: paginationState?.pageSize || 1
  });

  if (responseTotalRows) {
    this.totalRows = Number(responseTotalRows.refId);
  }

  const response = await this.TicketPaymentService.read(
    {
      customerId,
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || this.totalRows
    }
  );

  if (response) {
    const allProduct: TicketPaymentResponse = response;
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

//#region dialog
// Güncelleme/ekleme işlemi için diyalog açma fonksiyonu
update(element: ResultTicketPayment) {
 const updateUserId = sessionStorage.getItem('userId')!;
  const model = new RequestTicketPayment();
  model.id = element.id;
  model.customerId = element.customerId;
  model.year = element.year;
  model.month = element.month;
  model.mealPrice = element.mealPrice;
  this.dialogService.openDialog({
   componentType: TicketPaymentCreateDialogComponent,
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
    this.exportTicketPaymentService.exportTicketPaymentRequests(formattedData,'html');
  } else if (format === 'excel') {
    this.exportTicketPaymentService.exportTicketPaymentRequests(formattedData,'excel');
  } else if (format === 'csv') {
    this.exportTicketPaymentService.exportTicketPaymentRequests(formattedData,'csv');
  } else if (format === 'json') {
    this.exportTicketPaymentService.exportTicketPaymentRequests(formattedData,'json');
  } else if (format === 'txt') {
    this.exportTicketPaymentService.exportTicketPaymentRequests(formattedData,'txt');
  }
}

private getFormattedData(selection: any[], dataSource: any[]): ResultTicketPayment[] {
  const data = selection.length > 0 ? selection : dataSource;
  return data.map(item => ({
    id: item.id,
    year: item.year,
    month: item.month,
    mealPrice: item.mealPrice,
    customerId: item.customerId
  }));
}


exportToExcel = () => this.export('excel');
exportToCSV = () => this.export('csv');
exportToJSON = () => this.export('json');
exportToTXT = () => this.export('txt');
exportToHTML = () => this.export('html');
//#endregion

}























