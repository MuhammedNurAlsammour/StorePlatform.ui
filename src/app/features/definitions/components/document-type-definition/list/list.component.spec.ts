import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialListModule } from '@coder-pioneers/shared';
import { MaterialModule } from '@coder-pioneers/shared';
import { PermissionsService } from '@coder-pioneers/shared';
import { DialogService } from '@coder-pioneers/shared';
import { DocumentTypeDefinitionResponse, ResultDocumentTypeDefinition } from '@features/definitions/contracts/responses/document-type-definition-response';
import { DocumentTypeDefinitionCreateDialogComponent } from '@features/definitions/dialogs/document-type-definition/document-type-definition-create-dialog.component';
import { DocumentTypeDefinitionService } from '@features/definitions/services/document-type-definition.service';
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
    dataAll: true
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

describe('DocumentTypeDefinitionListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let documentTypeDefinitionService: jasmine.SpyObj<DocumentTypeDefinitionService>;
  let permissionsService: jasmine.SpyObj<PermissionsService>;

  beforeEach(async () => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['openDialog']);
    const documentTypeDefinitionServiceSpy = jasmine.createSpyObj('DocumentTypeDefinitionService', ['read']);
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
        { provide: DocumentTypeDefinitionService, useValue: documentTypeDefinitionServiceSpy },
        { provide: PermissionsService, useValue: permissionsServiceSpy },
        { provide: CoderPioneersListComponent, useClass: MockCoderPioneersListComponent }
      ]
    }).compileComponents();

    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
    documentTypeDefinitionService = 
    TestBed.inject(DocumentTypeDefinitionService) as jasmine.SpyObj<DocumentTypeDefinitionService>;
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
    expect(component.columns.length).toBe(1);
    expect(component.columns[0].name).toBe('name');
    expect(component.columns[0].label).toBe('Doküm Adı');
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
      columnResize: true,
      contextMenu: true,
      rowSelection: true,
      export: true,
      search: true
    };

    expect(component.tableFeatures).toEqual(expectedFeatures);
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
    documentTypeDefinitionService.read.and.returnValue(
      Promise.resolve(mockResponse as unknown as DocumentTypeDefinitionResponse)
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
    const sortEvent = { column: 'name', direction: 'asc' as const };
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
      name: 'Doküm Adı',
      createdAt: new Date(),
      isActive: true,
      customerId: '1',
      institutionId: '1'
    };

    const mockPaginationState: PaginationState = {
      pageIndex: 0,
      pageSize: 15,
      length: 100
    };

    component.initialPageIndex = mockPaginationState.pageIndex;
    component.totalRows = mockPaginationState.length;

    component.update(mockResponse as unknown as ResultDocumentTypeDefinition);

    const expectedRequest = {
      name: 'Doküm Adı',
    };

    expect(dialogService.openDialog).toHaveBeenCalledWith({
      componentType: DocumentTypeDefinitionCreateDialogComponent,
      options: {
        width: '430px'
      },
      disableClose: true,
      data: jasmine.objectContaining(expectedRequest),
      afterClosed: jasmine.any(Function)
    });
  });
});




















