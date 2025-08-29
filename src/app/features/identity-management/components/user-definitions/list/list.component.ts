import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { AlertService, BaseComponent, DialogService, ExportFormat, PermissionsService, TableSortConfig } from '@coder-pioneers/shared';
import { CoderPioneersListComponent, ColumnDefinition, PaginationState, TableAction, TableConfig, TableFeatures } from '@coder-pioneers/ui-layout-components';
import { FilterBottomSheetService } from '@features/identity-management/bottom-sheet/filter-bottom-sheet.service';
import { ChangePassword } from '@features/identity-management/contracts/requests/change-password';
import { RequestRolAddUser } from '@features/identity-management/contracts/requests/request-rol-add-user';
import { RequestUserAddEmployee } from '@features/identity-management/contracts/requests/request-user-add-employee';
import { ResultUser } from '@features/identity-management/contracts/responses/list-user-definitions-respon';
import { ChangePasswordDialogComponent } from '@features/identity-management/dialogs/change-password-dialog/change-password-dialog.component';
import { UserAddEmployeeCreateDialogComponent } from '@features/identity-management/dialogs/user-add-employee-update-dialog/user-add-employee-create-dialog.component';
import { UserAddRolComponent } from '@features/identity-management/dialogs/user-add-rol/user-add-rol.component';
import { ExportDataUserDefinitionsService } from '@features/identity-management/services/export-data-user-definitions.service';
import { UserDefinitionsAuthService } from '@features/identity-management/services/user-definitions-auth.service';
import { UserDefinitionsService } from '@features/identity-management/services/user-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
 selector: 'app-list',
 standalone: true,
 imports: [
  CoderPioneersListComponent,
 ],
 templateUrl: './list.component.html',
 styleUrls: ['./list.component.scss'],

})
export class ListComponent extends BaseComponent implements OnInit , AfterViewInit, OnChanges {
  @Input() initialPageIndex: number = 0;

  @ViewChild(CoderPioneersListComponent) baseTable?:
  CoderPioneersListComponent<ResultUser>;
  // ======= View Children (Görünüm Bileşenleri) =======
  @ViewChild(MatTable) table!: MatTable<ResultUser>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  tableData: ResultUser[] = [];
  isDataLoading: boolean = false;

  // ======= Girişler (Inputs) =======
  /** Arama değeri */
  @Input() filterValue?: string = '';
  @Input() totalRows: number = 0;
  // ======= Seçim Durumu =======
  /** Seçili satır indeksi */
  selectedRowIndex: string = '';

  /** Seçili öğe */
  selectedElement: ResultUser | null = null;

  /** Aktif sütun */
  activeColumn: string | null = null;

  /** Geçici sütun değişkeni */
  col: any;

  Passive!:boolean;

  @Input() durumu!: boolean;

  //#region Filters
  filterMenuOpen = false;
  selectedRoles: string[] = [];
  availableRoles: string[] = [];
  filteredData: ResultUser[] = [];
  private originalData: ResultUser[] = [];

  private readonly LOCALSTORAGE_KEYS_SELECTED_ROLES = {
    SELECTED_ROLES: 'selectedRoles'
  };
  roleSearchQuery: string = '';
  filteredRoles: string[] = [];
  totalUserCount!: number;

  //#region selecte
  selection = new SelectionModel<ResultUser>(true, []);
  counts!: number;
  allData: ResultUser[] = [];

  //#region Formatlama
  // Formatlama
  onRowClick(row: ResultUser) {
  }

  async onSortChange(sortEvent: { column: string; direction: 'asc' | 'desc' | null }) {
    await this.getList();
  }

  async onPageChange(event: PaginationState) {
    await this.getList(event);
  }

  //#endregion

  //#region Base
  columns: ColumnDefinition[] = [
    {
      name: 'nameSurname',
      label: 'Personel Adı',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: true
    },
    {
      name: 'userName',
      label: 'Kullanıcı Adı',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: true
    },
    {
      name: 'roleName',
      label: 'Rol Adı',
      visible: true,
      sortable: false,
      type: 'string',
      showTooltip: true,
      filterMenu: true
    },
    {
      name: 'customerName',
      label: 'Müşteri Adı',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: true
    }
  ];

  sortConfig: TableSortConfig = {
    storagePrefix: 'user-definitio',
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
    dragDrop:false
  };

