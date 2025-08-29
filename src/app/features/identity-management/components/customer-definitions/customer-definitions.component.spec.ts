import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { MaterialListModule, MaterialModule, PermissionsService } from '@coder-pioneers/shared';
import { ResultCustomerDefinitions } from '@features/identity-management/contracts/responses/customer-definitions-response';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'projects/shared/src/environments/environment.development';
import { CreateComponent } from './create/create.component';
import { CustomerDefinitionsComponent } from './customer-definitions.component';
import { ListComponent } from './list/list.component';
import { CoderPioneersComponent, CoderPioneersListComponent } from '@coder-pioneers/ui-layout-components';

describe('CustomerDefinitionsComponent', () => {
  let component: CustomerDefinitionsComponent;
  let fixture: ComponentFixture<CustomerDefinitionsComponent>;
  let permissionsService: jasmine.SpyObj<PermissionsService>;
  let router: jasmine.SpyObj<Router>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let listComponent: jasmine.SpyObj<ListComponent>;
  let mockPaginator: jasmine.SpyObj<MatPaginator>;
  let mockCoderPioneersList: jasmine.SpyObj<CoderPioneersListComponent<ResultCustomerDefinitions>>;

  beforeEach(async () => {
    const permissionsServiceSpy = jasmine.createSpyObj('PermissionsService', ['ifPermit']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl'], {
      events: {
        subscribe: () => ({ unsubscribe: () => {} })
      }
    });
    routerSpy.createUrlTree.and.returnValue({ });
    routerSpy.serializeUrl.and.returnValue('');
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    const paginatorSpy = jasmine.createSpyObj('MatPaginator', ['page'], {
      pageIndex: 0,
      pageSize: 10,
      length: 0,
      page: {
        subscribe: () => {}
      }
    });

    const coderPioneersListSpy = jasmine.createSpyObj('CoderPioneersListComponent', [
      'updateDataSource',
      'updatePaginatorSettings'
    ], {
      paginator: paginatorSpy,
      data: [],
      totalRows: 0,
      initialPageIndex: 0,
      paginationState: {
        pageIndex: 0,
        pageSize: 10,
        length: 0
      },
      currentPageSize: 10,
      currentPageIndex: 0,
      currentPage: 0,
      dataSource: {
        data: [],
        sort: {
          active: '',
          direction: ''
        }
      },
      displayedColumns: ['select', 'name', 'address', 'phoneNumber', 'email', 'webSite', 'description', 'actions'],
      config: {
        showCheckbox: true,
        showActions: true,
        showActionsHeader: true,
        showActionsRow: true,
        defaultPageSize: 15,
        stickyHeader: true,
        enableRowHover: true,
        enableStriped: true,
        rowHeight: '48px'
      },
      features: {
        sort: true,
        filter: true,
        paginator: true,
        columnResize: true,
        contextMenu: true,
        rowSelection: true,
        export: true,
        search: true
      },
      columns: [
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
      ]
    });

    coderPioneersListSpy.updateDataSource.and.callFake(function(
      this: CoderPioneersListComponent<ResultCustomerDefinitions>
    ) {
      if (!this.dataSource) return;
      this.dataSource.data = this.data || [];
      if (this.paginator) {
        this.paginator.pageIndex = 0;
        this.updateDataSource();
      }
    });

    const listComponentSpy = jasmine.createSpyObj('ListComponent', [
      'getList',
      'exportToExcel',
      'exportToCSV',
      'exportToTXT',
      'exportToJSON',
      'exportToHTML'
    ], {
      baseTable: coderPioneersListSpy
    });

    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        MaterialListModule,
        ListComponent,
        CreateComponent,
        CoderPioneersComponent,
        CustomerDefinitionsComponent,
        HttpClientModule,
        NoopAnimationsModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: () => sessionStorage.getItem('access_token'),
            allowedDomains: environment.allowedDomains
          }
        }),
      ],
      providers: [
        { provide: PermissionsService, useValue: permissionsServiceSpy },
        { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
        { provide: 'authApiUrl', useValue: environment.apiUrls.authApiUrl },
        { provide: Router, useValue: routerSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: ActivatedRoute, useValue: {} },
        { provide: MatPaginator, useValue: paginatorSpy },
        HttpClient
      ]
    }).compileComponents();

    permissionsService = TestBed.inject(PermissionsService) as jasmine.SpyObj<PermissionsService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    listComponent = listComponentSpy;
    mockPaginator = TestBed.inject(MatPaginator) as jasmine.SpyObj<MatPaginator>;
    mockCoderPioneersList = coderPioneersListSpy;

    fixture = TestBed.createComponent(CustomerDefinitionsComponent);
    component = fixture.componentInstance;

    permissionsService.ifPermit.and.returnValue(true);
  });

  it('bileşen başarıyla oluşturulmalı Component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('kullanıcının izni olmadığında yetkisiz sayfasına yönlendirilmeli', () => {
    permissionsService.ifPermit.and.returnValue(false);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('kullanıcının izni olduğunda yönlendirme yapılmamalı', () => {
    permissionsService.ifPermit.and.returnValue(true);
    router.navigate.calls.reset();
    component.ngOnInit();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('receiveSearchValue çağrıldığında searchValue güncellenmeli', () => {
    fixture.detectChanges();
    const testValue = 'test search';
    component.receiveSearchValue(testValue);
    expect(component.searchValue).toBe(testValue);
  });

  it('created çağrıldığında listComponent üzerinde getList çağrılmalı', () => {
    fixture.detectChanges();
    component.listComponent = listComponent;
    component.created();
    expect(listComponent.getList).toHaveBeenCalled();
  });

  it('excel çağrıldığında listComponent üzerinde exportToExcel çağrılmalı', () => {
    fixture.detectChanges();
    component.listComponent = listComponent;
    component.excel();
    expect(listComponent.exportToExcel).toHaveBeenCalled();
  });

  it('exportToCSV çağrıldığında listComponent üzerinde exportToCSV çağrılmalı', () => {
    fixture.detectChanges();
    component.listComponent = listComponent;
    component.exportToCSV();
    expect(listComponent.exportToCSV).toHaveBeenCalled();
  });

  it('exportToTXT çağrıldığında listComponent üzerinde exportToTXT çağrılmalı', () => {
    fixture.detectChanges();
    component.listComponent = listComponent;
    component.exportToTXT();
    expect(listComponent.exportToTXT).toHaveBeenCalled();
  });

  it('exportToJSON çağrıldığında listComponent üzerinde exportToJSON çağrılmalı', () => {
    fixture.detectChanges();
    component.listComponent = listComponent;
    component.exportToJSON();
    expect(listComponent.exportToJSON).toHaveBeenCalled();
  });

  it('exportToHTML çağrıldığında listComponent üzerinde exportToHTML çağrılmalı', () => {
    fixture.detectChanges();
    component.listComponent = listComponent;
    component.exportToHTML();
    expect(listComponent.exportToHTML).toHaveBeenCalled();
  });

  it('listComponent tanımsız olduğunda hata fırlatılmamalı', () => {
    fixture.detectChanges();
    component.listComponent = undefined;
    expect(() => component.excel()).not.toThrow();
    expect(() => component.exportToCSV()).not.toThrow();
    expect(() => component.exportToTXT()).not.toThrow();
    expect(() => component.exportToJSON()).not.toThrow();
    expect(() => component.exportToHTML()).not.toThrow();
  });
});




















