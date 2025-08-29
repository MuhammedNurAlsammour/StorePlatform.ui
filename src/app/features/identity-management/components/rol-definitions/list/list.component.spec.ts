import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { AlertService, DialogService, MaterialListModule, MaterialModule, PermissionsService, SpinnerType } from '@coder-pioneers/shared';
import { CoderPioneersListComponent, PaginationState } from '@coder-pioneers/ui-layout-components';
import { DataRol, ListRolDefinitions } from '@features/identity-management/contracts/responses/list-rol-definitions';
import { RolDefinitionsNewComponent } from '@features/identity-management/dialogs/rol-definitions-new/rol-definitions-new.component';
import { RolDefinitionsUpdateDialogComponent } from '@features/identity-management/dialogs/rol-definitions-update-dialog/rol-definitions-update-dialog.component';
import { RolDefinitionsService } from '@features/identity-management/services/rol-definitions.service';
import { UserDefinitionsAuthService } from '@features/identity-management/services/user-definitions-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'projects/shared/src/environments/environment.development';
import { ListComponent } from './list.component';

@Component({
  selector: 'app-cp-list',
  template: ''
})
class MockCoderPioneersListComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() data: any[] = [];
  @Input() totalRows: number = 0;
  @Input() columns: any[] = [];
  @Input() config: any = {
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
  @Input() features: any = {
    sort: true,
    filter: true,
    paginator: true,
    columnResize: true,
    contextMenu: true,
    rowSelection: true,
    export: true,
    search: true
  };
  @Input() actions: any = {};
  @Input() filterValue: string = '';
  @Input() initialPageIndex: number = 0;

  _data: any[] = [];
  dataSource: MatTableDataSource<any>;
  paginator: any;
  currentPageSize: number = 15;
  currentPageIndex: number = 0;
  currentPage: number = 0;
  displayedColumns: string[] = [];

  paginationState: PaginationState = {
    pageIndex: 0,
    pageSize: 15,
    length: 100
  };

  constructor() {
    this.dataSource = new MatTableDataSource<any>([]);
    this.initializePaginator();
  }

  private initializePaginator() {
    const pageEmitter = new EventEmitter<any>();
    const initializedEmitter = new EventEmitter<any>();

    this.paginator = {
      pageIndex: this.initialPageIndex || 0,
      pageSize: this.config?.defaultPageSize || 15,
      length: this.totalRows || 0,
      pageSizeOptions: this.config?.pageSizeOptions || [15, 20, 25],
      page: pageEmitter,
      initialized: initializedEmitter,
      firstPage: () => {
        if (this.paginator) {
          this.paginator.pageIndex = 0;
          this.updateDataSource();
        }
      },
      lastPage: () => {
        if (this.paginator) {
          const lastPageIndex = Math.ceil(this.totalRows / this.paginator.pageSize) - 1;
          this.paginator.pageIndex = lastPageIndex;
          this.updateDataSource();
        }
      },
      nextPage: () => {
        if (
          this.paginator &&
          this.paginator.pageIndex <
          Math.ceil(this.totalRows / this.paginator.pageSize) - 1) {
          this.paginator.pageIndex++;
          this.updateDataSource();
        }
      },
      previousPage: () => {
        if (this.paginator && this.paginator.pageIndex > 0) {
          this.paginator.pageIndex--;
          this.updateDataSource();
        }
      },
      hasNextPage: () => this.paginator ?
      this.paginator.pageIndex <
      Math.ceil(this.totalRows / this.paginator.pageSize) - 1 : false,
      hasPreviousPage: () => this.paginator ? this.paginator.pageIndex > 0 : false
    };

    setTimeout(() => initializedEmitter.emit(), 0);
  }

  ngOnInit() {
    if (!this.paginator) {
      this.initializePaginator();
    }
    this.paginationState = {
      pageIndex: this.initialPageIndex || 0,
      pageSize: this.config?.defaultPageSize || 15,
      length: this.totalRows || 0
    };
  }

  ngAfterViewInit() {
    if (!this.paginator) {
      this.initializePaginator();
    }
    if (this.paginator && this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.updateDataSource();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.paginator) {
      this.initializePaginator();
    }

    if (changes['totalRows'] && this.paginator) {
      this.paginationState.length = this.totalRows || 0;
      this.paginator.length = this.totalRows || 0;
      this.updateDataSource();
      this.paginator.pageSizeOptions =
      this.config?.pageSizeOptions || [10, 25, 50, this.totalRows || 0];
    }

    if (changes['data']) {
      this._data = this.data || [];
      this.updateDataSource();
      if (this.paginator) {
        this.paginator.length = this.totalRows || 0;
        this.paginator.pageSizeOptions =
        this.config?.pageSizeOptions || [10, 25, 50, this.totalRows || 0];
      }
    }

    if (changes['config'] && this.paginator) {
      this.paginator.pageSize = this.config?.defaultPageSize || 15;
      this.paginator.pageSizeOptions = this.config?.pageSizeOptions || [15, 20, 25];
    }
  }

  updateDataSource() {
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource<any>([]);
    }

    if (!this.paginator) {
      this.initializePaginator();
    }

    if (!this.paginator || this.paginator.pageIndex === undefined) {
      return;
    }

    if (this.config?.dataAll) {
      this.dataSource.data = this._data;
      this.updatePaginatorSettings();
    } else {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.dataSource.data = this._data.slice(startIndex, endIndex);
      this.paginator.length = this._data.length;
    }
  }

  updatePaginatorSettings() {
    if (!this.paginator) {
      this.initializePaginator();
      return;
    }

    if (this.config?.dataAll) {
      this.paginator.pageIndex = this.paginationState.pageIndex || 0;
      this.paginator.pageSize = this.paginationState.pageSize || 15;
      this.paginator.length = this.totalRows || 0;
      this.paginator.pageSizeOptions =
      this.config?.pageSizeOptions || [10, 25, 50, this.totalRows || 0];
    } else {
      this.paginator.pageIndex = this.paginationState.pageIndex || 0;
      this.paginator.pageSize = this.paginationState.pageSize || 15;
    }
  }
}

