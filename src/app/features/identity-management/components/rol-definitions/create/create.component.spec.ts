import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AlertService, DialogService, MaterialListModule, MaterialModule, PermissionsService } from '@coder-pioneers/shared';
import { RolDefinitionsCreateDialogComponent } from '@features/identity-management/dialogs/rol-definitions-create-dialog/rol-definitions-create-dialog.component';
import { RolDefinitionsService } from '@features/identity-management/services/rol-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'projects/shared/src/environments/environment.development';
import { CreateComponent } from './create.component';

describe('CreateRolDefinitionsComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let permissionsService: jasmine.SpyObj<PermissionsService>;
  let rolDefinitionsService: jasmine.SpyObj<RolDefinitionsService>;

  beforeEach(async () => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['openDialog']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['warning', 'setConfig']);
    const permissionsServiceSpy = jasmine.createSpyObj('PermissionsService', ['ifPermit']);
    const rolDefinitionsServiceSpy = jasmine.createSpyObj('RolDefinitionsService', ['create']);

    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        MaterialListModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        HttpClientModule,
        CreateComponent
      ],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: PermissionsService, useValue: permissionsServiceSpy },
        { provide: RolDefinitionsService, useValue: rolDefinitionsServiceSpy },
        { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
        { provide: 'authApiUrl', useValue: environment.apiUrls.authApiUrl },
        FormBuilder,
        HttpClient
      ]
    }).compileComponents();

    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    permissionsService = TestBed.inject(PermissionsService) as jasmine.SpyObj<PermissionsService>;
    rolDefinitionsService =
    TestBed.inject(RolDefinitionsService) as jasmine.SpyObj<RolDefinitionsService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('bileşen başarıyla oluşturulmalı creatComponent', () => {
    expect(component).toBeTruthy();
  });

  it('AlertService yapılandırması doğru ayarlanmalı', () => {
    expect(alertService.setConfig).toHaveBeenCalled();
  });

  it('kullanıcının izni olduğunda oluşturma dialogu açılmalı', () => {
    permissionsService.ifPermit.and.returnValue(true);
    component.create();
    expect(dialogService.openDialog).toHaveBeenCalledWith({
      componentType: RolDefinitionsCreateDialogComponent,
      options: {
        width: '1050px'
      },
      disableClose: true,
      data: {},
      afterClosed: jasmine.any(Function)
    });
  });

  it('createalert metodu uyarı göstermeli', () => {
    component.createalert();
    expect(alertService.warning).toHaveBeenCalledWith('yetkiniz yok');
  });

  it('arama filtresi değeri yayınlanmalı', () => {
    spyOn(component.searchFilter, 'emit');
    const testValue = 'test arama';
    component.filterList(testValue);
    expect(component.searchFilter.emit).toHaveBeenCalledWith(testValue);
  });
});




















