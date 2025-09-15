
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AlertService, PermissionsService } from '@coder-pioneers/shared';
import { MaterialListModule } from '@coder-pioneers/shared';
import { MaterialModule } from '@coder-pioneers/shared';
import { DialogService } from '@coder-pioneers/shared';
import { TicketPaymentCreateDialogComponent } from '@features/definitions/dialogs/ticket-payment/ticket-payment-create-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateComponent } from './create.component';

describe('CreateTicketPaymentComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let permissionsService: jasmine.SpyObj<PermissionsService>;


  beforeEach(async () => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['openDialog']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['warning', 'setConfig']);
    const permissionsServiceSpy = jasmine.createSpyObj('PermissionsService', ['ifPermit']);

    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        MaterialListModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        CreateComponent
      ],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: PermissionsService, useValue: permissionsServiceSpy },
        FormBuilder
      ]
    }).compileComponents();

    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    permissionsService = TestBed.inject(PermissionsService) as jasmine.SpyObj<PermissionsService>;
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
    expect(component.filterOptions.length).toBe(4);
    expect(component.filterOptions[0].type).toBe('filtre1');
    expect(component.filterOptions[1].type).toBe('filtre2');
    expect(component.filterOptions[2].type).toBe('filtre3');
    expect(component.filterOptions[3].type).toBe('filtre4');
  });

  it('AlertService yapılandırması doğru ayarlanmalı', () => {
    expect(alertService.setConfig).toHaveBeenCalled();
  });

  it('kullanıcının izni olduğunda oluşturma dialogu açılmalı', () => {
    permissionsService.ifPermit.and.returnValue(true);
    component.create();
    expect(dialogService.openDialog).toHaveBeenCalledWith({
      componentType: TicketPaymentCreateDialogComponent,
      options: {
        width: '730px'
      },
      disableClose: true,
      data: {},
      afterClosed: jasmine.any(Function)
    });
  });



  it('createalert metodu uyarı göstermeli', () => {
    component.createalert();
    expect(alertService.warning).toHaveBeenCalledWith('Yetkiniz yok');
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
    spyOn(component.filtre1, 'emit');
    spyOn(component.filtre2, 'emit');
    spyOn(component.filtre3, 'emit');
    spyOn(component.filtre4, 'emit');

    component.handleFilter('filtre1');
    expect(component.filtre1.emit).toHaveBeenCalled();

    component.handleFilter('filtre2');
    expect(component.filtre2.emit).toHaveBeenCalled();

    component.handleFilter('filtre3');
    expect(component.filtre3.emit).toHaveBeenCalled();

    component.handleFilter('filtre4');
    expect(component.filtre4.emit).toHaveBeenCalled();
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























