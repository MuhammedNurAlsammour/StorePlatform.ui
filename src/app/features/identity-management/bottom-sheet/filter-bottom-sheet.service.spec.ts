import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AlertService } from '@coder-pioneers/shared';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FilterBottomSheetService } from './filter-bottom-sheet.service';

describe('FilterBottomSheetService', () => {
  let service: FilterBottomSheetService;
  let httpMock: HttpTestingController;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let bottomSheetSpy: jasmine.SpyObj<MatBottomSheet>;

  const mockData = {
    availableRoles: ['Admin', 'User'],
    selectedRoles: ['Admin'],
    originalData: [{ id: 1, role: 'Admin' }]
  };

  beforeEach(() => {
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['error']);
    bottomSheetSpy = jasmine.createSpyObj('MatBottomSheet', ['open']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FilterBottomSheetService,
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: MatBottomSheet, useValue: bottomSheetSpy },
        { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl }
      ]
    });

    service = TestBed.inject(FilterBottomSheetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('servis başarıyla oluşturulmalı', () => {
    expect(service).toBeTruthy();
  });

  it('kullanıcı tanımları filtreleme dialogu açılmalı', () => {
    const mockBottomSheetRef = {
      afterDismissed: () => of(mockData)
    } as unknown as MatBottomSheetRef<unknown>;
    bottomSheetSpy.open.and.returnValue(mockBottomSheetRef);

    service.openFilterSheet(
      mockData.availableRoles,
      mockData.selectedRoles,
      mockData.originalData
    ).subscribe(result => {
      expect(result).toEqual(mockData);
    });

    expect(bottomSheetSpy.open).toHaveBeenCalled();
  });

  it('birimler filtreleme dialogu açılmalı', () => {
    const mockBottomSheetRef = {
      afterDismissed: () => of(mockData)
    } as unknown as MatBottomSheetRef<unknown>;
    bottomSheetSpy.open.and.returnValue(mockBottomSheetRef);

    service.openFilterSheetUnite(
      mockData.availableRoles,
      mockData.selectedRoles,
      mockData.originalData
    ).subscribe(result => {
      expect(result).toEqual(mockData);
    });

    expect(bottomSheetSpy.open).toHaveBeenCalled();
  });

  
  it('kurumlar filtreleme dialogu açılmalı', () => {
    const mockBottomSheetRef = {
      afterDismissed: () => of(mockData)
    } as unknown as MatBottomSheetRef<unknown>;
    bottomSheetSpy.open.and.returnValue(mockBottomSheetRef);

    service.openFilterSheetInstitution(
      mockData.availableRoles,
      mockData.selectedRoles,
      mockData.originalData
    ).subscribe(result => {
      expect(result).toEqual(mockData);
    });

    expect(bottomSheetSpy.open).toHaveBeenCalled();
  });

  it('ünvan filtreleme dialogu açılmalı', () => {
    const mockBottomSheetRef = {
      afterDismissed: () => of(mockData)
    } as unknown as MatBottomSheetRef<unknown>;
    bottomSheetSpy.open.and.returnValue(mockBottomSheetRef);

    service.openFilterSheetTitle(
      mockData.availableRoles,
      mockData.selectedRoles,
      mockData.originalData
    ).subscribe(result => {
      expect(result).toEqual(mockData);
    });

    expect(bottomSheetSpy.open).toHaveBeenCalled();
  });

  it('durum filtreleme dialogu açılmalı', () => {
    const mockBottomSheetRef = {
      afterDismissed: () => of(true)
    } as unknown as MatBottomSheetRef<unknown>;
      bottomSheetSpy.open.and.returnValue(mockBottomSheetRef);

    service.openStatusFilter(true).subscribe(result => {
      expect(result).toBeTrue();
    });

    expect(bottomSheetSpy.open).toHaveBeenCalled();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
























