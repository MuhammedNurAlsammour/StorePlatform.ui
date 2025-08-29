import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AlertService, DialogService, MaterialModule, PermissionsService } from '@coder-pioneers/shared';
import { FilterBottomSheetService } from '@common/services/bottom-sheet/filter-bottom-sheet.service';
import { UserDefinitionsCreateDialogComponent } from '@features/identity-management/dialogs/user-definitions-create-dialog/user-definitions-create-dialog.component';
import { UserDefinitionsService } from '@features/identity-management/services/user-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment, MaterialListModule } from 'projects/shared/src/environments/environment.development';
import { of } from 'rxjs';
import { CreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let permissionsService: jasmine.SpyObj<PermissionsService>;
  let filterService: jasmine.SpyObj<FilterBottomSheetService>;

  beforeEach(async () => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['openDialog']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['warning', 'setConfig']);
    const permissionsServiceSpy = jasmine.createSpyObj('PermissionsService', ['ifPermit']);
    const filterServiceSpy = jasmine.createSpyObj('FilterBottomSheetService', ['open', 'openStatusFilter']);

    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        MaterialListModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        CreateComponent
      ],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
        { provide: 'authApiUrl', useValue: environment.apiUrls.authApiUrl },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: PermissionsService, useValue: permissionsServiceSpy },
        { provide: FilterBottomSheetService, useValue: filterServiceSpy },
        FormBuilder,
        UserDefinitionsService
      ]
    }).compileComponents();

    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    permissionsService = TestBed.inject(PermissionsService) as jasmine.SpyObj<PermissionsService>;
    filterService =
    TestBed.inject(FilterBottomSheetService) as jasmine.SpyObj<FilterBottomSheetService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('bileşen başarıyla oluşturulmalı creatComponent', () => {
    expect(component).toBeTruthy();
  });

  it('dışa aktarma seçenekleri doğru başlatılmalı', () => {
    expect(component.exportOptions.length).toBe(5);
    expect(component.exportOptions[0].type).toBe('excel');
    expect(component.exportOptions[1].type).toBe('csv');
    expect(component.exportOptions[2].type).toBe('txt');
    expect(component.exportOptions[3].type).toBe('json');
    expect(component.exportOptions[4].type).toBe('html');
  });

  it('filtre seçenekleri doğru başlatılmalı', () => {
    expect(component.filterOptions.length).toBe(1);
    expect(component.filterOptions[0].type).toBe('filtre1');
    expect(component.filterOptions[0].title).toBe('Kullanıcı Durumu Filtreleme');
    expect(component.filterOptions[0].description).toBe('Aktif veya Pasif kullanıcıları filtreleyin');
  });

  it('AlertService yapılandırması doğru ayarlanmalı', () => {
    expect(alertService.setConfig).toHaveBeenCalled();
  });

  it('kullanıcının izni olduğunda oluşturma dialogu açılmalı', () => {
    permissionsService.ifPermit.and.returnValue(true);
    component.create();
    expect(dialogService.openDialog).toHaveBeenCalledWith({
      componentType: UserDefinitionsCreateDialogComponent,
      options: {
        width: '730px'
      },
      disableClose: true,
      data: {},
      afterClosed: jasmine.any(Function)
    });
  });

  it('arama filtresi değeri yayınlanmalı', () => {
    spyOn(component.searchFilter, 'emit');
    const testValue = 'test arama';
    component.filterList(testValue);
    expect(component.searchFilter.emit).toHaveBeenCalledWith(testValue);
  });

  it('dışa aktarma türüne göre olaylar yayınlanmalı', () => {
    spyOn(component.excel, 'emit');
    spyOn(component.csv, 'emit');
    spyOn(component.txt, 'emit');
    spyOn(component.json, 'emit');
    spyOn(component.html, 'emit');

    component.handleExport('excel');
    expect(component.excel.emit).toHaveBeenCalled();

    component.handleExport('csv');
    expect(component.csv.emit).toHaveBeenCalled();

    component.handleExport('txt');
    expect(component.txt.emit).toHaveBeenCalled();

    component.handleExport('json');
    expect(component.json.emit).toHaveBeenCalled();

    component.handleExport('html');
    expect(component.html.emit).toHaveBeenCalled();
  });

  it('filtre türüne göre olaylar yayınlanmalı', () => {
    const mockResult = true;
    filterService.openStatusFilter.and.returnValue(of(mockResult));

    component.handleFilter('filtre1');
    expect(filterService.openStatusFilter).toHaveBeenCalledWith(null);

    // Test the subscription
    expect(component.selectedStatus).toBe(mockResult);
  });

  it('bilinmeyen dışa aktarma türü için hata mesajı gösterilmeli', () => {
    spyOn(console, 'error');
    component.handleExport('unknown');
    expect(console.error).toHaveBeenCalledWith('Bilinmeyen dışa aktarma türü:', 'unknown');
  });

  it('bilinmeyen filtre türü için hata mesajı gösterilmeli', () => {
    spyOn(console, 'error');
    component.handleFilter('unknown');
    expect(console.error).toHaveBeenCalledWith('Bilinmeyen dışa aktarma türü:', 'unknown');
  });
});




















