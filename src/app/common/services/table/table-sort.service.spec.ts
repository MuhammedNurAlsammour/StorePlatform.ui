import { TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { SortState, TableSortService } from './table-sort.service';

describe('TableSortService', () => {
  let service: TableSortService;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    mockLocalStorage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => mockLocalStorage[key]);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });

    TestBed.configureTestingModule({
      providers: [TableSortService]
    });

    service = TestBed.inject(TableSortService);
  });

  it('servis oluşturulmalı', () => {
    expect(service).toBeTruthy();
  });

  describe('Yapılandırma', () => {
    it('depolama öneki yapılandırılmalı', () => {
      const config = { storagePrefix: 'test_prefix' };
      service.configure(config);
      expect(localStorage.getItem('test_prefix_sortStates')).toBeDefined();
    });
  });

  describe('Sütun Başlatma', () => {
    it('sütunları varsayılan sıralama durumuyla başlatmalı', () => {
      const columns = ['name', 'age', 'date'];
      service.initializeColumns(columns);

      service.sortStates$.subscribe(states => {
        expect(states['name']).toBe('none');
        expect(states['age']).toBe('none');
        expect(states['date']).toBe('none');
      });
    });
  });

  describe('Sıralama Değiştirme', () => {
    it('sıralama yönünü doğru şekilde değiştirmeli', () => {
      const column = 'name';
      const type = 'string';

      // İlk değiştirme: none -> asc
      let direction = service.toggleSort(column, type);
      expect(direction).toBe('asc');

      // İkinci değiştirme: asc -> desc
      direction = service.toggleSort(column, type);
      expect(direction).toBe('desc');

      // Üçüncü değiştirme: desc -> none
      direction = service.toggleSort(column, type);
      expect(direction).toBe('none');
    });

    it('önceki sütun sıralama durumunu sıfırlamalı', () => {
      service.toggleSort('name', 'string');
      service.toggleSort('age', 'number');

      service.sortStates$.subscribe(states => {
        expect(states['name']).toBe('none');
        expect(states['age']).toBe('asc');
      });
    });
  });

  describe('Veri Sıralama', () => {
    it('metin verilerini doğru sıralamalı', () => {
      const data = [
        { name: 'Charlie' },
        { name: 'Alice' },
        { name: 'Bob' }
      ];
      const dataSource = new MatTableDataSource(data);
      const sortState: SortState = {
        column: 'name',
        direction: 'asc',
        type: 'string',
        ignoreCase: true,
        nullsPosition: 'last'
      };

      const sortedDataSource = service.sortData(dataSource, sortState);
      expect(sortedDataSource.data[0].name).toBe('Alice');
      expect(sortedDataSource.data[1].name).toBe('Bob');
      expect(sortedDataSource.data[2].name).toBe('Charlie');
    });

    it('sayısal verileri doğru sıralamalı', () => {
      const data = [
        { age: 30 },
        { age: 20 },
        { age: 25 }
      ];
      const dataSource = new MatTableDataSource(data);
      const sortState: SortState = {
        column: 'age',
        direction: 'asc',
        type: 'number',
        ignoreCase: true,
        nullsPosition: 'last'
      };

      const sortedDataSource = service.sortData(dataSource, sortState);
      expect(sortedDataSource.data[0].age).toBe(20);
      expect(sortedDataSource.data[1].age).toBe(25);
      expect(sortedDataSource.data[2].age).toBe(30);
    });

    it('tarih verilerini doğru sıralamalı', () => {
      const data = [
        { date: new Date('2024-03-20') },
        { date: new Date('2024-03-18') },
        { date: new Date('2024-03-19') }
      ];
      const dataSource = new MatTableDataSource(data);
      const sortState: SortState = {
        column: 'date',
        direction: 'asc',
        type: 'date',
        ignoreCase: true,
        nullsPosition: 'last'
      };

      const sortedDataSource = service.sortData(dataSource, sortState);
      expect(sortedDataSource.data[0].date).toEqual(new Date('2024-03-18'));
      expect(sortedDataSource.data[1].date).toEqual(new Date('2024-03-19'));
      expect(sortedDataSource.data[2].date).toEqual(new Date('2024-03-20'));
    });
  });

  describe('Sıralama İkonu', () => {
    it('doğru sıralama ikonunu döndürmeli', () => {
      const column = 'name';

      // Başlangıç durumu
      expect(service.getSortIcon(column)).toBe('sort');

      // İlk değiştirmeden sonra
      service.toggleSort(column, 'string');
      expect(service.getSortIcon(column)).toBe('arrow_upward');

      // İkinci değiştirmeden sonra
      service.toggleSort(column, 'string');
      expect(service.getSortIcon(column)).toBe('arrow_downward');

      // Üçüncü değiştirmeden sonra
      service.toggleSort(column, 'string');
      expect(service.getSortIcon(column)).toBe('sort');
    });
  });

  describe('Depolama İşlemleri', () => {
    it('sıralama durumunu depolamaya kaydetmeli ve yüklemeli', () => {
      const column = 'name';
      service.toggleSort(column, 'string');

      // Servis durumunu temizle
      service = TestBed.inject(TableSortService);

      // Durumu depolamadan yükle
      service.sortStates$.subscribe(states => {
        expect(states[column]).toBe('asc');
      });
    });

    it('geçersiz depolama verilerini düzgün şekilde işlemeli', () => {
      localStorage.setItem('table_sort_currentSort', 'invalid json');
      service = TestBed.inject(TableSortService);
      expect(service).toBeTruthy();
    });
  });
});
