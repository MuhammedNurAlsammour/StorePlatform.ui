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
import { OrdersCreateDialogComponent } from '@features/order-management/dialogs/orders/orders-create-dialog.component';
import { RequestCart } from '@features/shopping-cart/contracts/requests/request-cart';
import {
  CartResponse,
  ResultCart,
} from '@features/shopping-cart/contracts/responses/cart-response';
import { CartCreateDialogComponent } from '@features/shopping-cart/dialogs/cart/cart-create-dialog.component';
import { CartService } from '@features/shopping-cart/services/cart.service';
import { ExportDataCartService } from '@features/shopping-cart/services/export-data-cart.service';
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
  baseTable?: CoderPioneersListComponent<ResultCart>;

  @ViewChild(MatTable) table!: MatTable<ResultCart>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion

  //#region Component Properties - Komponent Özellikleri
  /** Tablo verileri */
  tableData: ResultCart[] = [];
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
  onRowClick(row: ResultCart) {}

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
      label: ' Miktar',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: true,
    },
    {
      name: 'price',
      label: ' Fiyat',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: true,
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
      label: 'Sepet oluşturulma tarihi',
      visible: true,
      sortable: true,
      type: 'dateTime',
      showTooltip: false,
    },
  ];

  sortConfig: TableSortConfig = {
    storagePrefix: 'Cart-type',
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
    labelOne: 'Sipariş Oluştur',
    iconOne: 'edit_note',
    colorOne: 'blue',
    updatePermission: 'PUT.Updating.MüşterialışverişsepetiGüncelemek',
    updateOnePermission: 'POST.Writing.SiparişlerEklemek',
    deletePermission: 'DELETE.Deleting.MüşterialışverişsepetiSilme',
    deleteController: '',
    deleteAction: '',
    handler: (element) => {},
  };
  //#endregion

  constructor(
    private dialogService: DialogService,
    spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private CartService: CartService,
    private exportCartService: ExportDataCartService
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
    const responseTotalRows = await this.CartService.read({
      customerId,
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || 1,
    });

    if (responseTotalRows) {
      this.totalRows = Number(responseTotalRows.result.totalCount);
    }

    const response = await this.CartService.read({
      customerId,
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || this.totalRows,
    });

    if (response) {
      const allProduct: CartResponse = response;
      this.tableData = [...allProduct.result.cart];
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
  update(element: ResultCart) {
    const updateUserId = sessionStorage.getItem('userId')!;
    const model = new RequestCart();
    model.id = element.id;
    model.userId = updateUserId;
    model.updateUserId = updateUserId;
    model.customerId = element.customerId;
    model.productId = element.productId;
    model.quantity = element.quantity;
    model.price = element.price;
    this.dialogService.openDialog({
      componentType: CartCreateDialogComponent,
      options: {
        width: '730px',
      },
      disableClose: true,
      data: model,
      afterClosed: () => void this.getList(),
    });
  }

  createOrder(element: ResultCart) {
    const updateUserId = sessionStorage.getItem('userId')!;
    const model = new RequestCart();
    model.userId = updateUserId;
    model.updateUserId = updateUserId;
    model.customerId = element.customerId;
    model.cartId = element.id;
    model.productId = element.productId;
    model.quantity = element.quantity;
    model.totalAmount = element.price;
    this.dialogService.openDialog({
      componentType: OrdersCreateDialogComponent,
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
      this.exportCartService.exportCartRequests(formattedData, 'html');
    } else if (format === 'excel') {
      this.exportCartService.exportCartRequests(formattedData, 'excel');
    } else if (format === 'csv') {
      this.exportCartService.exportCartRequests(formattedData, 'csv');
    } else if (format === 'json') {
      this.exportCartService.exportCartRequests(formattedData, 'json');
    } else if (format === 'txt') {
      this.exportCartService.exportCartRequests(formattedData, 'txt');
    }
  }

  private getFormattedData(selection: any[], dataSource: any[]): ResultCart[] {
    const data = selection.length > 0 ? selection : dataSource;
    return data.map((item) => ({
      id: item.id,
      customerId: item.customerId,
      customerName: item.customerName,
      institutionId: item.institutionId,
      institutionName: item.institutionName,
      Name: item.Name,
      createdUserId: item.createdBy,
      createdAt: item.createdDate,
      updatedUserId: item.modifiedBy || null,
      updatedAt: item.modifiedDate || null,
      isActive: 1,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      authUserId: item.authUserId,
      authCustomerId: item.authCustomerId,
      rowCreatedDate: item.rowCreatedDate,
      rowUpdatedDate: item.rowUpdatedDate,
      rowIsActive: item.rowIsActive,
      rowIsDeleted: item.rowIsDeleted,
      rowActiveAndNotDeleted: item.rowActiveAndNotDeleted,
      rowIsNotDeleted: item.rowIsNotDeleted,
    }));
  }

  exportToExcel = () => this.export('excel');
  exportToCSV = () => this.export('csv');
  exportToJSON = () => this.export('json');
  exportToTXT = () => this.export('txt');
  exportToHTML = () => this.export('html');
  //#endregion
}






