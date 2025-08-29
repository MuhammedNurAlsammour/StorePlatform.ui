import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import {
  BaseComponent,
  DialogService,
  ExportFormat,
} from '@coder-pioneers/shared';
import {
  CoderPioneersListComponent,
  ColumnDefinition,
  PaginationState,
  TableAction,
  TableConfig,
  TableFeatures,
  TableSortConfig,
} from '@coder-pioneers/ui-layout-components';
import { RequestOrderItems } from '@features/order-management/contracts/requests/request-order-items';
import {
  OrderItemsResponse,
  ResultOrderItems,
} from '@features/order-management/contracts/responses/order-items-response';
import { OrderItemsCreateDialogComponent } from '@features/order-management/dialogs/order-items/order-items-create-dialog.component';
import { ExportDataOrderItemsService } from '@features/order-management/services/export-data-order-items.service';
import { OrderItemsService } from '@features/order-management/services/order-items.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CoderPioneersListComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent extends BaseComponent implements OnInit {
  //#region ViewChild Tanımlamaları
  @ViewChild(CoderPioneersListComponent)
  baseTable?: CoderPioneersListComponent<ResultOrderItems>;

  @ViewChild(MatTable) table!: MatTable<ResultOrderItems>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion

  //#region Component Properties - Komponent Özellikleri
  /** Tablo verileri */
  tableData: ResultOrderItems[] = [];
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
  onRowClick(row: ResultOrderItems) {}

  onSortChange(sortEvent: {
    column: string;
    direction: 'asc' | 'desc' | null;
  }) {
    this.getList();
  }

  async onPageChange(event: PaginationState) {
    await this.getList(event);
  }
  //#endregion

  //#region Base
  columns: ColumnDefinition[] = [
    {
      name: 'quantity',
      label: 'Adet',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: false,
    },
    {
      name: 'price',
      label: 'Fiyat',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: false,
    },
    {
      name: 'authUserName',
      label: 'Kullanıcı Adı',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: false,
    },
    {
      name: 'authCustomerName',
      label: 'Müşteri Adı',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: false,
    },
    {
      name: 'rowCreatedDate',
      label: 'Sipariş ürünü oluşturulma tarihi',
      visible: true,
      sortable: true,
      type: 'dateTime',
      showTooltip: false,
    },
  ];

  sortConfig: TableSortConfig = {
    storagePrefix: 'OrderItems-type',
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
    rowHeight: '48px',
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
    dragDrop: false,
  };

  tableActions: TableAction = {
    title: 'Kullanılabilir Veri Yok',
    subtitle: 'Görüntülenecek herhangi bir kayıt bulunamadı',
    approvePermission: '',
    hasEditOrDeletePermission: false,
    label: 'Düzenle',
    icon: 'edit_note',
    color: 'blue',
    updatePermission: 'PUT.Updating.SiparişÜrünleriGüncelemek',
    deletePermission: 'DELETE.Deleting.SiparişÜrünleriSilme',
    deleteController: '',
    deleteAction: '',
    handler: (element) => {},
  };
  //#endregion

  constructor(
    private dialogService: DialogService,
    spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private OrderItemsService: OrderItemsService,
    private exportOrderItemsService: ExportDataOrderItemsService
  ) {
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
    const responseTotalRows = await this.OrderItemsService.read({
      customerId,
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || 1,
    });

    if (responseTotalRows) {
      this.totalRows = Number(responseTotalRows.result?.totalCount || 0);
    }

    const response = await this.OrderItemsService.read({
      customerId,
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || this.totalRows,
    });

    if (response) {
      const allProduct: OrderItemsResponse = response;
      this.tableData = [...(allProduct.result?.orderItems || [])];
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
  update(element: ResultOrderItems) {
    const updateUserId = sessionStorage.getItem('userId')!;
    const model = new RequestOrderItems();
    model.id = element.id;
    model.authCustomerId = element.authCustomerId;
    model.authUserId = element.authUserId;
    model.userId = updateUserId;
    model.productId = element.productId;
    //yeni alanlar
    model.orderId = element.orderId;
    model.productId = element.productId;
    model.quantity = element.quantity;
    model.price = element.price;
    this.dialogService.openDialog({
      componentType: OrderItemsCreateDialogComponent,
      options: {
        width: '730px',
      },
      disableClose: true,
      data: model,
      afterClosed: () => void this.getList(),
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
      this.exportOrderItemsService.exportOrderItemsRequests(
        formattedData,
        'html'
      );
    } else if (format === 'excel') {
      this.exportOrderItemsService.exportOrderItemsRequests(
        formattedData,
        'excel'
      );
    } else if (format === 'csv') {
      this.exportOrderItemsService.exportOrderItemsRequests(
        formattedData,
        'csv'
      );
    } else if (format === 'json') {
      this.exportOrderItemsService.exportOrderItemsRequests(
        formattedData,
        'json'
      );
    } else if (format === 'txt') {
      this.exportOrderItemsService.exportOrderItemsRequests(
        formattedData,
        'txt'
      );
    }
  }

  private getFormattedData(
    selection: any[],
    dataSource: any[]
  ): ResultOrderItems[] {
    const data = selection.length > 0 ? selection : dataSource;
    return data.map((item) => ({
      id: item.id,
      productId: item.productId,
      authUserId: item.authUserId,
      authCustomerId: item.authCustomerId,
      authUserName: item.authUserName,
      authCustomerName: item.authCustomerName,
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
      orderId: item.orderId,
      quantity: item.quantity || 0,
      price: item.price || 0,
      userId: item.userId,
      rowActiveAndNotDeleted: item.rowActiveAndNotDeleted,
      rowIsNotDeleted: item.rowIsNotDeleted,
      rowIsActive: item.rowIsActive,
      rowIsDeleted: item.rowIsDeleted,
    }));
  }

  exportToExcel = () => this.export('excel');
  exportToCSV = () => this.export('csv');
  exportToJSON = () => this.export('json');
  exportToTXT = () => this.export('txt');
  exportToHTML = () => this.export('html');
  //#endregion
}




