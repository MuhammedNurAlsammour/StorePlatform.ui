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
import { RequestBusinesses } from '@features/Businesses-management/contracts/requests/request-Businesses';
import {
  BusinesseResponse,
  ResultBusinesse,
} from '@features/Businesses-management/contracts/responses/Businesses-response';
import { BusinessesCreateDialogComponent } from '@features/Businesses-management/dialogs/Businesses/Businesses-create-dialog.component';
import { BusinessesService } from '@features/Businesses-management/services/Businesses.service';
import { ExportDataBusinessesService } from '@features/Businesses-management/services/export-data-Businesses.service';
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
  baseTable?: CoderPioneersListComponent<ResultBusinesse>;

  @ViewChild(MatTable) table!: MatTable<ResultBusinesse>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion

  //#region Component Properties - Komponent Özellikleri
  /** Tablo verileri */
  tableData: ResultBusinesse[] = [];
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
  onRowClick(row: ResultBusinesse) {}

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
      label: 'İşletme Adı',
      visible: true,
      sortable: true,
      type: 'truncateText',
      showTooltip: false,
    },
    {
      name: 'description',
      label: 'Açıklama',
      visible: true,
      sortable: true,
      type: 'truncateText',
      showTooltip: true,
    },
    {
      name: 'phone',
      label: 'Telefon',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: false,
    },
    {
      name: 'email',
      label: 'E-posta',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: false,
    },
    {
      name: 'address',
      label: 'Adres',
      visible: true,
      sortable: true,
      type: 'truncateText',
      showTooltip: true,
    },
    {
      name: 'isVerified',
      label: 'Doğrulanmış',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: false,
    },
    {
      name: 'isFeatured',
      label: 'Öne Çıkan',
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
      name: 'rowCreatedDate',
      label: 'Oluşturulma Tarihi',
      visible: true,
      sortable: true,
      type: 'dateTime',
      showTooltip: false,
    },
  ];

  sortConfig: TableSortConfig = {
    storagePrefix: 'Businesses-type-dev',
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
    updatePermission:
      'PUT.Updating.BusinessesİşletmelerveOrganizasyonlarGüncelemek',
    deletePermission:
      'DELETE.Deleting.BusinessesİşletmelerveOrganizasyonlarSilme',
    deleteController: '',
    deleteAction: '',
    handler: (element) => {},
  };
  //#endregion

  constructor(
    private dialogService: DialogService,
    spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private businessesService: BusinessesService,
    private exportBusinessesService: ExportDataBusinessesService
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
    const responseTotalRows = await this.businessesService.read({
      customerId,
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || 1,
    });

    if (responseTotalRows) {
      this.totalRows = Number(responseTotalRows.result?.totalCount);
    }

    const response = await this.businessesService.read({
      customerId,
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || this.totalRows,
    });

    if (response) {
      const allProduct: BusinesseResponse = response;
      this.tableData = [...(allProduct.result?.businesses || [])];
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
  update(element: ResultBusinesse) {
    const updateUserId = sessionStorage.getItem('userId')!;
    const model = new RequestBusinesses();
    model.id = element.id;
    model.institutionId = element.institutionId;
    model.customerId = element.customerId;
    model.authCustomerId = element.authCustomerId;
    model.authUserId = element.authUserId;
    model.userId = updateUserId;
    // Businesses alanları
    model.name = element.name;
    model.description = element.description;
    model.subDescription = element.subDescription;
    model.categoryId = element.categoryId;
    model.subCategoryId = element.subCategoryId;
    model.provinceId = element.provinceId;
    model.countriesId = element.countriesId;
    model.districtId = element.districtId;
    model.address = element.address;
    model.latitude = element.latitude;
    model.longitude = element.longitude;
    model.phone = element.phone;
    model.mobile = element.mobile;
    model.email = element.email;
    model.website = element.website;
    model.facebookUrl = element.facebookUrl;
    model.instagramUrl = element.instagramUrl;
    model.whatsApp = element.whatsApp;
    model.telegram = element.telegram;
    model.primaryContactType1 = element.primaryContactType1;
    model.primaryContactValue1 = element.primaryContactValue1;
    model.primaryContactType2 = element.primaryContactType2;
    model.primaryContactValue2 = element.primaryContactValue2;
    model.subscriptionType = element.subscriptionType;
    model.isVerified = element.isVerified;
    model.isFeatured = element.isFeatured;
    model.workingHours = element.workingHours;
    model.icon = element.icon;
    model.ownerId = element.ownerId;
    model.createUserId = element.createUserId;

    this.dialogService.openDialog({
      componentType: BusinessesCreateDialogComponent,
      options: {
        width: '900px',
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
      this.exportBusinessesService.exportBusinessesRequests(
        formattedData,
        'html'
      );
    } else if (format === 'excel') {
      this.exportBusinessesService.exportBusinessesRequests(
        formattedData,
        'excel'
      );
    } else if (format === 'csv') {
      this.exportBusinessesService.exportBusinessesRequests(
        formattedData,
        'csv'
      );
    } else if (format === 'json') {
      this.exportBusinessesService.exportBusinessesRequests(
        formattedData,
        'json'
      );
    } else if (format === 'txt') {
      this.exportBusinessesService.exportBusinessesRequests(
        formattedData,
        'txt'
      );
    }
  }

  private getFormattedData(
    selection: any[],
    dataSource: any[]
  ): ResultBusinesse[] {
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
      name: item.name,
      description: item.description,
      subDescription: item.subDescription,
      categoryId: item.categoryId,
      subCategoryId: item.subCategoryId,
      provinceId: item.provinceId,
      countriesId: item.countriesId,
      districtId: item.districtId,
      address: item.address,
      latitude: item.latitude,
      longitude: item.longitude,
      phone: item.phone,
      mobile: item.mobile,
      email: item.email,
      website: item.website,
      facebookUrl: item.facebookUrl,
      instagramUrl: item.instagramUrl,
      whatsApp: item.whatsApp,
      telegram: item.telegram,
      primaryContactType1: item.primaryContactType1,
      primaryContactValue1: item.primaryContactValue1,
      primaryContactType2: item.primaryContactType2,
      primaryContactValue2: item.primaryContactValue2,
      rating: item.rating,
      totalReviews: item.totalReviews,
      viewCount: item.viewCount,
      subscriptionType: item.subscriptionType,
      isVerified: item.isVerified,
      isFeatured: item.isFeatured,
      workingHours: item.workingHours,
      icon: item.icon,
      ownerId: item.ownerId,
      mainPhoto: item.mainPhoto,
      bannerPhotos: item.bannerPhotos,
      createUserId: item.createUserId,
      createUserName: item.createUserName,
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
