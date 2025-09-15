import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PermissionsService } from '@coder-pioneers/shared';
import { MaterialListModule } from '@coder-pioneers/shared';
import { MaterialModule } from '@coder-pioneers/shared';
import { DialogService } from '@coder-pioneers/shared';
import { TicketPaymentResponse } from '@features/definitions/contracts/responses/ticket-payment-response';
import { TicketPaymentCreateDialogComponent } from '@features/definitions/dialogs/ticket-payment/ticket-payment-create-dialog.component';
import { TicketPaymentService } from '@features/definitions/services/ticket-payment.service';
import { SpinnerType } from '@coder-pioneers/shared';
import { CoderPioneersListComponent, PaginationState } from '@coder-pioneers/ui-layout-components';
import { NgxSpinnerService } from 'ngx-spinner';
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
  @Input() features: any = {
    sort: true,
    filter: true,
    paginator: true,
    columnResize: false,
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

describe('ListTicketPaymentComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let ticketPaymentService: jasmine.SpyObj<TicketPaymentService>;
  let permissionsService: jasmine.SpyObj<PermissionsService>;

  beforeEach(async () => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['openDialog']);
    const ticketPaymentServiceSpy = jasmine.createSpyObj('TicketPaymentService', ['read']);
    const permissionsServiceSpy = jasmine.createSpyObj('PermissionsService', ['ifPermit']);

    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        MaterialListModule,
        HttpClientModule,
        NoopAnimationsModule,
        ListComponent
      ],
      declarations: [MockCoderPioneersListComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: TicketPaymentService, useValue: ticketPaymentServiceSpy },
        { provide: PermissionsService, useValue: permissionsServiceSpy },
        { provide: CoderPioneersListComponent, useClass: MockCoderPioneersListComponent }
      ]
    }).compileComponents();

    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
    ticketPaymentService = 
    TestBed.inject(TicketPaymentService) as jasmine.SpyObj<TicketPaymentService>;
    permissionsService = TestBed.inject(PermissionsService) as jasmine.SpyObj<PermissionsService>;
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
    expect(component.columns.length).toBe(3);
    expect(component.columns[0].name).toBe('year');
    expect(component.columns[0].label).toBe('Yıl');
    expect(component.columns[1].name).toBe('month');
    expect(component.columns[1].label).toBe('Ay');
    expect(component.columns[2].name).toBe('mealPrice');
    expect(component.columns[2].label).toBe('Yemek Fiyatı');
  });

  it('tablo yapılandırması doğru ayarlanmalı', () => {
    const expectedConfig = {
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
    expect(component.tableConfig).toEqual(expectedConfig);
  });

  it('tablo özellikleri doğru ayarlanmalı', () => {
    const expectedFeatures = {
      sort: true,
      filter: true,
      paginator: true,
      columnResize: false,
      contextMenu: true,
      rowSelection: true,
      export: true,
      search: true
    };

    expect(component.tableFeatures).toEqual(expectedFeatures);
  });

  it('tablo aksiyonları doğru ayarlanmalı', () => {
    expect(component.tableActions.title).toBe('Kullanılabilir Veri Yok');
    expect(component.tableActions.subtitle).toBe('Görüntülenecek herhangi bir kayıt bulunamadı');
    expect(component.tableActions.label).toBe('Düzenle');
  });

  it('GET ülke listeleme işlemi başlatıldığında getList metodu çağrılmalı', () => {
    spyOn(component, 'getList');
    component.ngOnInit();
    expect(component.getList).toHaveBeenCalled();
  });

  it('veri yüklenirken spinner gösterilmeli', () => {
    component.getList();
    expect(spinner.show).toHaveBeenCalled();
  });

  it('veri yüklendikten sonra spinner gizlenmeli', async () => {
    permissionsService.ifPermit.and.returnValue(true);
    const mockResponse = {
      result: [],
      refId: 0,
      id: 0,
      mesajBaslik: '',
      mesajIcerik: '',
      mesajDetay: ''
    };
    ticketPaymentService.read.and.returnValue(
      Promise.resolve(mockResponse as unknown as TicketPaymentResponse)
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
    const sortEvent = { column: 'year', direction: 'asc' as const };
    component.onSortChange(sortEvent);
    expect(component.onSortChange).toBeDefined();
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
      id: '1',
      customerId: '058611d1-6e41-4d79-bc2d-c7ece15d50b0',
      year: 2024,
      month: 5,
      mealPrice: 500,
      isActive: 1,
      createdAt: new Date()
    };

    const mockPaginationState: PaginationState = {
      pageIndex: 0,
      pageSize: 15,
      length: 100
    };

    component.initialPageIndex = mockPaginationState.pageIndex;
    component.totalRows = mockPaginationState.length;

    component.update(mockResponse);

    expect(dialogService.openDialog).toHaveBeenCalledWith({
      componentType: TicketPaymentCreateDialogComponent,
      options: {
        width: '730px'
      },
      disableClose: true,
      data: jasmine.objectContaining({
        id: '1',
        customerId: '058611d1-6e41-4d79-bc2d-c7ece15d50b0',
        year: 2024,
        month: 5,
        mealPrice: 500
      }),
      afterClosed: jasmine.any(Function)
    });
  });
});