describe('ListRolDefinitionsComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let rolDefinitionsService: jasmine.SpyObj<RolDefinitionsService>;
  let permissionsService: jasmine.SpyObj<PermissionsService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let userDefinitionsAuthService: jasmine.SpyObj<UserDefinitionsAuthService>;

  beforeEach(async () => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['openDialog']);
    const permissionsServiceSpy = jasmine.createSpyObj('PermissionsService', ['ifPermit']);
    const rolDefinitionsServiceSpy = jasmine.createSpyObj('RolDefinitionsService', ['read']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['success', 'error']);
    const userDefinitionsAuthServiceSpy = jasmine.createSpyObj('UserDefinitionsAuthService', ['createRoleToUser']);

    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        MaterialListModule,
        HttpClientModule ,
        NoopAnimationsModule,
        ListComponent,
        JwtModule.forRoot({
          config: {
            tokenGetter: () => sessionStorage.getItem('access_token'),
            allowedDomains: environment.allowedDomains
          }
        }),
      ],
      declarations: [MockCoderPioneersListComponent],
      providers: [
        { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
        { provide: 'authApiUrl', useValue: environment.apiUrls.authApiUrl },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: RolDefinitionsService, useValue: rolDefinitionsServiceSpy },
        { provide: PermissionsService, useValue: permissionsServiceSpy },
        { provide: CoderPioneersListComponent, useClass: MockCoderPioneersListComponent },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: UserDefinitionsAuthService, useValue: userDefinitionsAuthServiceSpy }
      ]
    }).compileComponents();

    spinner = spinnerSpy;
    dialogService = dialogServiceSpy;
    permissionsService = permissionsServiceSpy;
    rolDefinitionsService = rolDefinitionsServiceSpy;
    alertService = alertServiceSpy;
    userDefinitionsAuthService = userDefinitionsAuthServiceSpy;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('bileşen başarıyla oluşturulmalı listComponent', () => {
    expect(component).toBeTruthy();
  });

  it('tablo sütunları doğru yapılandırılmalı', () => {
    expect(component.columns.length).toBe(1);
    expect(component.columns[0].name).toBe('name');
    expect(component.columns[0].label).toBe('Rol Adı');
  });

  it('tablo yapılandırması doğru ayarlanmalı', () => {
    const expectedConfig = {
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
    expect(component.tableConfig).toEqual(expectedConfig);
  });

  it('tablo özellikleri doğru ayarlanmalı', () => {
    const expectedFeatures = {
      sort: true,
    filter: true,
    paginator: true,
    columnResize: true,
    contextMenu: true,
    rowSelection: true,
    export: true,
    search: true
    };

    expect(component.tableFeatures).toEqual(expectedFeatures);
  });

  it('tablo aksiyonları doğru ayarlanmalı', () => {
    const expectedActions = {
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
      deleteAction: 'DeleteRol'
    };

    expect(component.tableActions.label).toBe(expectedActions.label);
    expect(component.tableActions.icon).toBe(expectedActions.icon);
    expect(component.tableActions.color).toBe(expectedActions.color);
    expect(component.tableActions.updatePermission).toBe(expectedActions.updatePermission);
    expect(component.tableActions.deletePermission).toBe(expectedActions.deletePermission);
    expect(component.tableActions.deleteOnePermission).toBe(expectedActions.deleteOnePermission);
    expect(component.tableActions.deleteController).toBe(expectedActions.deleteController);
    expect(component.tableActions.deleteAction).toBe(expectedActions.deleteAction);
  });

  it('GET ülke listeleme işlemi başlatıldığında getList metodu çağrılmalı', () => {
    spyOn(component, 'getList');
    component.ngOnInit();
    expect(component.getList).toHaveBeenCalled();
  });

  it('veri yüklenirken spinner gösterilmeli', async () => {
    permissionsService.ifPermit.and.returnValue(true);
    const mockResponse = {
      datas: [],
      totalCount: 0,
      result: [],
      refId: 0,
      id: 0,
      mesajBaslik: '',
      mesajIcerik: '',
      mesajDetay: ''
    };
    rolDefinitionsService.read.and.returnValue(
      Promise.resolve(mockResponse as unknown as ListRolDefinitions)
    );

    await component.getList();
    expect(spinner.show).toHaveBeenCalledWith(SpinnerType.BallNewtonCradle);
  });

  it('veri yüklendikten sonra spinner gizlenmeli', async () => {
    permissionsService.ifPermit.and.returnValue(true);
    const mockResponse = {
      datas: [],
      totalCount: 0,
      result: [],
      refId: 0,
      id: 0,
      mesajBaslik: '',
      mesajIcerik: '',
      mesajDetay: ''
    };
    rolDefinitionsService.read.and.returnValue(
      Promise.resolve(mockResponse as unknown as ListRolDefinitions)
    );

    await component.getList();
    expect(spinner.hide).toHaveBeenCalledWith(SpinnerType.BallNewtonCradle);
  });

  it('sayfalama değiştiğinde getList metodu çağrılmalı', async () => {
    spyOn(component, 'getList');
    const mockPaginationState: PaginationState = {
      pageIndex: 0,
      pageSize: 15,
      length: 100
    };

    component.initialPageIndex = mockPaginationState.pageIndex;
    component.totalRows = mockPaginationState.length;


    await component.onPageChange(mockPaginationState);
    expect(component.getList).toHaveBeenCalledWith(mockPaginationState);
  });

  it('sıralama değişikliği olayı çalışmalı', () => {
    spyOn(component, 'getList');
    const sortEvent = { column: 'name', direction: 'asc' as const };
    component.onSortChange(sortEvent);
    expect(component.getList).toHaveBeenCalled();
  });

  it('update() rol güncelleme dialogu açılmalı', () => {
    const mockResponse = {
      id: '1212',
      name: 'Admin'
    };

    const mockPaginationState: PaginationState = {
      pageIndex: 0,
      pageSize: 15,
      length: 100
    };

    component.initialPageIndex = mockPaginationState.pageIndex;
    component.totalRows = mockPaginationState.length;

    component.update(mockResponse as unknown as DataRol);

    const expectedRequest = {
      id: '1212',
      name: 'Admin'
    };

    expect(dialogService.openDialog).toHaveBeenCalledWith({
      componentType: RolDefinitionsUpdateDialogComponent,
      options: {
        width: '430px'
      },
      data: jasmine.objectContaining(expectedRequest),
      disableClose: true,
      afterClosed: jasmine.any(Function)
    });
  });


  it('updateNew() yeni rol güncelleme dialogu açılmalı', () => {
    const mockResponse = {
      id: '1212',
      name: 'Admin'
    };

    component.updateNew(mockResponse as unknown as DataRol);

    const expectedRequest = {
    id: '1212',
      name: 'Admin'
    };

    expect(dialogService.openDialog).toHaveBeenCalledWith({
      componentType: RolDefinitionsNewComponent,
      options: {
        width: '1050px'
      },
      disableClose: true,
      data: jasmine.objectContaining(expectedRequest),
      afterClosed: jasmine.any(Function)
    });
  });

});




