  tableActions: TableAction = {
    title: 'Kullanılabilir Veri Yok',
    subtitle: 'Görüntülenecek herhangi bir kayıt bulunamadı',
    approvePermission: '',
    hasEditOrDeletePermission: true,
    label: 'Rol Ekle',
    icon: 'contact_emergency',
    color: 'green',
    updatePermission: 'POST.Reading.AssignRoleToUser',
    labelOne: 'Şifre değiştir',
    iconOne: 'key',
    colorOne: 'rgb(240, 23, 59)',
    updateOnePermission: 'GET.Reading.EnvanterdekiTümEşyalarıGör',
    labelTwo: 'Personel değiştir',
    iconTwo: 'reply_all',
    colorTwo: 'rgb(30, 240, 23)',
    updateTwoPermission: 'PUT.Updating.PersonelinKullanıcıIDsiniGüncelle',
    deleteController: 'Users',
    deleteAction: 'DeleteUser',
  };

  onActiveConfirmed() {
    this.getList();
  }


  onPassiveConfirmed() {
    this.getList();
  }

 constructor(
   private dialogService:DialogService,
   private alertService: AlertService,
   public permissionsService:PermissionsService,
   private filterBottomSheetService: FilterBottomSheetService,
   private userdefinitionsservice: UserDefinitionsService,
   private userDefinitionsAuthService: UserDefinitionsAuthService,
   private exportDataUserDefinitionsService: ExportDataUserDefinitionsService,
   private cdr: ChangeDetectorRef,
   spinner: NgxSpinnerService,
  )
  {
   super(spinner);
   this.loadSavedFilters();
  }


  //#region pageChanged
  // Sayfa değiştiğinde listeyi yenileme işlemi
  //#endregion
  async pageChanged() {
    await this.getList();
    this.initializeFilters();

  }

  //#region ngOnInit
  // Sayfa yüklendiğinde ilk çalışacak işlemler
  ngOnInit(): void {
    this.getList();
  }
  //#endregion


  //#region ngOnChanges
  // Değişiklikler takip edildiğinde filtreleme işlemi
  ngOnChanges(changes: SimpleChanges) {
  if (changes['durumu']) {
    if (
      !changes['durumu'].firstChange ||
      changes['durumu'].currentValue !==
      changes['durumu'].previousValue
     )
     {
       this.getList();
     }
    }
  }
  //#endregion


  //#region ngAfterViewInit
  // Görünüm yüklendikten sonra çalışacak kısım
  ngAfterViewInit() {
  }
  //#endregion


  //#region listelemeler
  // listelemeler
  async getList(paginationState?: PaginationState) {
    this.isDataLoading= true;
    const customerId = sessionStorage.getItem('customerId') || null;
    const institutionId = sessionStorage.getItem('institutionId') || null;
    const userId = sessionStorage.getItem('userId') || null;

    const responseTotalRows = await this.userdefinitionsservice.read({
      page: paginationState?.pageIndex || 0,
      size: paginationState?.pageSize || 1,
      passive: this.durumu,
      customerId,
      institutionId,
      userId
    });

    if (responseTotalRows) {
      this.totalRows = Number(responseTotalRows.refId);
    }

    const response = await this.userdefinitionsservice.read(
      {
        page: paginationState?.pageIndex || 0,
        size: paginationState?.pageSize || this.totalRows,
        passive: this.durumu ,
        customerId,
        institutionId,
        userId
      }
    );

    if (response) {
      this.tableData = [...response.result];
      this.totalRows = Number(response.refId);
      requestAnimationFrame(() => {
        if (this.baseTable) {
          this.baseTable.dataSource._updateChangeSubscription();
          this.cdr.detectChanges();
        }
      });
      this.initializeFilters();
      this.isDataLoading = false;
    } else {
      this.isDataLoading = false;
    }
   }
  //#endregion


  //#region dialog
  // Güncelleme/ekleme/rol işlemi için diyalog açma fonksiyonu
  addRol(element:ResultUser) {
    if (this.permissionsService.ifPermit('POST.Reading.AssignRoleToUser')) {
      const user = new RequestRolAddUser();
      user.userId = element.id;
      this.dialogService.openDialog({
        componentType: UserAddRolComponent,
        options: {
          width: '730px'
        },
        data: user,
        disableClose:true,
        afterClosed: () => void this.getList()
      });
    }
  }

  updateChangePassword(element: ResultUser){
    if (this.permissionsService.ifPermit('GET.Reading.EnvanterdekiTümEşyalarıGör')) {
      const model = new  ChangePassword();
      model.userId = element.id;
      this.dialogService.openDialog({
        componentType: ChangePasswordDialogComponent,
        options: {
          width: '730px'
        },
        disableClose: true,
        data: model,
        afterClosed: () => void this.getList()
      });
    }
  }

