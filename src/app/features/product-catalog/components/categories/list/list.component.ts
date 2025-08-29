import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { BaseComponent, DialogService, ExportFormat } from '@coder-pioneers/shared';
import { PaginationState, TableAction, TableConfig, TableFeatures, TableSortConfig } from '@coder-pioneers/ui-layout-components';
import { RequestCategories } from '@features/product-catalog/contracts/requests/request-categories';
import { RequestProduct } from '@features/product-catalog/contracts/requests/request-product';
import { CategoriesResponse, CategoryResult } from '@features/product-catalog/contracts/responses/categories-response';
import { CategoriesCreateDialogComponent } from '@features/product-catalog/dialogs/categories/categories-create-dialog.component';
import { ProductCreateDialogComponent } from '@features/product-catalog/dialogs/product/product-create-dialog.component';
import { CategoriesService } from '@features/product-catalog/services/categories.service';
import { ExportDataCategoriesService } from '@features/product-catalog/services/export-data-categories.service';
import { coderPioneersListComponent, ColumnDefinition } from '@shared/components/coder-pioneers/coder-pioneers-list/coder-pioneers-list.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    coderPioneersListComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent extends BaseComponent implements OnInit {

//#region ViewChild Tanımlamaları
@ViewChild(coderPioneersListComponent) baseTable?: coderPioneersListComponent<CategoryResult>;

@ViewChild(MatTable) table!: MatTable<CategoryResult>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
//#endregion

//#region Component Properties - Komponent Özellikleri
/** Tablo verileri */
tableData: CategoryResult[] = [];
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
onRowClick(row: CategoryResult) {
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
    name: 'photo',
    label: 'Kategori Fotoğrafı',
    visible: true,
    sortable: false,
    type: 'images',
    showTooltip: false
  },
  {
    name: 'name',
    label: 'Kategori Adı',
    visible: true,
    sortable: false,
    type: 'string',
    showTooltip: true
  },
  {
    name: 'description',
    label: 'Kategori Açıklaması',
    visible: true,
    sortable: false,
    type: 'truncateText',
    showTooltip: true
  },
  {
    name: 'authUserName',
    label: 'Kullanıcı Adı',
    visible: true,
    sortable: true,
    type: 'string',
    showTooltip: false
  },
  {
    name: 'authCustomerName',
    label: 'Müşteri Adı',
    visible: true,
    sortable: true,
    type: 'string',
    showTooltip: false
  }
];

sortConfig: TableSortConfig = {
  storagePrefix: 'Categories-types',
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
  labelOne: 'Yeni Ürün Oluştur',
  iconOne: 'add',
  colorOne: 'green',
  updatePermission: 'PUT.Updating.KategoriGüncellemek',
  deletePermission: 'DELETE.Deleting.KategoriSilme',
  updateOnePermission: 'POST.Writing.YeniÜrünOluşturma',
  deleteController: '',
  deleteAction: '',
  handler: (element) => {}
};
//#endregion

constructor(
  private dialogService:DialogService,
  spinner: NgxSpinnerService,
  private cdr: ChangeDetectorRef,
  private CategoriesService: CategoriesService,
  private exportCategoriesService:ExportDataCategoriesService,
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
  const responseTotalRows = await this.CategoriesService.read({
    customerId,
    institutionId,
    page: paginationState?.pageIndex || 0,
    size: paginationState?.pageSize || 1
  });

  if (responseTotalRows) {
    this.totalRows = Number(responseTotalRows.result?.totalCount || 0);
  }

  const response = await this.CategoriesService.read(
    {
      customerId,
      institutionId,
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || this.totalRows
    }
  );

  if (response) {
    const allProduct: CategoriesResponse = response;
    this.tableData = [...allProduct.result?.categories || []];
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
update(element: CategoryResult) {
 const updateUserId = sessionStorage.getItem('userId')!;
  const model = new RequestCategories();
  model.id = element.id;
  model.userId = updateUserId;
  model.updateUserId = updateUserId;
  model.name = element.name;
  model.description = element.description;
  this.dialogService.openDialog({
   componentType: CategoriesCreateDialogComponent,
   options: {
     width: '730px'
   },
   disableClose: true,
   data: model,
   afterClosed: () =>  void this.getList()
 });
}

createProduct(element: CategoryResult) {
   const model = new RequestProduct();
   model.categoryId = element.id;
   this.dialogService.openDialog({
    componentType: ProductCreateDialogComponent,
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
    this.exportCategoriesService.exportCategoriesRequests(formattedData,'html');
  } else if (format === 'excel') {
    this.exportCategoriesService.exportCategoriesRequests(formattedData,'excel');
  } else if (format === 'csv') {
    this.exportCategoriesService.exportCategoriesRequests(formattedData,'csv');
  } else if (format === 'json') {
    this.exportCategoriesService.exportCategoriesRequests(formattedData,'json');
  } else if (format === 'txt') {
    this.exportCategoriesService.exportCategoriesRequests(formattedData,'txt');
  }
}

private getFormattedData(selection: any[], dataSource: any[]): CategoryResult[] {
  const data = selection.length > 0 ? selection : dataSource;
  return data.map(item => ({
    createdDate: item.createdDate || null,
    updatedDate: item.updatedDate || null,
    name: item.name,
    description: item.description,
    productCategories: item.productCategories,
    id: item.id,
    authUserId: item.authUserId,
    customerId: item.customerId,
    authCustomerId: item.authCustomerId,
    authUserName: item.authUserName,
    authCustomerName: item.authCustomerName,
    rowCreatedDate: item.rowCreatedDate,
    rowUpdatedDate: item.rowUpdatedDate,
    rowIsActive: item.rowIsActive,
    rowIsDeleted: item.rowIsDeleted,
    rowActiveAndNotDeleted: item.rowActiveAndNotDeleted,
    rowIsNotDeleted: item.rowIsNotDeleted,
    categoryId:item.categoryId
  }));
}


exportToExcel = () => this.export('excel');
exportToCSV = () => this.export('csv');
exportToJSON = () => this.export('json');
exportToTXT = () => this.export('txt');
exportToHTML = () => this.export('html');
//#endregion

}














