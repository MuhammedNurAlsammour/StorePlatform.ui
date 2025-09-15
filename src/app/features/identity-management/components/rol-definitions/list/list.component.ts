import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { AlertService, BaseComponent, DialogService, ListRolePermissions, MaterialListModule, PermissionsService, TableSortConfig } from '@coder-pioneers/shared';
import { CoderPioneersListComponent, ColumnDefinition, PaginationState, TableAction, TableConfig, TableFeatures } from '@coder-pioneers/ui-layout-components';
import { RequestRolDefinitions } from '@features/identity-management/contracts/requests/request-rol-definitions';
import { Menu, UpdateRoleEndpoint } from '@features/identity-management/contracts/requests/update-role-endpoint';
import { ListAuthorizeDefinitionEndpointAuth } from '@features/identity-management/contracts/responses/list-authorize-definition-endpoint-auth';
import { ListAuthorizeDefinitionEndpoints } from '@features/identity-management/contracts/responses/list-authorize-definition-endpoints';
import { DataRol, DataRolItem, ListRolDefinitions } from '@features/identity-management/contracts/responses/list-rol-definitions';
import { AuthTask, RolDefinitionsCreateDialogComponent } from '@features/identity-management/dialogs/rol-definitions-create-dialog/rol-definitions-create-dialog.component';
import { RolDefinitionsNewComponent } from '@features/identity-management/dialogs/rol-definitions-new/rol-definitions-new.component';
import { RolDefinitionsUpdateDialogComponent } from '@features/identity-management/dialogs/rol-definitions-update-dialog/rol-definitions-update-dialog.component';
import { ApplicationServiceApi, ApplicationServiceAuthApi } from '@features/identity-management/services/application.service';
import { AuthorizationEndpointsApiService, AuthorizationEndpointsAuthApiService } from '@features/identity-management/services/authorization-endpoints.service';
import { RolDefinitionsService } from '@features/identity-management/services/rol-definitions.service';
import { UserDefinitionsAuthService } from '@features/identity-management/services/user-definitions-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';

export interface Task {
  id?: number;
  name: string;
  completed: boolean;
  color: ThemePalette;
  code?: string;
  subtasks?: Task[];
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MaterialListModule,
    CoderPioneersListComponent,
    MatSnackBarModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit{
//#region ViewChild Tanımlamaları
@ViewChild(CoderPioneersListComponent)
baseTable?: CoderPioneersListComponent<DataRol>;
@ViewChild(MatTable) table!: MatTable<DataRol>;
@ViewChild(MatPaginator) paginator!: MatPaginator;
//#endregion

//#region Component Properties - Komponent Özellikleri
/** Tablo verileri */
tableData: DataRol[] = [];
isDataLoading: boolean = false;
@Input() filterValue?: string = '';
@Input() totalRows: number = 0;
@Input() initialPageIndex: number = 0;
//#endregion

  //#region Rol Tanımları
  endpoints?: ListAuthorizeDefinitionEndpoints[];
  hasEndpoints?: ListRolePermissions;
  hasEndpointAuth?: ListRolePermissions;
  tasks?: Task[];
  roleName: string = '';
  allTasksCompleted: boolean | undefined;
  endpointAuth?: ListAuthorizeDefinitionEndpointAuth[];
  authTask?: AuthTask[];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  private tasksAuthSubject = new BehaviorSubject<AuthTask[]>([]);
  tasksAuth$ = this.tasksAuthSubject.asObservable();
  //#endregion

  //#region Formatlama
  // Formatlama
  onRowClick(row: DataRol) {
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
      label: 'Rol Adı',
      visible: true,
      sortable: true,
      type: 'string',
      showTooltip: true
    },
  ];

  sortConfig: TableSortConfig = {
    storagePrefix: 'rol-list',
  };

  tableConfig: TableConfig = {
    showCheckbox: false,
    showActions: true,
    showActionsHeader: true,
    showActionsRow: true,
    defaultPageSize: 15,
    stickyHeader: true,
    enableRowHover: true,
    enableStriped: true,
    copyRow: true,
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
    colorOne: 'green',
    colorTwo: 'blue',
    iconOne: 'file_copy',
    iconTwo: 'edit_note',
    labelOne: 'Rolü çoğalt',
    labelTwo: 'Rol Yetki Düzenle',
    updatePermission: 'PUT.Updating.UpdateRole',
    updateOnePermission: 'PUT.Updating.UpdateRole',
    updateTwoPermission: 'PUT.Updating.UpdateRole',
    deletePermission: 'yok',
    deleteOnePermission: 'DELETE.Deleting.RolSil',
    deleteController: 'Rol',
    deleteAction: 'DeleteRol',
    handler: (element) => {}
  };
  //#endregion

