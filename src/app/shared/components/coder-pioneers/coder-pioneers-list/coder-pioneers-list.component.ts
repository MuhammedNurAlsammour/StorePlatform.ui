import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChild,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
  ColumnDef,
  ColumnManagementService,
  ContextMenuBaseService,
  CustomDatePipe,
  ImageService,
  LoadingComponent,
  MaterialListModule,
  PermissionsService,
  ResizableTableService,
  SearchbarService,
  SortDirection,
  SortType,
} from '@coder-pioneers/shared';
import { Result } from '@coder-pioneers/shared/lib/common/services/table/context-menu.service';
import { TableSortService } from '@common/services/table/table-sort.service';
import { PipeRegistryService } from '@shared/services/pipe-registry.service';
import { filter, fromEvent, Subject, takeUntil } from 'rxjs';

export interface ColumnDefinition {
  name: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
  type?:
    | 'string'
    | 'number'
    | 'bool'
    | 'date'
    | 'dateTime'
    | 'month'
    | 'statusPaidBool'
    | 'truncateText'
    | 'statusLeave'
    | 'isActive'
    | 'image'
    | 'images'
    | 'gender'
    | 'educationStatus'
    | 'taskType'
    | 'accommodationType'
    | 'travelAllowanceType'
    | 'statusBool'
    | 'vacationTime'
    | 'leaveDateTime'
    | 'leaveDefinitionStatus'
    | 'custom';
  pipe?: string;
  pipeArgs?: any[];
  customPipe?: string; // Dinamik pipe ismi
  customPipeArgs?: any[]; // Dinamik pipe parametreleri
  pipeFunction?: (value: any, ...args: any[]) => any; // Dinamik fonksiyon
  cellTemplate?: TemplateRef<any>;
  width?: string;
  minWidth?: string;
  cellClass?: string;
  headerClass?: string;
  showTooltip?: boolean;
  filterMenu?: boolean;
}

export interface TableFeatures {
  sort?: boolean;
  filter?: boolean;
  paginator?: boolean;
  columnResize?: boolean;
  contextMenu?: boolean;
  rowSelection?: boolean;
  export?: boolean;
  search?: boolean;
  dragDrop?: boolean;
}

//#region sort
export interface TableSortConfig {
  storagePrefix?: string;
}
//#endregion

interface MenuItem {
  label: string;
  icon?: string;
  iconColor?: string;
  permission?: string;
  customAttributes?: any;
  handler: (element: any) => void;
}

export interface TableAction {
  label?: string;
  colorOne?: string;
  colorTwo?: string;
  colorThree?: string;
  iconOne?: string;
  iconTwo?: string;
  iconThree?: string;
  labelOne?: string;
  labelTwo?: string;
  labelThree?: string;
  title?: string;
  permission?: string;
  icon?: string;
  titleApprove?: string;
  permissionApprove?: string;
  iconApprove?: string;
  colorApprove?: string;
  titleDeny?: string;
  permissionDeny?: string;
  iconDeny?: string;
  colorDeny?: string;
  titleApproveAll?: string;
  permissionApproveAll?: string;
  iconApproveAll?: string;
  colorApproveAll?: string;
  titleDenyAll?: string;
  permissionDenyAll?: string;
  iconDenyAll?: string;
  colorDenyAll?: string;
  color?: string;
  subtitle?: string;
  hasEditOrDeletePermission?: boolean;
  showMenuIcon?: boolean;
  updatePermission?: string;
  updateOnePermission?: string;
  updateTwoPermission?: string;
  updateThreePermission?: string;
  deletePermission?: string;
  deleteIdPermission?: string;
  approvePermission?: string;
  denyPermission?: string;
  menuItems?: MenuItem[];
  template?: boolean;
  customTemplate?: string;
  showMenu?: (element: any) => boolean;
  downloadPermission?: string;
  uploadPermission?: string;
  hasUploadPermission?: boolean;
  deleteController?: string;
  deleteAction?: string;
  deleteOnePermission?: string;
  activePermission?: string;
  activeController?: string;
  activeAction?: string;
  passiveController?: string;
  passiveAction?: string;
  passivePermission?: string;
  handler?: (element: any) => void;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface TableConfig {
  showCheckbox?: boolean;
  showActions?: boolean;
  showActionsHeader?: boolean;
  showActionsRow?: boolean;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  stickyHeader?: boolean;
  dataAll?: boolean;
  rowHeight?: string;
  tableClass?: string;
  enableRowHover?: boolean;
  enableStriped?: boolean;
  enableResizable?: boolean;
  copyRow?: boolean;
}
@Component({
  selector: 'app-cp-list',
  standalone: true,
  imports: [CommonModule, CustomDatePipe, MaterialListModule, LoadingComponent],
  templateUrl: './coder-pioneers-list.component.html',
  styleUrl: './coder-pioneers-list.component.scss',
})
export class coderPioneersListComponent<T extends Result>
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  @ViewChild('contextMenu') contextMenu!: MatMenu;
  selectedElement: T | null = null;

