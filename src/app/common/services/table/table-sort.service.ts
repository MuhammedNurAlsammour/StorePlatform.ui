import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';

export type SortDirection = 'asc' | 'desc' | 'none';
export type SortType = 'string' | 'number' | 'bool' | 'date' | 'month' | 'dateTime' | 'boolean' | 'statusPaidBool' | 'images' | 'truncateText' | 'taskType' | 'statusLeave' | 'isActive' | 'image'  | 'gender' | 'educationStatus' | 'scorcardStatus' | 'status' | 'accommodationType' | 'travelAllowanceType' | 'statusBool' | 'statusText' | 'screenSize' | 'productType' | 'ramSize' | 'processorType' | 'storageType' | 'warranty' | 'vacationTime' | 'payrollStatus' | 'payrollStatusUser' | 'leaveDateTime' | 'leaveDefinitionStatus' | 'custom';
export type NullPosition = 'first' | 'last';

export interface TableSortConfig {
  storagePrefix: string;
}
export interface SortState {
  column: string;
  direction: SortDirection;
  type: SortType;
  ignoreCase: boolean;
  nullsPosition: NullPosition;
}

@Injectable({
  providedIn: 'root'
})
export class TableSortService {
  private sortStatesSubject = new BehaviorSubject<{ [key: string]: SortDirection }>({});
  private currentSortSubject = new BehaviorSubject<SortState>({
    column: '',
    direction: 'none',
    type: 'string',
    ignoreCase: true,
    nullsPosition: 'last'
  });
  private activeColumnSubject = new BehaviorSubject<string | null>(null);

  sortStates$ = this.sortStatesSubject.asObservable();
  currentSort$ = this.currentSortSubject.asObservable();
  activeColumn$ = this.activeColumnSubject.asObservable();

  private storagePrefix: string = 'table_sort';
  private storageKeys: { [key: string]: string } = {
    SORT_STATES: 'table_sort_sortStates',
    CURRENT_SORT: 'table_sort_currentSort',
    ACTIVE_COLUMN: 'table_sort_activeColumn'
  };

  constructor() {
    this.loadStateFromStorage();
  }

  configure(config: TableSortConfig) {
    this.storagePrefix = config.storagePrefix;
    this.updateStorageKeys();

    if (!localStorage.getItem(this.storageKeys.SORT_STATES)) {
      localStorage.setItem(this.storageKeys.SORT_STATES, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.storageKeys.CURRENT_SORT)) {
      localStorage.setItem(this.storageKeys.CURRENT_SORT, JSON.stringify({
        column: '',
        direction: 'none',
        type: 'string',
        ignoreCase: true,
        nullsPosition: 'last'
      }));
    }
    if (!localStorage.getItem(this.storageKeys.ACTIVE_COLUMN)) {
      localStorage.setItem(this.storageKeys.ACTIVE_COLUMN, JSON.stringify(null));
    }

    this.loadStateFromStorage();
  }

  private updateStorageKeys() {
    this.storageKeys = {
      SORT_STATES: `${this.storagePrefix}_sortStates`,
      CURRENT_SORT: `${this.storagePrefix}_currentSort`,
      ACTIVE_COLUMN: `${this.storagePrefix}_activeColumn`
    };
  }

  initializeColumns(columns: string[]) {
    const savedStates = this.loadStateFromStorage();

    if (!savedStates || Object.keys(savedStates).length === 0) {
      const sortStates = columns.reduce((acc, column) => {
        acc[column] = 'none';
        return acc;
      }, {} as { [key: string]: SortDirection });

      this.sortStatesSubject.next(sortStates);
      this.saveStateToStorage();
    }
  }

