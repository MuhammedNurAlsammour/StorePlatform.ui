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
import { RequestCategory } from '@features/categories-management/contracts/requests/request-categories';
import {
  CategoriesResponse,
  ResultCategory,
} from '@features/categories-management/contracts/responses/categories-response';
import { CategoriesCreateDialogComponent } from '@features/categories-management/dialogs/categories/categories-create-dialog.component';
import { CategoriesService } from '@features/categories-management/services/categories.service';
import { ExportDataCategoriesService } from '@features/categories-management/services/export-data-categories.service';
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
  baseTable?: CoderPioneersListComponent<ResultCategory>;

  @ViewChild(MatTable) table!: MatTable<ResultCategory>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion

  //#region Component Properties - Komponent Özellikleri
  /** Tablo verileri */
  tableData: ResultCategory[] = [];
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
  onRowClick(row: ResultCategory) {}

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
      name: 'name',
      label: 'Kategori Adı',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: false,
    },
    {
      name: 'description',
      label: 'Açıklama',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: false,
    },
    {
      name: 'parentName',
      label: 'Üst Kategori',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: false,
    },
    {
      name: 'fullPath',
      label: 'Tam Yol',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: false,
    },
    {
      name: 'sortOrder',
      label: 'Sıralama',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: false,
    },
    {
      name: 'childrenCount',
      label: 'Alt Kategori Sayısı',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: false,
    },
    {
      name: 'authUserName',
      label: 'Oluşturan Kullanıcı',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: false,
    },
    {
      name: 'authCustomerName',
      label: 'Oluşturan Müşteri',
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
    {
      name: 'rowUpdatedDate',
      label: 'Güncellenme Tarihi',
      visible: true,
      sortable: true,
      type: 'dateTime',
      showTooltip: false,
    },
  ];

  sortConfig: TableSortConfig = {
    storagePrefix: 'Categories-type',
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
    updatePermission: 'PUT.Updating.KategorilerGüncelemek',
    deletePermission: 'DELETE.Deleting.KategorilerSilme',
    deleteController: '',
    deleteAction: '',
    handler: (element) => {},
  };
  //#endregion

  constructor(
    private dialogService: DialogService,
    spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private categoriesService: CategoriesService,
    private exportCategoriesService: ExportDataCategoriesService
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
    const responseTotalRows = await this.categoriesService.read({
      customerId,
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || 1,
    });

    if (responseTotalRows) {
      this.totalRows = Number(responseTotalRows.result?.totalCount);
    }

    const response = await this.categoriesService.read({
      customerId,
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || this.totalRows,
    });

    if (response) {
      const allProduct: CategoriesResponse = response;
      this.tableData = [...(allProduct.result?.categories || [])];
      this.totalRows = Number(allProduct.result?.totalCount);
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
  update(element: ResultCategory) {
    const updateUserId = sessionStorage.getItem('userId')!;
    const model = new RequestCategory();
    model.id = element.id;
    model.authCustomerId = element.authCustomerId;
    model.authUserId = element.authUserId;
    model.userId = updateUserId;
    //yeni alanlar
    model.name = element.name;
    model.description = element.description;
    this.dialogService.openDialog({
      componentType: CategoriesCreateDialogComponent,
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
      this.exportCategoriesService.exportCategoriesRequests(
        formattedData,
        'html'
      );
    } else if (format === 'excel') {
      this.exportCategoriesService.exportCategoriesRequests(
        formattedData,
        'excel'
      );
    } else if (format === 'csv') {
      this.exportCategoriesService.exportCategoriesRequests(
        formattedData,
        'csv'
      );
    } else if (format === 'json') {
      this.exportCategoriesService.exportCategoriesRequests(
        formattedData,
        'json'
      );
    } else if (format === 'txt') {
      this.exportCategoriesService.exportCategoriesRequests(
        formattedData,
        'txt'
      );
    }
  }

  private getFormattedData(
    selection: any[],
    dataSource: any[]
  ): ResultCategory[] {
    const data = selection.length > 0 ? selection : dataSource;
    return data.map((item) => ({
      createUserName: item.createUserName,
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
      name: item.name,
      description: item.description,
      parentId: item.parentId,
      parentName: item.parentName,
      icon: item.icon,
      sortOrder: item.sortOrder,
      childrenCount: item.childrenCount,
      fullPath: item.fullPath,
      children: item.children,
      createUserId: item.createUserId,
      updateUserId: item.updateUserId,
      updateUserName: item.updateUserName,
    }));
  }

  exportToExcel = () => this.export('excel');
  exportToCSV = () => this.export('csv');
  exportToJSON = () => this.export('json');
  exportToTXT = () => this.export('txt');
  exportToHTML = () => this.export('html');
  //#endregion
}