  updateUserEmployee( element: ResultUser ){
    if (this.permissionsService.ifPermit('PUT.Updating.PersonelinKullanıcıIDsiniGüncelle')) {
      const model = new  RequestUserAddEmployee();
      model.userId = element.id;
      this.dialogService.openDialog({
        componentType: UserAddEmployeeCreateDialogComponent,
        options: {
          width: '730px'
        },
        disableClose: true,
        data: model,
        afterClosed: () => void this.getList()
      });
    }
  }
  //#endregion

  //#region Filters
  filterListByDurumu() {
    if (this.durumu !== undefined) {
      this.getList();
    }
  }


  handleFilterMenu(filterType: string) {
    switch (filterType) {
      case 'roleName':
        this.openFilterMenu();
        break;
      default:
    }
  }

  private loadSavedFilters() {
    const savedRoles = localStorage.getItem(this.LOCALSTORAGE_KEYS_SELECTED_ROLES.SELECTED_ROLES);
    if (savedRoles) {
      this.selectedRoles = JSON.parse(savedRoles);
      if (this.originalData.length > 0) {
          this.applyFilters();
      }
    }
  }

  private initializeFilters() {
    this.originalData = [...this.tableData];
    this.availableRoles = Array.from(new Set(
      this.originalData
      .map(user => user.roleName)
      .filter(role => role)
    ));
    this.selectedRoles = this.selectedRoles.filter(role =>
      this.availableRoles.includes(role)
    );
    this.saveRolesToStorage();
    this.applyFilters();
  }

  private saveRolesToStorage() {
    localStorage.setItem(
      this.LOCALSTORAGE_KEYS_SELECTED_ROLES.SELECTED_ROLES,
      JSON.stringify(this.selectedRoles)
    );
  }

  toggleFilterMenu() {
    this.filterMenuOpen = !this.filterMenuOpen;
  }

  onRoleFilterChange(role: string, checked: boolean) {
    if (checked) {
      this.selectedRoles = [...this.selectedRoles, role];
    } else {
      this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    }
    this.saveRolesToStorage();
    this.applyFilters();
  }

  private applyFilters() {
    if (!this.tableData || !this.originalData.length) return;
    let filteredData = [...this.originalData];
    if (this.selectedRoles.length > 0) {
      filteredData = filteredData.filter(user =>
        user.roleName && this.selectedRoles.includes(user.roleName)
      );
    }
    this.filteredData = filteredData;
    this.tableData = filteredData;
  }

  resetFilters() {
    this.selectedRoles = [];
    localStorage.removeItem(this.LOCALSTORAGE_KEYS_SELECTED_ROLES.SELECTED_ROLES);
    if (this.originalData.length > 0) {
        this.tableData = [...this.originalData];
    }
  }

  openFilterMenu(): void {
    this.filterBottomSheetService
    .openFilterSheet(this.availableRoles, this.selectedRoles, this.originalData)
    .subscribe(result => {
      if (result) {
        this.selectedRoles = result.selectedRoles;
        this.applyFilters();
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
    this.exportDataUserDefinitionsService.exportUserDefinitionsRequests(formattedData,'html');
  } else if (format === 'excel') {
    this.exportDataUserDefinitionsService.exportUserDefinitionsRequests(formattedData,'excel');
  } else if (format === 'csv') {
    this.exportDataUserDefinitionsService.exportUserDefinitionsRequests(formattedData,'csv');
  } else if (format === 'json') {
    this.exportDataUserDefinitionsService.exportUserDefinitionsRequests(formattedData,'json');
  } else if (format === 'txt') {
    this.exportDataUserDefinitionsService.exportUserDefinitionsRequests(formattedData,'txt');
  }
}

private getFormattedData(selection: any[], dataSource: any[]): ResultUser[] {
  const data = selection.length > 0 ? selection : dataSource;
  return data.map(item => ({
    id: item.id,
    userName: item.userName,
    email: item.email,
    isActive: item.isActive,
    createdAt: item.createdAt,
    roleName: item.roleName,
    customerId: item.customerId,
    nameSurname: item.nameSurname,
    customerName: item.customerName,
    twoFactorEnabled:item.twoFactorEnabled,
    unitName:item.unitName,
    phoneNumber:item.phoneNumber
  }));
}


exportToExcel = () => this.export('excel');
exportToCSV = () => this.export('csv');
exportToJSON = () => this.export('json');
exportToTXT = () => this.export('txt');
exportToHTML = () => this.export('html');
//#endregion

}





















