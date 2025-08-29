import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { DialogService, MaterialListModule, MaterialModule, PermissionsService, SpinnerType } from '@coder-pioneers/shared';
import { CustomerDefinitionsResponse, ResultCustomerDefinitions } from '@features/identity-management/contracts/responses/customer-definitions-response';
import { CustomerDefinitionsCreateDialogComponent } from '@features/identity-management/dialogs/customer-definitions/customer-definitions-create-dialog.component';
import { CustomerDefinitionsService } from '@features/identity-management/services/customer-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListComponent } from './list.component';
import { environment } from 'projects/shared/src/environments/environment.development';
import { CoderPioneersListComponent, PaginationState } from '@coder-pioneers/ui-layout-components';

@Component({
  selector: 'app-cp-list',
  template: ''
})
class MockCoderPioneersListComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() data: any[] = [];
  @Input() totalRows: number = 0;
  @Input() columns: any[] = [];
  @Input() config: any = {
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

describe('ListCustomerDefinitionsComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let customerDefinitionsService: jasmine.SpyObj<CustomerDefinitionsService>;
  let permissionsService: jasmine.SpyObj<PermissionsService>;

  beforeEach(async () => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['openDialog']);
    const permissionsServiceSpy = jasmine.createSpyObj('PermissionsService', ['ifPermit']);
    const customerDefinitionsServiceSpy = jasmine.createSpyObj('CustomerDefinitionsService', ['read']);

    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        MaterialListModule,
        HttpClientModule,
        NoopAnimationsModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: () => sessionStorage.getItem('access_token'),
            allowedDomains: environment.allowedDomains
          }
        }),
        ListComponent
      ],
      declarations: [
        MockCoderPioneersListComponent
      ],
      providers: [
        { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
        { provide: 'authApiUrl', useValue: environment.apiUrls.authApiUrl },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: CustomerDefinitionsService, useValue: customerDefinitionsServiceSpy },
        { provide: PermissionsService, useValue: permissionsServiceSpy },
        { provide: CoderPioneersListComponent, useClass: MockCoderPioneersListComponent }
      ]
    }).compileComponents();

    spinner = spinnerSpy;
    dialogService = dialogServiceSpy;
    permissionsService = permissionsServiceSpy;
    customerDefinitionsService = customerDefinitionsServiceSpy;
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
    expect(component.columns.length).toBe(6);
    expect(component.columns[0].name).toBe('name');
    expect(component.columns[0].label).toBe('Müşteri Adı');
    expect(component.columns[1].name).toBe('address');
    expect(component.columns[1].label).toBe('Adres');
    expect(component.columns[2].name).toBe('phoneNumber');
    expect(component.columns[2].label).toBe('Telefon Numarası');
    expect(component.columns[3].name).toBe('email');
    expect(component.columns[3].label).toBe('Email');
    expect(component.columns[4].name).toBe('webSite');
    expect(component.columns[4].label).toBe('Web Sitesi');
    expect(component.columns[5].name).toBe('description');
    expect(component.columns[5].label).toBe('Açıklama');
  });

  it('tablo yapılandırması doğru ayarlanmalı', () => {
    const expectedConfig = {
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
      updatePermission: 'PUT.Updating.MüşteriGüncelle',
      deleteOnePermission: 'DELETE.Deleting.MüşteriSil',
      deleteController: 'Customer',
      deleteAction: 'DeleteCustomer'
    };

    expect(component.tableActions.label).toBe(expectedActions.label);
    expect(component.tableActions.icon).toBe(expectedActions.icon);
    expect(component.tableActions.color).toBe(expectedActions.color);
    expect(component.tableActions.updatePermission).toBe(expectedActions.updatePermission);
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
    customerDefinitionsService.read.and.returnValue(
      Promise.resolve({} as CustomerDefinitionsResponse)
    );
    await component.getList();
    expect(spinner.show).toHaveBeenCalledWith(SpinnerType.BallNewtonCradle);
  });

  it('veri yüklendikten sonra spinner gizlenmeli', async () => {
    permissionsService.ifPermit.and.returnValue(true);
    const mockResponse = {
      id: '123',
      name: 'Test Müşteri',
      address: 'Test Adres, İstanbul',
      description: 'Test Açıklama',
      phoneNumber: '0212 555 55 55',
      email: 'test@example.com',
      webSite: 'www.test.com',
    };
    customerDefinitionsService.read.and.returnValue(
      Promise.resolve(mockResponse as unknown as CustomerDefinitionsResponse)
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
    expect(component.getList).toHaveBeenCalled();
  });

  it('sıralama değişikliği olayı çalışmalı', () => {
    spyOn(component, 'getList');
    const sortEvent = { column: 'name', direction: 'asc' as const };
    component.onSortChange(sortEvent);
    expect(component.getList).toHaveBeenCalled();
  });

  it('dışa aktarma metodları çağrılmalı', () => {
    const mockPaginationState: PaginationState = {
      pageIndex: 0,
      pageSize: 15,
      length: 100
    };

    component.initialPageIndex = mockPaginationState.pageIndex;
    component.totalRows = mockPaginationState.length;

    const exportSpy = spyOn(component, 'export').and.callThrough();

    component.exportToExcel();
    expect(exportSpy).toHaveBeenCalledWith('excel');

    component.exportToCSV();
    expect(exportSpy).toHaveBeenCalledWith('csv');

    component.exportToJSON();
    expect(exportSpy).toHaveBeenCalledWith('json');

    component.exportToTXT();
    expect(exportSpy).toHaveBeenCalledWith('txt');

    component.exportToHTML();
    expect(exportSpy).toHaveBeenCalledWith('html');
  });

  it('güncelleme dialogu açılmalı', () => {
    const mockResponse = {
      id: '123',
      name: 'Test Müşteri',
      address: 'Test Adres, İstanbul',
      description: 'Test Açıklama',
      phoneNumber: '0212 555 55 55',
      email: 'test@example.com',
      webSite: 'www.test.com',
    };

    const mockPaginationState: PaginationState = {
      pageIndex: 0,
      pageSize: 15,
      length: 100
    };

    component.initialPageIndex = mockPaginationState.pageIndex;
    component.totalRows = mockPaginationState.length;

    component.update(mockResponse as unknown as ResultCustomerDefinitions);

    const expectedRequest = {
      id: '123',
      name: 'Test Müşteri',
      address: 'Test Adres, İstanbul',
      description: 'Test Açıklama',
      phoneNumber: '0212 555 55 55',
      email: 'test@example.com',
      webSite: 'www.test.com'
    };

    expect(dialogService.openDialog).toHaveBeenCalledWith({
      componentType: CustomerDefinitionsCreateDialogComponent,
      options: {
        width: '730px'
      },
      disableClose: true,
      data: jasmine.objectContaining(expectedRequest),
      afterClosed: jasmine.any(Function)
    });
  });
});




