  //#region date
  @ViewChild(MatTable) table!: MatTable<T>;
  @ContentChild('actionTemplate') actionTemplate?: TemplateRef<any>;
  private _data: T[] = [];
  @Input()
  set data(value: T[]) {
    this._data = value || [];
    this.updateDataSource();
  }
  get data(): T[] {
    return this._data;
  }
  dataSource: MatTableDataSource<T>;
  selection = new SelectionModel<T>(true, []);
  displayedColumns: string[] = [];
  @Input() isLoading: boolean = false;
  @Input() features: TableFeatures = {
    sort: true,
    filter: true,
    paginator: true,
    columnResize: false,
    contextMenu: true,
    dragDrop: false,
    rowSelection: true,
  };
  //#endregion

  //#region selected
  @Output() selectionChange = new EventEmitter<T[]>();

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
    this.selectionChange.emit(this.selection.selected);
  }

  //#region sort
  @ViewChild(MatSort) matSort!: MatSort;
  @Input() sortConfig: TableSortConfig = {
    storagePrefix: '',
  };
  private _tableId: string = 'holiddefList';

  get TABLE_ID(): string {
    return this.sortConfig.storagePrefix || this._tableId;
  }
  //#endregion

  //#region paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() pageChange = new EventEmitter<PaginationState>();
  @Input() initialPageIndex: number = 0;
  @Input() totalRows?: number;
  @Input() columns: ColumnDefinition[] = [];
  @Input() config: TableConfig = {
    showCheckbox: true,
    showActions: true,
    showActionsHeader: true,
    showActionsRow: true,
    pageSizeOptions: [10, 25, 50],
    defaultPageSize: 10,
    dataAll: true,
    copyRow: false,
    stickyHeader: true,
  };
  currentPageSize: number = 10;
  currentPageIndex: number = 0;
  currentPage: number = 0;
  private paginationState: PaginationState = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  };

  handlePageEvent(event: PageEvent) {
    this.paginationState = {
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      length: this.config.dataAll ? this.totalRows || 0 : this._data.length,
    };

    if (this.config.dataAll) {
      this.pageChange.emit(this.paginationState);
    }
    this.updateDataSource();
  }

  //#endregion
  @ViewChild('inputSearch') inputElement?: HTMLInputElement;
  // ======= Girişler (Inputs) =======
  /** Arama değeri */
  @Input() filterValue?: string = '';

  //#region clickedRows
  private destroy$ = new Subject<void>();
  clickedRows = new Set<T>();
  selectedRowIndex: string = '';

  private imageCache: Map<string, string> = new Map();

  constructor(
    private searchbarService: SearchbarService,
    public resizableTableService: ResizableTableService,
    public sortService: TableSortService,
    public contextMenuService: ContextMenuBaseService,
    public columnManager: ColumnManagementService,
    public permissionsService: PermissionsService,
    private imageService: ImageService,
    private pipeRegistry: PipeRegistryService
  ) {
    this.dataSource = new MatTableDataSource<T>([]);
  }

  //#region ngOnInit
  // Sayfa yüklendiğinde ilk çalışacak işlemler
  //#endregion
  ngOnInit() {
    if (this.config.copyRow) {
      fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(
          takeUntil(this.destroy$),
          filter((event) => event.ctrlKey && event.key === 'c')
        )
        .subscribe((event) => {
          const clickedRow = Array.from(this.clickedRows)[0];
          this.onRowCopy(clickedRow);
          event.preventDefault();
        });
    }
    this.paginationState = {
      pageIndex: this.initialPageIndex || 0,
      pageSize: this.config.defaultPageSize || 10,
      length: this.totalRows || 0,
    };

    this.sortService.configure({
      storagePrefix: this.sortConfig.storagePrefix || this.TABLE_ID,
    });

    this.setupSortService();
    this.initializeDisplayedColumns();
    this.initializeColumns();
  }

  //#region ngOnChanges
  // Değişiklikler takip edildiğinde filtreleme işlemi
  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalRows']) {
      this.paginationState.length = this.totalRows || 0;
      if (this.paginator) {
        this.updateDataSource();
        this.paginator.pageSizeOptions = this.config.pageSizeOptions || [
          10,
          25,
          50,
          this.totalRows || 0,
        ];
      }
    }

    if (changes.filterValue && !changes.filterValue.firstChange) {
      this.filterData();
    }

    if (changes['data']) {
      this.updateDataSource();
      if (this.paginator) {
        this.paginator.length = this.totalRows || 0;
        this.paginator.pageSizeOptions = this.config.pageSizeOptions || [
          10,
          25,
          50,
          this.totalRows || 0,
        ];
      }
      // Recalculate header height when data changes
      setTimeout(() => this.calculateHeaderHeight(), 50);
    }
  }
  //#endregion

  //#region ngAfterViewInit
  // Görünüm yüklendikten sonra çalışacak kısım
  ngAfterViewInit() {
    const table = document.querySelector(
      '.resizable-table'
    ) as HTMLTableElement;
    if (table) {
      this.resizableTableService.setupResizableColumns(table);
    }
    if (this.menuTrigger) {
      this.contextMenuService.setMenuTrigger(this.menuTrigger);

      this.menuTrigger.menuClosed.subscribe(() => {
        this.selectedElement = null;
      });
    }

    if (this.features.paginator && this.paginator) {
      this.updatePaginatorSettings();
    }

    if (this.features.sort && this.matSort) {
      this.dataSource.sort = this.matSort;
    }

    // Calculate header height for loading overlay
    this.calculateHeaderHeight();
  }

  private calculateHeaderHeight(): void {
    setTimeout(() => {
      const tableElement = document.querySelector('table.mat-mdc-table');
      const headerRow = tableElement?.querySelector('mat-header-row');
      if (headerRow) {
        const height = (headerRow as HTMLElement).offsetHeight;
        document.documentElement.style.setProperty(
          '--header-height',
          `${height}px`
        );
      }
    }, 100);
  }
  //#endregion

  ngOnDestroy() {
    if (this.menuTrigger) {
      this.menuTrigger.menuClosed.unsubscribe();
    }
    this.contextMenuService.clearSelection();
    this.destroy$.next();
    this.destroy$.complete();
    this.imageCache.clear();
  }

  public updateDataSource() {
    if (!this.dataSource) return;

    if (this.config.dataAll) {
      this.dataSource.data = this._data;
      this.updatePaginatorSettings();
    } else {
      if (!this.paginator) {
        this.dataSource.data = this._data;
        return;
      }

      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;

      this.dataSource.data = this._data.slice(startIndex, endIndex);

      if (this.paginator) {
        this.paginator.length = this._data.length;
      }
    }
  }

  private updatePaginatorSettings() {
    if (!this.paginator) {
      return;
    }

    if (this.paginator) {
      if (this.config.dataAll) {
        this.paginator.pageIndex = this.paginationState.pageIndex;
        this.paginator.pageSize = this.paginationState.pageSize;
        this.paginator.length = this.totalRows || 0;
        this.paginator.pageSizeOptions = this.config.pageSizeOptions || [
          10,
          25,
          50,
          this.totalRows || 0,
        ];
      } else {
        this.paginator.pageIndex = this.paginationState.pageIndex;
        this.paginator.pageSize = this.paginationState.pageSize;
      }
    }
  }

  protected initializeDisplayedColumns() {
    this.displayedColumns = [];
    if (this.config.showCheckbox) {
      this.displayedColumns.push('select');
    }
    this.displayedColumns.push(
      ...this.columns.filter((col) => col.visible).map((col) => col.name)
    );
    if (this.config.showActions) {
      this.displayedColumns.push('actions');
    }
  }

  private initializeColumns(): void {
    const initialColumns: ColumnDef[] = [];

    if (this.config.showCheckbox) {
      initialColumns.push({
        key: 'select',
        label: 'Select',
        visible: true,
        pinned: false as const,
        type: 'string' as SortType,
        sortDirection: 'none' as SortDirection,
      });
    }

    initialColumns.push(
      ...this.columns.map((col) => ({
        key: col.name,
        label: col.label,
        visible: true,
        pinned: false as const,
        type: 'string' as SortType,
        sortDirection: 'none' as SortDirection,
      }))
    );

    if (this.config.showActions) {
      initialColumns.push({
        key: 'actions',
        label: 'actions',
        visible: true,
        pinned: false as const,
        type: 'string' as SortType,
        sortDirection: 'none' as SortDirection,
      });
    }

    this.columnManager.initializeColumns(this.TABLE_ID, initialColumns);
    this.updateDisplayedColumns();
  }

  /**
   * @returns Tablo için tanımlı tüm kolonların yapılandırmalarını döner.
   */
  getColumnDefinitions(): ColumnDef[] {
    return this.columnManager.getColumnDefinitions(this.TABLE_ID);
  }

  /**
   * @param event - Sürükle ve bırak işlemi sırasında oluşan olay nesnesi.
   * Kolon sıralamasını günceller.
   */
  onColumnDrop(event: CdkDragDrop<string[]>): void {
    this.columnManager.dropColumn(this.TABLE_ID, event);
    this.updateDisplayedColumns();
  }
  /**
   * @param column - Görünürlüğü değiştirilecek kolonun tanımı.
   * Kolonun görünürlük ayarını günceller.
   */
  onVisibilityChange(column: ColumnDef): void {
    this.columnManager.setColumnVisibility(
      this.TABLE_ID,
      column.key,
      !column.visible
    );
    this.updateDisplayedColumns();
    this.setupSortService();
    this.initializeDisplayedColumns();
    this.initializeColumns();
  }

  /**
   * @param column - Sabitlenecek kolonun tanımı.
   * @param position - Sabitleme pozisyonu ('start' veya 'end').
   * Kolonu verilen pozisyonda sabitler.
   */
  onTogglePin(column: ColumnDef, position: 'start' | 'end'): void {
    this.columnManager.togglePin(this.TABLE_ID, column.key, position);
    this.updateDisplayedColumns();
  }

  /**
   * @param column - Sabitlenmesi kaldırılacak kolonun tanımı.
   * Kolonun sabitlemesini kaldırır.
   */
  onUnpin(column: ColumnDef): void {
    this.columnManager.unpin(this.TABLE_ID, column.key);
    this.updateDisplayedColumns();
  }

  /**
   * @private
   * Görüntülenen kolonları günceller.
   */
  public updateDisplayedColumns(): void {
    this.displayedColumns = this.columnManager.getDisplayedColumns(
      this.TABLE_ID
    );
  }

  /**
   * Kolon ayarlarını varsayılan değerlere sıfırlar.
   */
  onResetColumns(): void {
    const defaultColumns = [];

    if (this.config.showCheckbox) {
      defaultColumns.push({
        key: 'select',
        label: 'Select',
        visible: true,
        pinned: false as const,
        type: 'string' as SortType,
        sortDirection: 'none' as SortDirection,
      });
    }

    defaultColumns.push(
      ...this.columns.map((col) => ({
        key: col.name,
        label: col.label,
        visible: true,
        pinned: false as const,
        type: 'string' as SortType,
        sortDirection: 'none' as SortDirection,
      }))
    );

    if (this.config.showActions) {
      defaultColumns.push({
        key: 'actions',
        label: 'actions',
        visible: true,
        pinned: false as const,
        type: 'string' as SortType,
        sortDirection: 'none' as SortDirection,
      });
    }
    this.columnManager.resetColumnSettings(this.TABLE_ID, defaultColumns);
    this.updateDisplayedColumns();
  }

  //#region Silme
  // Bu bölüm Silme işlevini ve ilgili olayları içerir
  onRowClick(row: T) {
    this.rowClick.emit(row);
  }
  //#endregion

  //#region Düzenleme
  // Bu bölüm Düzenleme işlevini ve ilgili olayları içerir
  onRowDoubleClick(row: T) {
    this.rowDoubleClick.emit(row);
  }

  selectedRow: any = null;

  onRowClic(row: any) {
    this.selectedRow = row;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'c') {
      if (this.config.copyRow) {
        const clickedRow = Array.from(this.clickedRows)[0];
        if (clickedRow) {
          this.onRowCopy(clickedRow);
          event.preventDefault();
        }
      }
    }
  }

  onRowCopy(row: any) {
    if (this.config.copyRow) {
      this.rowCopy.emit(row);
    }
  }
  //#endregion

  //#region Arama
  // Bu bölüm arama işlevini ve ilgili olayları içerir
  //#endregion
  filterData() {
    if (this.dataSource) {
      const value = this.searchbarService.normalizeString(
        this.filterValue!.trim()
      );

      if (!this.paginator) {
        // If paginator is not initialized, just filter the data
        if (value) {
          const filteredData = this._data.filter((item) => {
            return this.displayedColumns.some((column) => {
              if (column === 'select' || column === 'actions') return false;

              const columnDef = this.columns.find((col) => col.name === column);
              if (!columnDef) return false;
              const cellValue = this.getCellValue(item, columnDef);
              if (cellValue) {
                return this.searchbarService
                  .normalizeString(cellValue.toString())
                  .includes(value);
              }
              return false;
            });
          });
          this.dataSource.data = filteredData;
        } else {
          this.dataSource.data = this._data;
        }
        return;
      }

      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;

      if (value) {
        const filteredData = this._data.filter((item) => {
          return this.displayedColumns.some((column) => {
            if (column === 'select' || column === 'actions') return false;

            const columnDef = this.columns.find((col) => col.name === column);
            if (!columnDef) return false;
            const cellValue = this.getCellValue(item, columnDef);
            if (cellValue) {
              return this.searchbarService
                .normalizeString(cellValue.toString())
                .includes(value);
            }
            return false;
          });
        });

        this.dataSource.data = filteredData;
        this.paginator.length = filteredData.length;
      } else {
        this.dataSource.data = this._data.slice(startIndex, endIndex);
        this.paginator.length = this._data.length;
      }

      this.paginator.pageSizeOptions = this.config.pageSizeOptions || [
        10,
        25,
        50,
        this.totalRows || 0,
      ];
      this.paginator.pageSize = this.config.defaultPageSize || 10;
    }
  }

  @HostListener('document:keydown', ['$event'])
  focusInput(event: KeyboardEvent): void {
    this.searchbarService.focusInput(event, this.inputElement);
  }

  //#region sağTıklama
  // Sağ tıklama olaylarını yönetir ve bir bağlam menüsü görüntüler
  //#endregion
  /**
   * @param event Bağlam menüsünü tetikleyen fare olayı
   * @param element Sağ tıklanan öğe
   */

  /** Seçili öğe */
  async onRightClick(event: MouseEvent, row: T) {
    try {
      event.preventDefault();
      await this.contextMenuService.onRightClick(event, row);
    } catch (error) {
      console.error('Right click error:', error);
    }
  }

  //#region sort
  // Yerel depolamadan sıralama durumu yüklenir ve kaydedilir.
  // Sütuna göre sıralama durumu değiştirilir. Eğer bir sütun zaten sıralanmışsa,
  // önceki sütunun sıralama durumu sıfırlanır. Sonra yeni sütun ve yönüne göre
  // veri sıralanır ve sonuçlar tabloya uygulanır.
  // Ayrıca, sıralama durumu yerel depolamaya kaydedilir.
  // Eğer sıralama 'none' durumuna dönerse, sıralama sıfırlanır ve liste güncellenir.
  // Sıralama işlemi "asc", "desc" ve "none" arasında değişir.
  @Output() sortChange = new EventEmitter<{
    column: string;
    direction: 'asc' | 'desc' | null;
  }>();

  setupSortService() {
    this.sortService.initializeColumns([
      ...this.columns.filter((col) => col.visible).map((col) => col.name),
    ]);

    this.sortService.currentSort$.subscribe((sortState) => {
      if (sortState.direction !== 'none') {
        this.dataSource = this.sortService.sortData(this.dataSource, sortState);
      } else {
        this.updateDataSource();
      }
    });
  }

  getCellValue(element: T, column: ColumnDefinition): any {
    if (!column || !column.name || !element) {
      return '';
    }
    const rawValue = column.name
      .split('.')
      .reduce((obj, key) => obj && obj[key], element as any);
    return this.applyPipe(rawValue, column);
  }

  /**
   * Dinamik pipe uygula
   * @param value Ham değer
   * @param column Kolon tanımı
   * @returns Pipe uygulanmış değer
   */
  applyPipe(value: any, column: ColumnDefinition): any {
    // Önce pipeFunction varsa onu kullan
    if (column.pipeFunction) {
      const args = column.customPipeArgs || [];
      return column.pipeFunction(value, ...args);
    }

    // customPipe varsa onu kullan
    if (column.customPipe) {
      const args = column.customPipeArgs || [];
      return this.pipeRegistry.transform(column.customPipe, value, ...args);
    }

    // Eski pipe sistemi (geriye dönük uyumluluk)
    if (column.pipe) {
      const args = column.pipeArgs || [];
      return this.pipeRegistry.transform(column.pipe, value, ...args);
    }

    return value;
  }

  /**
   * Tooltip için ham değeri al (pipe uygulanmamış)
   * @param element Satır verisi
   * @param column Kolon tanımı
   * @returns Ham değer
   */
  getRawCellValue(element: T, column: ColumnDefinition): any {
    if (!column || !column.name || !element) {
      return '';
    }
    return column.name
      .split('.')
      .reduce((obj, key) => obj && obj[key], element as any);
  }

  getCellTooltip(element: T, column: ColumnDefinition): any {
    if (!element || !column.name) {
      return '';
    }

    try {
      return column.name
        .split('.')
        .reduce(
          (obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''),
          element as any
        );
    } catch (error) {
      console.error(
        `Error getting cell value for column ${column.name}:`,
        error
      );
      return '';
    }
  }

  //#region  action
  @Output() rowClick = new EventEmitter<T>();
  @Output() rowDoubleClick = new EventEmitter<T>();
  @Output() rowCopy = new EventEmitter<T>();
  @Output() update = new EventEmitter<T>();
  @Output() updateOne = new EventEmitter<T>();
  @Output() updateTwo = new EventEmitter<T>();
  @Output() updateThree = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() deleteOne = new EventEmitter<T>();
  @Output() active = new EventEmitter<T>();
  @Output() passive = new EventEmitter<T>();
  @Output() approve = new EventEmitter<T>();
  @Output() deny = new EventEmitter<T>();
  @Output() allApprove = new EventEmitter<void>();
  @Output() allDeny = new EventEmitter<void>();
  @Output() download = new EventEmitter<T>();
  @Output() upload = new EventEmitter<T>();
  @Output() dropRowList = new EventEmitter<CdkDragDrop<T[]>>();
  buttonStates: { [key: string]: string } = {};

  dropRow(event: CdkDragDrop<T[]>): void {
    this.dropRowList.emit(event);
  }
  onUpdate(element: T): void {
    this.update.emit(element);
  }

  onUpdateOne(element: T): void {
    this.updateOne.emit(element);
  }

  onUpdateTwo(element: T): void {
    this.updateTwo.emit(element);
  }

  onUpdateThree(element: T): void {
    this.updateThree.emit(element);
  }

  onDelete(element: T): void {
    this.delete.emit(element);
  }

  onDeleteOne(element: T): void {
    this.deleteOne.emit(element);
  }

  onActive(element: T): void {
    this.active.emit(element);
  }

  onPassive(element: T): void {
    this.passive.emit(element);
  }
  onApprove(element: T): void {
    this.approve.emit(element);
  }

  onDeny(element: T): void {
    this.deny.emit(element);
  }

  onAllApprove(): void {
    this.allApprove.emit();
  }

  onAllDeny(): void {
    this.allDeny.emit();
  }

  onDownload(element: T): void {
    this.download.emit(element);
  }

  onUpload(element: T): void {
    this.upload.emit(element);
  }

  ifPermit(permission: string): boolean {
    return true;
  }

  @Input() actions: TableAction = {
    label: '',
    icon: '',
    color: '',
    colorOne: '',
    colorTwo: '',
    colorThree: '',
    iconOne: '',
    iconTwo: '',
    iconThree: '',
    labelOne: '',
    labelTwo: '',
    labelThree: '',
    titleApprove: '',
    permissionApprove: '',
    iconApprove: '',
    colorApprove: '',
    titleDeny: '',
    permissionDeny: '',
    iconDeny: '',
    colorDeny: '',
    title: '',
    subtitle: '',
    hasEditOrDeletePermission: false,
    updatePermission: '',
    deletePermission: '',
    approvePermission: '',
    denyPermission: '',
    updateOnePermission: '',
    updateTwoPermission: '',
    updateThreePermission: '',
    downloadPermission: '',
    uploadPermission: '',
    hasUploadPermission: false,
    deleteController: '',
    deleteOnePermission: '',
    deleteAction: '',
    handler: () => {},
  };

  hasEditOrDeletePermission(): boolean {
    return (
      this.ifPermit('{{this.updatePermission}}') ||
      this.ifPermit('{{this.deletePermission}}') ||
      this.actions.hasEditOrDeletePermission === true
    );
  }

  has(): boolean {
    return (
      this.ifPermit('{{this.approvePermission}}') ||
      this.actions.hasEditOrDeletePermission === true
    );
  }

  hasApproveOrDenyPermission(): boolean {
    return (
      this.ifPermit('{{this.approvePermission}}') ||
      this.ifPermit('{{this.denyPermission}}')
    );
  }

  // Buton durumunu güncellemek için metod
  updateButtonState(elementId: string, state: string): void {
    this.buttonStates[elementId] = state;
  }

  //#region exportData
  @Output() exportRequested = new EventEmitter<void>();
  @Output() filterMenuRequested = new EventEmitter<string>();

  protected exportData() {
    this.exportRequested.emit();
  }

  protected openFilterMenu(columnName: string) {
    this.filterMenuRequested.emit(columnName);
  }

  //#region İmage
  // fotoğraf
  getImageUrl(element: T): string {
    const cacheKey = `${element.id}-${element.photo}`;

    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey)!;
    }

    const photo = element.photo;
    let imageUrl: string;

    if (!photo) {
      imageUrl = this.imageService.generateImage(
        element.firstName || element.employeeName,
        element.lastName || element.employeeName,
        element.gender
      );
    } else if (photo.startsWith('data:image')) {
      imageUrl = photo;
    } else {
      imageUrl = `data:image/png;base64,${photo}`;
    }

    this.imageCache.set(cacheKey, imageUrl);
    return imageUrl;
  }

  getImagesUrl(element: T, column?: ColumnDefinition): string {
    const imageFieldName = column?.name || 'productPhoto';
    const nameFieldName = 'productName';

    const cacheKey = `${element.id}-${element[imageFieldName]}`;

    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey)!;
    }

    const photo = element[imageFieldName];
    let imagesUrl: string;

    if (!photo) {
      const displayName = element[nameFieldName] || 'Product';
      imagesUrl = this.imageService.generateImage(displayName, displayName, 1);
    } else if (photo.startsWith('data:image')) {
      imagesUrl = photo;
    } else {
      imagesUrl = `data:image/png;base64,${photo}`;
    }

    this.imageCache.set(cacheKey, imagesUrl);
    return imagesUrl;
  }

  highlight(row: T) {
    this.selectedRowIndex = row.id;
  }
  //#endregion
}
