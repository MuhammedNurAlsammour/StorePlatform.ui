import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
import {
  InventorySnapshotResponse,
  ResultInventorySnapshot,
} from '@features/inventory-management/contracts/responses/inventory-snapshot-response';
import { ExportDataInventorySnapshotService } from '@features/inventory-management/services/export-data-inventory-snapshot.service';
import { InventorySnapshotService } from '@features/inventory-management/services/inventory-snapshot.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatChipsModule,
    CoderPioneersListComponent,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent extends BaseComponent implements OnInit {
  //#region ViewChild Tanımlamaları
  @ViewChild(CoderPioneersListComponent)
  baseTable?: CoderPioneersListComponent<ResultInventorySnapshot>;

  @ViewChild(MatTable) table!: MatTable<ResultInventorySnapshot>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion

  //#region Component Properties - Komponent Özellikleri
  /** Tablo verileri */
  tableData: ResultInventorySnapshot[] = [];
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
  onRowClick(row: ResultInventorySnapshot) {}

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
      name: 'quantityAvailable',
      label: 'Mevcut Miktar',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: false,
    },
    {
      name: 'quantityReserved',
      label: 'Rezerve Miktar',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: false,
    },
    {
      name: 'quantitySold',
      label: 'Satılan Miktar',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: false,
    },
    {
      name: 'totalQuantity',
      label: 'Toplam Miktar',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: false,
    },
    {
      name: 'inventoryType',
      label: 'Envanter Türü',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: false,
    },
    {
      name: 'snapshotDate',
      label: 'Anlık Görüntü Tarihi',
      visible: true,
      sortable: true,
      type: 'dateTime',
      showTooltip: false,
    },
    {
      name: 'unitCost',
      label: 'Birim Maliyeti',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: false,
    },
    {
      name: 'totalValue',
      label: 'Toplam Değer',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: false,
    },
    {
      name: 'location',
      label: 'Konum',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: false,
    },
    {
      name: 'notes',
      label: 'Notlar',
      visible: true,
      sortable: true,
      type: 'string',
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
      label: 'Oluşturulma Tarihi',
      visible: true,
      sortable: true,
      type: 'dateTime',
      showTooltip: false,
    },
  ];

  sortConfig: TableSortConfig = {
    storagePrefix: 'InventorySnapshot-type-dev',
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
    updatePermission: 'PUT.Updating.ÜrünstokanlıkgörüntüleritablosuGüncelemek',
    deletePermission: 'DELETE.Deleting.ÜrünstokanlıkgörüntüleritablosuSilme',
    deleteController: '',
    deleteAction: '',
    handler: (element) => {},
  };
  //#endregion

  constructor(
    private dialogService: DialogService,
    spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private InventorySnapshotService: InventorySnapshotService,
    private exportInventorySnapshotService: ExportDataInventorySnapshotService
  ) {
    super(spinner);
  }

  //#region ngOnInit
  // Sayfa yüklendiğinde ilk çalışacak işlemler
  ngOnInit(): void {
    this.getList();
  }
  //#endregion

  //#region Gruplama Özellikleri
  groupByProduct: boolean = false;
  getLatestOnly: boolean = false;

  /**
   * Ürünlere göre gruplama toggle
   */
  onGroupingToggle() {
    if (this.groupByProduct) {
      this.getLatestOnly = false; // Gruplama aktifken latest only'yi devre dışı bırak
    }
    this.getList();
  }

  /**
   * Sadece son durumu göster toggle
   */
  onLatestOnlyToggle() {
    this.getList();
  }
  //#endregion

  //#region Listeleme
  // Verileri listeleyen fonksiyonları
  async getList(paginationState?: PaginationState) {
    this.isDataLoading = true;
    const customerId = sessionStorage.getItem('customerId') || null;
    const institutionId = sessionStorage.getItem('institutionId') || null;

    const requestParams = {
      customerId,
      institutionId,
      page: paginationState?.pageIndex || 0,
      groupByProduct: this.groupByProduct,
      getLatestOnly: this.getLatestOnly && !this.groupByProduct,
    };

    const responseTotalRows = await this.InventorySnapshotService.read({
      ...requestParams,
      size: 1, // Sadece total count için
    });

    if (responseTotalRows) {
      this.totalRows = Number(responseTotalRows.result?.totalCount || 0);
    }

    const response = await this.InventorySnapshotService.read({
      filters: {
        ...requestParams,
      },
      size: paginationState?.pageSize || this.totalRows,
    });

    if (response) {
      const allProduct: InventorySnapshotResponse = response;
      this.tableData = [...(allProduct.result?.inventorySnapshot || [])];
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
  // update(element: ResultInventorySnapshot) {
  //  const updateUserId = sessionStorage.getItem('userId')!;
  //   const model = new RequestInventorySnapshot();
  //   model.id = element.id;
  //   model.institutionId = element.institutionId;
  //   model.customerId = element.customerId;
  //   model.authCustomerId = element.authCustomerId;
  //   model.authUserId = element.authUserId;
  //   model.userId = updateUserId;
  //   model.productId = element.productId;
  //   //yeni alanlar
  //   model.Name = element.Name;
  //   this.dialogService.openDialog({
  //    componentType: InventorySnapshotCreateDialogComponent,
  //    options: {
  //      width: '730px'
  //    },
  //    disableClose: true,
  //    data: model,
  //    afterClosed: () =>  void this.getList()
  //  });
  // }
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
      this.exportInventorySnapshotService.exportInventorySnapshotRequests(
        formattedData,
        'html'
      );
    } else if (format === 'excel') {
      this.exportInventorySnapshotService.exportInventorySnapshotRequests(
        formattedData,
        'excel'
      );
    } else if (format === 'csv') {
      this.exportInventorySnapshotService.exportInventorySnapshotRequests(
        formattedData,
        'csv'
      );
    } else if (format === 'json') {
      this.exportInventorySnapshotService.exportInventorySnapshotRequests(
        formattedData,
        'json'
      );
    } else if (format === 'txt') {
      this.exportInventorySnapshotService.exportInventorySnapshotRequests(
        formattedData,
        'txt'
      );
    }
  }

  private getFormattedData(
    selection: any[],
    dataSource: any[]
  ): ResultInventorySnapshot[] {
    const data = selection.length > 0 ? selection : dataSource;
    return data.map((item) => ({
      id: item.id,
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
      userId: item.userId,
      rowActiveAndNotDeleted: item.rowActiveAndNotDeleted,
      rowIsNotDeleted: item.rowIsNotDeleted,
      rowIsActive: item.rowIsActive,
      rowIsDeleted: item.rowIsDeleted,
      Name: item.Name,
      productId: item.productId,
      quantityAvailable: item.quantityAvailable,
      quantityReserved: item.quantityReserved,
      quantitySold: item.quantitySold,
      totalQuantity: item.totalQuantity,
      inventoryType: item.inventoryType,
      orderId: item.orderId,
      snapshotDate: item.snapshotDate,
      unitCost: item.unitCost,
      totalValue: item.totalValue,
      location: item.location,
      notes: item.notes,
    }));
  }

  exportToExcel = () => this.export('excel');
  exportToCSV = () => this.export('csv');
  exportToJSON = () => this.export('json');
  exportToTXT = () => this.export('txt');
  exportToHTML = () => this.export('html');
  //#endregion
}
