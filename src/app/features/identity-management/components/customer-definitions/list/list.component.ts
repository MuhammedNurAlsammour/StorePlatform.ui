import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { AlertService, BaseComponent, DeleteDialogsComponent, DialogService, ExportFormat, MaterialListModule, PermissionsService } from '@coder-pioneers/shared';
import { CoderPioneersListComponent, ColumnDefinition,  PaginationState, TableAction, TableConfig, TableFeatures, TableSortConfig } from '@coder-pioneers/ui-layout-components';
import { RequestCustomerDefinitions } from '@features/identity-management/contracts/requests/request-customer-definitions';
import { CustomerDefinitionsResponse, ResultCustomerDefinitions } from '@features/identity-management/contracts/responses/customer-definitions-response';
import { CustomerDefinitionsCreateDialogComponent } from '@features/identity-management/dialogs/customer-definitions/customer-definitions-create-dialog.component';
import { CustomerDefinitionsService } from '@features/identity-management/services/customer-definitions.service';
import { ExportDataCustomerDefinitionsService } from '@features/identity-management/services/export-data-customer-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialListModule,
    CoderPioneersListComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent extends BaseComponent implements OnInit{

//#region ViewChild Tanımlamaları
@ViewChild(CoderPioneersListComponent)
baseTable?: CoderPioneersListComponent<ResultCustomerDefinitions>;
@ViewChild(MatTable) table!: MatTable<ResultCustomerDefinitions>;
@ViewChild(MatPaginator) paginator!: MatPaginator;
//#endregion

//#region Component Properties - Komponent Özellikleri
/** Tablo verileri */
tableData: ResultCustomerDefinitions[] = [];
isDataLoading: boolean = false;
@Input() filterValue?: string = '';
@Input() totalRows: number = 0;
@Input() initialPageIndex: number = 0;
//#endregion


  //#region Formatlama
  // Formatlama
  onRowClick(row: ResultCustomerDefinitions) {
  }

  onSortChange(sortEvent: { column: string; direction: 'asc' | 'desc' | null }) {
    this.getList();
  }

  async onPageChange(event: PaginationState) {
    await this.getList();
  }
  //#endregion

  //#region Base
  columns: ColumnDefinition[] = [
    {
      name: 'name',
      label: 'Müşteri Adı',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: true
    },
    {
      name: 'address',
      label: 'Adres',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: true
    },
    {
      name: 'phoneNumber',
      label: 'Telefon Numarası',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: true
    },
    {
      name: 'email',
      label: 'Email',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: true
    },
    {
      name: 'webSite',
      label: 'Web Sitesi',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: true
    },
    {
      name: 'description',
      label: 'Açıklama',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: true
    }
  ];

  sortConfig: TableSortConfig = {
    storagePrefix: 'customer-definition-list',
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
    columnResize: true,
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
    icon: 'edit',
    color: 'blue',
    updatePermission: 'PUT.Updating.MüşteriGüncelle',
    deleteOnePermission: 'DELETE.Deleting.MüşteriSil',
    deleteController: 'Customer',
    deleteAction: 'DeleteCustomer',
    handler: (element) => this.update(element)
  };
  //#endregion


  constructor(
   private dialogService:DialogService,
   private customerDefinitionsService: CustomerDefinitionsService,
   spinner: NgxSpinnerService,
   private cdr: ChangeDetectorRef,
   private alertService: AlertService,
   public permissionsService:PermissionsService,
   private exportDataCustomerDefinitionsService: ExportDataCustomerDefinitionsService
  )
  {
   super(spinner);
  }

  //#region pageChanged
  // Sayfa değiştiğinde listeyi yenileme işlemi
  async pageChanged() {
    await this.getList();
  }
  //#endregion

  //#region ngOnInit
  // Sayfa yüklendiğinde ilk çalışacak işlemler
  ngOnInit(): void {
    this.getList();
  }
  //#endregion

  //#region Listeleme
  // Verileri listeleyen fonksiyonları
  async getList(paginationState?: PaginationState): Promise<void> {
    if (this.permissionsService.ifPermit('GET.Reading.TümMüşterileriGör')) {
      this.isDataLoading = true;
      try {
        const responseTotalRows = await this.customerDefinitionsService.read(
          {
            page: paginationState?.pageIndex || 0,
            size: paginationState?.pageSize || 1
          }
        );

        if (responseTotalRows) {
          this.totalRows = Number(responseTotalRows.totalCount);
        }

        const response = await this.customerDefinitionsService.read(
          {
            page: paginationState?.pageIndex || 0,
            size: paginationState?.pageSize || this.totalRows
          }
        );

        if (response) {
          const allProduct: CustomerDefinitionsResponse = response;
          this.tableData = [...allProduct.datas];
          this.totalRows = Number(allProduct.totalCount);
          requestAnimationFrame(() => {
            if (this.baseTable) {
              this.baseTable.dataSource._updateChangeSubscription();
              this.cdr.detectChanges();
            }
          });
        }
      } catch (errorResponse: any) {
        if (errorResponse instanceof HttpErrorResponse) {
          const errorMessage: string = errorResponse.error?.mesajIcerik || 'Server ile iletişim sağlanamadı lütfen daha sonra tekrar deneyiniz.';
          this.alertService.error(errorMessage);
        }
      } finally {
        this.isDataLoading = false;
      }
    }
  }
  //#endregion

  //#region dialog
  // Güncelleme/ekleme işlemi için diyalog açma fonksiyonu
  update(element: ResultCustomerDefinitions): void {
    const model = new RequestCustomerDefinitions();
    model.id = element.id;
    model.name = element.name;
    model.address = element.address;
    model.description = element.description;
    model.phoneNumber = element.phoneNumber;
    model.email = element.email;
    model.webSite = element.webSite;
    this.dialogService.openDialog({
      componentType: CustomerDefinitionsCreateDialogComponent,
      options: { width: '730px' },
      disableClose: true,
      data: model,
      afterClosed: () => void this.getList()
    });
  }

  delete(element: ResultCustomerDefinitions) {
    this.dialogService.openDialog({
      componentType: DeleteDialogsComponent,
      afterClosed: () => {
          (this.customerDefinitionsService.delete({id: element.id}))
          .subscribe(result => {
            const errorMessage: string = result?.mesajDetay;
            this.alertService.success(errorMessage);
            this.getList();
          },(errorResponse: HttpErrorResponse) => {
            const errorMessage: string = errorResponse?.error?.mesajDetay;
            this.alertService.error(errorMessage);
          });
      }
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
    this.exportDataCustomerDefinitionsService.exportCustomerDefinitionsRequests(formattedData,'html');
  } else if (format === 'excel') {
    this.exportDataCustomerDefinitionsService.exportCustomerDefinitionsRequests(formattedData,'excel');
  } else if (format === 'csv') {
    this.exportDataCustomerDefinitionsService.exportCustomerDefinitionsRequests(formattedData,'csv');
  } else if (format === 'json') {
    this.exportDataCustomerDefinitionsService.exportCustomerDefinitionsRequests(formattedData,'json');
  } else if (format === 'txt') {
    this.exportDataCustomerDefinitionsService.exportCustomerDefinitionsRequests(formattedData,'txt');
  }
}

private getFormattedData(selection: any[], dataSource: any[]): ResultCustomerDefinitions[] {
  const data = selection.length > 0 ? selection : dataSource;
  return data.map(item => ({
    id: item.id,
    name: item.name,
    logo: item.logo,
    address: item.address,
    phoneNumber: item.phoneNumber,
    email: item.email,
    webSite: item.webSite,
    description: item.description,
    country: item.country,
    city: item.city,
    county: item.county,
    users: item.users,
    rowCreatedDate: item.rowCreatedDate,
    rowUpdatedDate: item.rowUpdatedDate,
    rowIsActive: item.rowIsActive,
    rowIsDeleted: item.rowIsDeleted
  }));
}

exportToExcel = () => this.export('excel');
exportToCSV = () => this.export('csv');
exportToJSON = () => this.export('json');
exportToTXT = () => this.export('txt');
exportToHTML = () => this.export('html');
//#endregion

}




