  toggleSort(column: string, type: SortType = 'string'): SortDirection {
    const currentStates = this.sortStatesSubject.value;
    const activeColumn = this.activeColumnSubject.value;

    if (activeColumn && activeColumn !== column) {
      currentStates[activeColumn] = 'none';
    }

    const currentDirection = currentStates[column] || 'none';
    let newDirection: SortDirection;

    switch (currentDirection) {
      case 'none': newDirection = 'asc'; break;
      case 'asc': newDirection = 'desc'; break;
      case 'desc': newDirection = 'none'; break;
      default: newDirection = 'asc';
    }

    currentStates[column] = newDirection;
    this.sortStatesSubject.next({ ...currentStates });
    this.activeColumnSubject.next(column);

    const newSortState: SortState = {
      column,
      direction: newDirection,
      type,
      ignoreCase: true,
      nullsPosition: 'last'
    };

    this.currentSortSubject.next(newSortState);
    this.saveStateToStorage();

    return newDirection;
  }

  applySavedSort<T>(dataSource: MatTableDataSource<T>): MatTableDataSource<T> {
    const savedSort = this.currentSortSubject.value;
    if (savedSort.direction !== 'none' && savedSort.column) {
      return this.sortData(dataSource, savedSort);
    }
    return dataSource;
  }

  sortData<T>(dataSource: MatTableDataSource<T>, sortState: SortState): MatTableDataSource<T> {
    if (sortState.direction === 'none' || !sortState.column) {
      return dataSource;
    }

    const sortedData = [...dataSource.data].sort((a: any, b: any) => {
      let aVal = a[sortState.column];
      let bVal = b[sortState.column];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortState.nullsPosition === 'first' ? -1 : 1;
      if (bVal == null) return sortState.nullsPosition === 'first' ? 1 : -1;

      switch (sortState.type) {
        case 'date':
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
          break;
        case 'number':
          aVal = Number(aVal);
          bVal = Number(bVal);
          break;
        case 'string':
          if (sortState.ignoreCase) {
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
          }
          break;
        case 'custom':
          // Custom pipe'lı değerler için string olarak karşılaştır
          aVal = String(aVal || '').toLowerCase();
          bVal = String(bVal || '').toLowerCase();
          break;
      }

      if (aVal < bVal) return sortState.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortState.direction === 'asc' ? 1 : -1;
      return 0;
    });

    const newDataSource = new MatTableDataSource<T>(sortedData);
    newDataSource.paginator = dataSource.paginator;
    newDataSource.sort = dataSource.sort;
    newDataSource.filter = dataSource.filter;

    return newDataSource;
  }

  getSortIcon(column: string): string {
    const sortState = this.sortStatesSubject.value[column];
    switch (sortState) {
      case 'asc': return 'arrow_upward';
      case 'desc': return 'arrow_downward';
      default: return 'sort';
    }
  }

  private loadStateFromStorage() {
    try {
      const savedStates = localStorage.getItem(this.storageKeys.SORT_STATES);
      const savedSort = localStorage.getItem(this.storageKeys.CURRENT_SORT);
      const savedColumn = localStorage.getItem(this.storageKeys.ACTIVE_COLUMN);

      if (savedStates) {
        const states = JSON.parse(savedStates);
        this.sortStatesSubject.next(states);
      }

      if (savedSort) {
        const sort = JSON.parse(savedSort);
        if (sort.nullsPosition !== 'first' && sort.nullsPosition !== 'last') {
          sort.nullsPosition = 'last';
        }
        this.currentSortSubject.next(sort as SortState);
      }

      if (savedColumn) {
        const column = JSON.parse(savedColumn);
        this.activeColumnSubject.next(column);
      }

      return savedStates ? JSON.parse(savedStates) : null;
    } catch (error) {
      console.error('Error loading sort state:', error);
      return null;
    }
  }

  private saveStateToStorage() {
    try {
      localStorage.setItem(this.storageKeys.SORT_STATES,
        JSON.stringify(this.sortStatesSubject.value));
      localStorage.setItem(this.storageKeys.CURRENT_SORT,
        JSON.stringify(this.currentSortSubject.value));
      localStorage.setItem(this.storageKeys.ACTIVE_COLUMN,
        JSON.stringify(this.activeColumnSubject.value));
    } catch (error) {
      console.error('Error saving sort state:', error);
    }
  }
}
