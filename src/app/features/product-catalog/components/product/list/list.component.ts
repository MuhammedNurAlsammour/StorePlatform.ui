import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTable } from '@angular/material/table';
import {
  BaseComponent,
  DialogService,
  ExportFormat,
} from '@coder-pioneers/shared';
import {
  PaginationState,
  TableAction,
  TableConfig,
  TableFeatures,
  TableSortConfig,
} from '@coder-pioneers/ui-layout-components';
import { RequestProduct } from '@features/product-catalog/contracts/requests/request-product';
import { RequestProductUploadPhoto } from '@features/product-catalog/contracts/requests/request-product-upload-photo';
import {
  ProductResponse,
  ProductResult,
} from '@features/product-catalog/contracts/responses/product-response';
import { ProductUploadPhotoCreateDialogComponent } from '@features/product-catalog/dialogs/product-upload-photo/product-upload-photo-create-dialog.component';
import { ProductCreateDialogComponent } from '@features/product-catalog/dialogs/product/product-create-dialog.component';
import { ExportDataProductService } from '@features/product-catalog/services/export-data-product.service';
import { ProductService } from '@features/product-catalog/services/product.service';
import { RequestCart } from '@features/shopping-cart/contracts/requests/request-cart';
import { CartCreateDialogComponent } from '@features/shopping-cart/dialogs/cart/cart-create-dialog.component';
import {
  coderPioneersListComponent,
  ColumnDefinition,
} from '@shared/components/coder-pioneers/coder-pioneers-list/coder-pioneers-list.component';
import { PipeRegistryService } from '@shared/services/pipe-registry.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductCardGridComponent } from '../card/product-card-grid.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    coderPioneersListComponent,
    ProductCardGridComponent,
    MatSlideToggleModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent extends BaseComponent implements OnInit {
  //#region ViewChild Tanımlamaları
  @ViewChild(coderPioneersListComponent)
  baseTable?: coderPioneersListComponent<ProductResult>;

  @ViewChild(MatTable) table!: MatTable<ProductResult>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion

  //#region Component Properties - Komponent Özellikleri
  /** Tablo verileri */
  tableData: ProductResult[] = [];
  isDataLoading: boolean = false;

  /** Filtre değeri */
  @Input() filterValue?: string = '';

  /** Toplam satır sayısı */
  @Input() totalRows: number = 0;

  /** İlk sayfa indeksi */
  @Input() initialPageIndex: number = 0;

  /** Kart görünümü aktif mi? */
  carding: boolean = false;

  /** Kart görünümü için sayfa boyutu */
  currentPageSize: number = 12;

  /** Kart görünümü için sayfa indeksi */
  currentPageIndex: number = 0;
  //#endregion

  //#region Formatlama
  // Formatlama
  onRowClick(row: ProductResult) {}

  onSortChange(sortEvent: {
    column: string;
    direction: 'asc' | 'desc' | null;
  }) {
    this.getList();
  }

  async onPageChange(event: PaginationState) {
    await this.getList(event);
  }

  /**
   * Kart görünümü toggle fonksiyonu
   * Kart görünümü ile tablo görünümü arasında geçiş yapar
   */
  onCardingToggle(): void {
    this.carding = !this.carding;
    // Kart görünümü değiştiğinde sayfa yeniden yüklenir
    this.cdr.detectChanges();
  }

  /**
   * Kart görünümü için sayfa değişikliği olayı
   * @param event Sayfa olayı
   */
  async onCardPageChange(event: PageEvent): Promise<void> {
    this.currentPageSize = event.pageSize;
    this.currentPageIndex = event.pageIndex;
    await this.getList({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      length: this.totalRows,
    });
  }
  //#endregion

  private setupCustomPipes(): void {
    // fotoğraf pipe
    this.pipeRegistry.registerPipe('image', (value: any) => {
      if (value === null || value === undefined) return '';
      return value;
    });
  }
  //#region Base
  columns: ColumnDefinition[] = [
    {
      name: 'productPhoto',
      label: 'Ürün Fotoğrafı',
      visible: true,
      sortable: false,
      type: 'images',
      showTooltip: false,
    },
    {
      name: 'productName',
      label: 'Ürün Adı',
      visible: true,
      sortable: true,
      type: 'truncateText',
      showTooltip: true,
    },
    {
      name: 'productDescription',
      label: 'Açıklama',
      visible: true,
      sortable: false,
      type: 'truncateText',
      showTooltip: true,
    },
    {
      name: 'productPrice',
      label: 'Fiyat',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: false,
    },
    {
      name: 'productStock',
      label: 'Stok',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: false,
    },
    {
      name: 'productQrCode',
      label: 'QR Kod',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: false,
    },
    {
      name: 'productBarcode',
      label: 'Barkod',
      visible: true,
      sortable: true,
      type: 'number',
      showTooltip: false,
    },

    {
      name: 'categoryName',
      label: 'Kategori Adı',
      visible: true,
      sortable: true,
      type: 'truncateText',
      showTooltip: true,
    },
    {
      name: 'categoryDescription',
      label: 'Kategori Açıklama',
      visible: true,
      sortable: false,
      type: 'truncateText',
      showTooltip: true,
    },
    {
      name: 'productIsActive',
      label: 'Aktif mi?',
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
  ];

  sortConfig: TableSortConfig = {
    storagePrefix: 'products',
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
    labelOne: 'Yeni Sepet Oluştur',
    iconOne: 'add',
    colorOne: 'green',
    labelTwo: 'Fotoğraf Yükle',
    iconTwo: 'image',
    colorTwo: 'blue',
    updatePermission: 'PUT.Writing.ÜrünGüncelleme',
    deletePermission: 'DELETE.Deleting.ÜrünSilme',
    updateOnePermission: 'PUT.Updating.MüşterialışverişsepetiGüncelemek',
    updateTwoPermission: 'POST.Writing.ÜrünFotoğrafıYükleme',
    deleteController: '',
    deleteAction: '',
    handler: (element) => {},
  };
  //#endregion

  constructor(
    private dialogService: DialogService,
    spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private ProductService: ProductService,
    private exportProductService: ExportDataProductService,
    private pipeRegistry: PipeRegistryService
  ) {
    super(spinner);
    this.setupCustomPipes();
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
    const responseTotalRows = await this.ProductService.read({
      filters: {
        authcustomerId: customerId,
      },
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || 1,
    });

    if (responseTotalRows) {
      this.totalRows = Number(responseTotalRows.refId);
    }

    const response = await this.ProductService.read({
      filters: {
        authcustomerId: customerId,
      },
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || this.totalRows,
    });

    if (response) {
      const allProduct: ProductResponse = response;
      this.tableData = [...(allProduct.result?.products || [])];
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
  update(element: ProductResult) {
    const updateUserId = sessionStorage.getItem('userId')!;
    const model = new RequestProduct();

    // Temel bilgiler
    model.id = element.id;
    model.userId = updateUserId;
    model.updateUserId = updateUserId;
    model.customerId = element.customerId || '';
    model.productId = element.id || '';

    // Ürün bilgileri
    model.name = element.productName || '';
    model.description = element.productDescription || '';
    model.price = element.productPrice || 0;
    model.stock = element.productStock || 0;

    // Kategori bilgisi - string olarak gönder (dialog'da object'e çevrilecek)
    model.categoryId = element.categoryId || '';

    console.log('Update için gönderilen model:', {
      id: model.id,
      categoryId: model.categoryId,
      name: model.name,
    });

    this.dialogService.openDialog({
      componentType: ProductCreateDialogComponent,
      options: {
        width: '730px',
      },
      disableClose: true,
      data: model,
      afterClosed: () => void this.getList(),
    });
  }

  createCart(element: ProductResult) {
    const updateUserId = sessionStorage.getItem('userId')!;
    const model = new RequestCart();
    model.userId = updateUserId;
    model.updateUserId = updateUserId;
    model.productId = element.id;
    model.totalAmount = element.productPrice;
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

  uploadPhotoProduct(element: ProductResult) {
    const updateUserId = sessionStorage.getItem('userId')!;
    const model = new RequestProductUploadPhoto();

    // Temel bilgiler
    model.id = element.id;
    model.userId = updateUserId;
    model.updateUserId = updateUserId;
    model.customerId = element.customerId || '';

    // Ürün bilgileri
    model.productId = element.id;
    this.dialogService.openDialog({
      componentType: ProductUploadPhotoCreateDialogComponent,
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
      this.exportProductService.exportProductRequests(formattedData, 'html');
    } else if (format === 'excel') {
      this.exportProductService.exportProductRequests(formattedData, 'excel');
    } else if (format === 'csv') {
      this.exportProductService.exportProductRequests(formattedData, 'csv');
    } else if (format === 'json') {
      this.exportProductService.exportProductRequests(formattedData, 'json');
    } else if (format === 'txt') {
      this.exportProductService.exportProductRequests(formattedData, 'txt');
    }
  }

  private getFormattedData(
    selection: any[],
    dataSource: any[]
  ): ProductResult[] {
    const data = selection.length > 0 ? selection : dataSource;
    return data.map((item) => ({
      productImageUrl: item.productImageUrl,
      productPhoto: item.productPhoto,
      productThumbnail: item.productThumbnail,
      productPhotoContentType: item.productPhotoContentType,
      authUserName: item.authUserName,
      authCustomerName: item.authCustomerName,
      authCustomerId: item.authCustomerId,
      authUserId: item.authUserId,
      rowCreatedDate: item.rowCreatedDate,
      rowUpdatedDate: item.rowUpdatedDate,
      rowIsActive: item.rowIsActive,
      rowIsDeleted: item.rowIsDeleted,
      id: item.id,
      productName: item.productName,
      productDescription: item.productDescription,
      productPrice: item.productPrice,
      productStock: item.productStock,
      productQrCode: item.productQrCode,
      productBarcode: item.productBarcode,
      name: item.name,
      productCreatedDate: item.productCreatedDate,
      productUpdatedDate: item.productUpdatedDate,
      productIsActive: item.productIsActive,
      productIsDeleted: item.productIsDeleted,
      productEmployeeId: item.productEmployeeId,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      categoryDescription: item.categoryDescription,
      customerId: item.customerId,
    }));
  }

  exportToExcel = () => this.export('excel');
  exportToCSV = () => this.export('csv');
  exportToJSON = () => this.export('json');
  exportToTXT = () => this.export('txt');
  exportToHTML = () => this.export('html');
  //#endregion
}