  constructor(
    private dialogService:DialogService,
    public permissionsService:PermissionsService,
    spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
    private userDefinitionsAuthService: UserDefinitionsAuthService,
    private rolDefinitionsService: RolDefinitionsService,
    private authorizationEndpointsApiService: AuthorizationEndpointsApiService,
    private authorizationEndpointsAuthApiService: AuthorizationEndpointsAuthApiService,
    private applicationService: ApplicationServiceApi,
    private applicationServiceAuth: ApplicationServiceAuthApi,
    private _snackBar: MatSnackBar,

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

    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'v') {
        event.preventDefault();
        this.paste();
      }
    });
  }
  //#endregion

  ngOnDestroy() {
    document.removeEventListener('keydown', this.keydownHandler);
  }

  private keydownHandler = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'v') {
      event.preventDefault();
      this.paste();
    }
  };

  //#region ngAfterViewInit
  // Görünüm yüklendikten sonra çalışacak kısım
  ngAfterViewInit() {
  }
  //#endregion

  //#region Listeleme
  // Verileri listeleyen fonksiyonları
  async getList(paginationState?: PaginationState) {
    if (this.permissionsService.ifPermit('GET.Reading.GetRoles')){
     this.isDataLoading = true;
     const customerId = sessionStorage.getItem('customerId') || null;
     const institutionId = sessionStorage.getItem('institutionId') || null;
      const responseTotalRows = await this.rolDefinitionsService.read(
        {
          page: this.paginator ? this.paginator.pageIndex : 0,
          size: this.paginator ? this.paginator.pageSize : 1,
          customerId,
          institutionId
        }
      );

      if (responseTotalRows) {
        this.totalRows = Number(responseTotalRows.totalCount);
      }

      const responses = await this.rolDefinitionsService.read(
        {
          page: paginationState?.pageIndex || 0,
          size: paginationState?.pageSize || this.totalRows,
          customerId,
          institutionId
        }
      );

      if (responses) {
        const allData: ListRolDefinitions = responses;
        this.tableData = [...allData.datas];
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
  }
  //#endregion


  //#region Listeleme
  // getEndpoints api task listesini getiren fonksiyon
  async getEndpoints(element: DataRol){
    const apiResult = await this.applicationService.read();
    this.endpoints = Array.isArray(apiResult) ? apiResult : apiResult ? [apiResult] : [];
    if (element && element.id)
      this.hasEndpoints = await this.rolDefinitionsService.readFilter({roleId:element?.id});
    else
      this.hasEndpoints = new ListRolePermissions();
      let _taskId = 0;

    if (this.endpoints){
      this.tasks = this.endpoints.map(endpoint => ({
        number: _taskId++,
        name: endpoint.name,
        completed: false,
        color: 'primary',
        subtasks: endpoint.actions.map(action => ({
          name: action.definition,
          completed: this.hasEndpoints?.rolePermissions?.includes(action?.code) ? true : false,
          color: 'primary',
          code: action.code,
        })),
      }));
    }

    const authResult = await this.applicationServiceAuth.read();
    this.endpointAuth = Array.isArray(authResult) ? authResult : authResult ? [authResult] : [];
    if (element && element.id)
      this.hasEndpointAuth = await this.rolDefinitionsService.readFilter({roleId:element?.id});
    else
      this.hasEndpointAuth = new ListRolePermissions();

    if (this.endpointAuth){
      this.authTask = this.endpointAuth.map(endpoint => ({
        number: _taskId++,
        name: endpoint.name,
        completed: false,
        color: 'primary',
        subtaskAuth: endpoint.actions.map(actionAuth => ({
          name: actionAuth.definition,
          completed:
          this.hasEndpointAuth?.rolePermissions?.includes(actionAuth?.code) ? true : false,
          color: 'primary',
          code: actionAuth.code,
        })),
      }));
    }

    this.logDataForConversion(element);
  }

  logDataForConversion(element: DataRol) {
    const tasksData = this.prepareConversionData(this.tasks!, element.name);

    if (!navigator.clipboard) {
      const textArea = document.createElement('textarea');
      textArea.value = JSON.stringify(tasksData);
      document.body.appendChild(textArea);
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          this._snackBar.open('Bilgiler başarıyla kopyalandı', 'Kapat', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        } else {
          this._snackBar.open('Kopyalama sırasında bir hata oluştu', 'Kapat', {
            duration: 2000,
          });
        }
      } catch (err) {
        console.error('Metin kopyalama başarısız:', err);
        this._snackBar.open('Kopyalama sırasında bir hata oluştu', 'Kapat', {
          duration: 2000,
        });
      }
      document.body.removeChild(textArea);
    } else {
      navigator.clipboard.writeText(JSON.stringify(tasksData)).then(() => {
        this._snackBar.open('Bilgiler başarıyla kopyalandı', 'Kapat', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      });
    }

  }

  private prepareConversionData(tasks: Task[] | AuthTask[], roleName: string) {
    const processedCodes = new Set<string>();
    const customerId = sessionStorage.getItem('customerId');
    const institutionId = sessionStorage.getItem('institutionId');

    const requestData = tasks?.reduce((acc, task) => {
      const subtasks = (task as Task).subtasks || (task as AuthTask).subtaskAuth;
      subtasks?.forEach(subtask => {
        if (subtask.completed && subtask.code && !processedCodes.has(subtask.code)) {
          if (!acc[task.name]) {
            acc[task.name] = {
              menu: task.name,
              codes: []
            };
          }
          acc[task.name].codes.push(subtask.code);
          processedCodes.add(subtask.code);
        }
      });
      return acc;
    }, {} as { [menu: string]: Menu });

    const menus = Object.values(requestData);
    const request: UpdateRoleEndpoint = {
      role: `${roleName} - Kopya`,
      institutionId: institutionId!,
      customerId: customerId!,
      menus
    };

    return request;
  }

  async paste() {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
        const req = new RequestRolDefinitions();
        req.name = this.roleName;
        this.rolDefinitionsService.create(req);
        await delay(5000);
      const clipboardText = await navigator.clipboard.readText();
      let roleData: UpdateRoleEndpoint;

      try {
        roleData = JSON.parse(clipboardText);
      } catch (error) {
        this._snackBar.open('Geçersiz veri formatı', 'Kapat', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        return;
      }

      this.authorizationEndpointsApiService.create(roleData);

      this._snackBar.open('Rol başarıyla atandı', 'Kapat', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });

    } catch (error) {
      console.error('Yapıştırma sırasında hata:', error);
      this._snackBar.open('Yapıştırma sırasında bir hata oluştu', 'Kapat', {
        duration: 2000,
      });
    }
  }
  //#endregion

  //#region dialog
  // Güncelleme/ekleme işlemi için diyalog açma fonksiyonu
  delete(element: DataRol) {
    (this.rolDefinitionsService.delete({id: element.id}))
    .subscribe(result => {
      const errorMessage: string = result?.mesajDetay;
      this.alertService.success(errorMessage);
      this.getList();
    },(errorResponse: HttpErrorResponse) => {
      const errorMessage: string = errorResponse?.error?.mesajDetay;
      this.alertService.error(errorMessage);
    });
  }

  update(element: DataRol) {
    const data = new RequestRolDefinitions();
    data.id = element.id;
    data.name = element.name;
    this.dialogService.openDialog({
      componentType: RolDefinitionsUpdateDialogComponent,
      options: {
        width: '430px'
      },
      data,
      disableClose:true,
      afterClosed: (result: boolean) => {
        if (result) {
          this.getList();
        }
      }
    });
  }

  updateRol(element: DataRol) {
    let data = new DataRolItem();
    data = element as DataRolItem;
    this.dialogService.openDialog({
      componentType: RolDefinitionsCreateDialogComponent,
      options: {
        width: '1900px'
      },
      data,
      disableClose:true,
      afterClosed: (result: boolean) => {
        if (result) {
          this.getList();
        }
      }
    });
  }

  updateNew(element: DataRol) {
    let data = new DataRolItem();
    data = element as DataRolItem;
    this.dialogService.openDialog({
      componentType: RolDefinitionsNewComponent,
      options: {
        width: '1050px'
      },
      data,
      disableClose:true,
      afterClosed: (result: boolean) => {
        if (result) {
          this.getList();
        }
      }
    });
  }
  //#endregion

}
























