import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { ExportFormat } from '@coder-pioneers/shared';
import { DialogService } from '@coder-pioneers/shared';
import { RequestDocumentTypeDefinition } from '@features/definitions/contracts/requests/request-document-type-definition';
import { DocumentTypeDefinitionResponse, ResultDocumentTypeDefinition } from '@features/definitions/contracts/responses/document-type-definition-response';
import { DocumentTypeDefinitionCreateDialogComponent } from '@features/definitions/dialogs/document-type-definition/document-type-definition-create-dialog.component';
import { DocumentTypeDefinitionService } from '@features/definitions/services/document-type-definition.service';
import { ExportDataDocumentTypeService } from '@features/definitions/services/export-data-document-type.service';
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
export class ListComponent extends BaseComponent implements OnInit, AfterViewInit {

//#region ViewChild Tanımlamaları
@ViewChild(CoderPioneersListComponent) 
baseTable?: CoderPioneersListComponent<ResultDocumentTypeDefinition>;
@ViewChild(MatTable) table!: MatTable<ResultDocumentTypeDefinition>;
@ViewChild(MatPaginator) paginator!: MatPaginator;
//#endregion

//#region Component Properties - Komponent Özellikleri
/** Tablo verileri */
tableData: ResultDocumentTypeDefinition[] = [];
isDataLoading: boolean = false;
@Input() filterValue?: string = '';
@Input() totalRows: number = 0;
@Input() initialPageIndex: number = 0;
//#endregion


  //#region Formatlama
  // Formatlama
  onRowClick(row: ResultDocumentTypeDefinition) {
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
      name: 'name',
      label: 'Doküm Adı',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: true
    }
  ];

  sortConfig: TableSortConfig = {
    storagePrefix: 'document-type-devs',
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
    columnResize: true,
    contextMenu: true,
    rowSelection: true,
    export: true,
    search: true
  };

  tableActions: TableAction = {
    label: 'Düzenle',
    icon: 'edit_note',
    color: 'blue',
    updatePermission: 'PUT.Updating.DokumanTipiGüncelle',
    deletePermission: 'DELETE.Deleting.DokumanTipiSil',
    deleteController: 'DocumentType',
    deleteAction: 'DeleteDocumentType',
    handler: (element) => {
    }
  };
  //#endregion

  constructor(
    private dialogService:DialogService,
    private documentTypeDefinitionService: DocumentTypeDefinitionService,
    private exportDataDocumentTypeService:ExportDataDocumentTypeService,
    spinner: NgxSpinnerService,
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

  //#region ngAfterViewInit
  // Görünüm yüklendikten sonra çalışacak kısım
  ngAfterViewInit() {
  }
  //#endregion

  //#region Listeleme
  // Verileri listeleyen fonksiyonları
  async getList(paginationState?: PaginationState) {
    this.isDataLoading = true;
    const customerId = sessionStorage.getItem('customerId') || null;
    const institutionId = sessionStorage.getItem('institutionId') || null;

    const response = await this.documentTypeDefinitionService.read(
      {
        customerId,
        institutionId,
        page: paginationState?.pageIndex || 0,
        size: paginationState?.pageSize || this.tableConfig.defaultPageSize
      }
    );

    if (response) {
      const allProduct: DocumentTypeDefinitionResponse = response;
      this.tableData = [...allProduct.result];
      this.totalRows = Number(allProduct.refId);
      this.isDataLoading = false;
    } else {
      this.isDataLoading = false;
    }
  }
  //#endregion

  //#region dialog
  // Güncelleme/ekleme işlemi için diyalog açma fonksiyonu
  update(element: ResultDocumentTypeDefinition) {
   const updateUserId = sessionStorage.getItem('userId')!;
    const model = new RequestDocumentTypeDefinition();
    model.id = element.id;
    model.userId = updateUserId;
    model.updateUserId = updateUserId;
    model.customerId = element.customerId;
    model.institutionId = element.institutionId;
    model.name = element.name;
    model.createdAt = element.createdAt;
    model.isActive = element.isActive;
    this.dialogService.openDialog({
     componentType: DocumentTypeDefinitionCreateDialogComponent,
     options: {
       width: '430px'
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
      this.exportDataDocumentTypeService.exportDocumentTypeRequests(formattedData,'html');
    } else if (format === 'excel') {
      this.exportDataDocumentTypeService.exportDocumentTypeRequests(formattedData,'excel');
    } else if (format === 'csv') {
      this.exportDataDocumentTypeService.exportDocumentTypeRequests(formattedData,'csv');
    } else if (format === 'json') {
      this.exportDataDocumentTypeService.exportDocumentTypeRequests(formattedData,'json');
    } else if (format === 'txt') {
      this.exportDataDocumentTypeService.exportDocumentTypeRequests(formattedData,'txt');
    }
  }

  private getFormattedData(selection: any[], dataSource: any[]): ResultDocumentTypeDefinition[] {
    const data = selection.length > 0 ? selection : dataSource;
    return data.map(item => ({
      id: item.id,
      customerId: item.customerId,
      customerName: item.customerName,
      institutionId: item.institutionId,
      institutionName: item.institutionName,
      name: item.name,
      createdUserId: item.createdBy,
      createdAt: item.createdDate,
      updatedUserId: item.modifiedBy || null,
      updatedAt: item.modifiedDate || null,
      isActive: 1
    }));
  }

  exportToExcel = () => this.export('excel');
  exportToCSV = () => this.export('csv');
  exportToJSON = () => this.export('json');
  exportToTXT = () => this.export('txt');
  exportToHTML = () => this.export('html');
  //#endregion
}




















