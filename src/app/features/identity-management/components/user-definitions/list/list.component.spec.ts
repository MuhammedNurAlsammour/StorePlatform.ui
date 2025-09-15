import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AlertService, CoderPioneersListComponent, DialogService, MaterialModule, PaginationState, PermissionsService, SpinnerType } from '@coder-pioneers/shared';
import { FilterBottomSheetService } from '@common/services/bottom-sheet/filter-bottom-sheet.service';
import { RequestRolAddUser } from '@features/identity-management/contracts/requests/request-rol-add-user';
import { ListUserDefAuthRes, ResultUser } from '@features/identity-management/contracts/responses/list-user-definitions-respon';
import { ChangePasswordDialogComponent } from '@features/identity-management/dialogs/change-password-dialog/change-password-dialog.component';
import { UserAddEmployeeCreateDialogComponent } from '@features/identity-management/dialogs/user-add-employee-update-dialog/user-add-employee-create-dialog.component';
import { UserAddRolComponent } from '@features/identity-management/dialogs/user-add-rol/user-add-rol.component';
import { UserDefinitionsService } from '@features/identity-management/services/user-definitions.service';
import { RequestUserAddEmployee } from '@features/staff-management/contracts/requests/request-user-add-employee';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment, MaterialListModule } from 'projects/shared/src/environments/environment.development';
import { CreateComponent } from '../create/create.component';
import { ListComponent } from './list.component';

@Component({
  selector: 'app-coder-pioneers-list',
  template: ''
})
class MockCoderPioneersListComponent {}

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let permissionsService: jasmine.SpyObj<PermissionsService>;
  let filterService: jasmine.SpyObj<FilterBottomSheetService>;
  let userdefinitionsservice: jasmine.SpyObj<UserDefinitionsService>;

  beforeEach(async () => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['openDialog']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['warning', 'setConfig']);
    const permissionsServiceSpy = jasmine.createSpyObj('PermissionsService', ['ifPermit']);
    const filterServiceSpy = jasmine.createSpyObj('FilterBottomSheetService', ['open', 'openStatusFilter']);
    const userdefinitionsserviceSpy = jasmine.createSpyObj('UserDefinitionsService', ['read']);

    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        MaterialListModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        ListComponent,
        CreateComponent
      ],
      declarations: [MockCoderPioneersListComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: 'baseUrl', useValue: environment.apiUrls.baseUrl },
        { provide: 'authApiUrl', useValue: environment.apiUrls.authApiUrl },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: PermissionsService, useValue: permissionsServiceSpy },
        { provide: FilterBottomSheetService, useValue: filterServiceSpy },
        { provide: UserDefinitionsService, useValue: userdefinitionsserviceSpy },
        { provide: CoderPioneersListComponent, useClass: MockCoderPioneersListComponent }
      ]
    }).compileComponents();

    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    permissionsService = TestBed.inject(PermissionsService) as jasmine.SpyObj<PermissionsService>;
    filterService =
    TestBed.inject(FilterBottomSheetService) as jasmine.SpyObj<FilterBottomSheetService>;
    userdefinitionsservice =
    TestBed.inject(UserDefinitionsService) as jasmine.SpyObj<UserDefinitionsService>;
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
    expect(component.columns.length).toBe(4);
    expect(component.columns[0].name).toBe('nameSurname');
    expect(component.columns[0].label).toBe('Personel Adı');
    expect(component.columns[1].name).toBe('userName');
    expect(component.columns[1].label).toBe('Kullanıcı Adı');
    expect(component.columns[2].name).toBe('roleName');
    expect(component.columns[2].label).toBe('Rol Adı');
    expect(component.columns[3].name).toBe('customerName');
    expect(component.columns[3].label).toBe('Müşteri Adı');
  });

  it('tablo yapılandırması doğru ayarlanmalı', () => {
    const expectedConfig = {
      showCheckbox: true,
      showActions: true,
      showActionsHeader: true,
      showActionsRow: true,
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
    const expectedActions = {
      title: 'Kullanılabilir Veri Yok',
      subtitle: 'Görüntülenecek herhangi bir kayıt bulunamadı',
      approvePermission: '',
      hasEditOrDeletePermission: true,
      label: 'Rol Ekle',
      icon: 'contact_emergency',
      color: 'green',
      updatePermission: 'POST.Reading.AssignRoleToUser',
      labelOne: 'Şifre değiştir',
      iconOne: 'key',
      colorOne: 'rgb(240, 23, 59)',
      updateOnePermission: 'GET.Reading.EnvanterdekiTümEşyalarıGör',
      labelTwo: 'Personel değiştir',
      iconTwo: 'reply_all',
      colorTwo: 'rgb(30, 240, 23)',
      updateTwoPermission: 'PUT.Updating.PersonelinKullanıcıIDsiniGüncelle',
      deleteController: 'Users',
      deleteAction: 'DeleteUser'
    };

    expect(component.tableActions.label).toBe(expectedActions.label);
    expect(component.tableActions.icon).toBe(expectedActions.icon);
    expect(component.tableActions.color).toBe(expectedActions.color);
    expect(component.tableActions.updatePermission).toBe(expectedActions.updatePermission);
    expect(component.tableActions.deleteController).toBe(expectedActions.deleteController);
    expect(component.tableActions.deleteAction).toBe(expectedActions.deleteAction);
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
    userdefinitionsservice.read.and.returnValue(
      Promise.resolve(mockResponse as unknown as ListUserDefAuthRes)
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
    spyOn(component, 'getList');
    const sortEvent = { column: 'nameSurname', direction: 'asc' as const };
    component.onSortChange(sortEvent);
    expect(component.getList).toHaveBeenCalled();
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

  it('rol ekleme dialogu açılmalı', () => {
    const mockResponse = {
      id: sessionStorage.getItem('userId')
    } as ResultUser;

    permissionsService.ifPermit.and.returnValue(true);
    component.addRol(mockResponse);

    const expectedModel = new RequestRolAddUser();
    expectedModel.userId = mockResponse.id;

    expect(dialogService.openDialog).toHaveBeenCalledWith({
      componentType: UserAddRolComponent,
      options: {
        width: '730px'
      },
      disableClose: true,
      data: expectedModel,
      afterClosed: jasmine.any(Function)
    });
  });

  it('şifre değiştirme dialogu açılmalı', () => {
    const mockResponse = {
      id: sessionStorage.getItem('userId')
    } as ResultUser;

    permissionsService.ifPermit.and.returnValue(true);
    component.updateChangePassword(mockResponse);

    expect(dialogService.openDialog).toHaveBeenCalledWith({
      componentType: ChangePasswordDialogComponent,
      options: {
        width: '730px'
      },
      disableClose: true,
      data: jasmine.objectContaining({
        userId: mockResponse.id
      }),
      afterClosed: jasmine.any(Function)
    });
  });

  it('Personel değiştir dialogu açılmalı', () => {
    const mockResponse = {
      id: sessionStorage.getItem('userId')
    } as ResultUser;

    permissionsService.ifPermit.and.returnValue(true);
    component.updateUserEmployee(mockResponse);

    const expectedModel = new RequestUserAddEmployee();
    expectedModel.userId = mockResponse.id;

    expect(dialogService.openDialog).toHaveBeenCalledWith({
      componentType: UserAddEmployeeCreateDialogComponent,
      options: {
        width: '730px'
      },
      disableClose: true,
      data: expectedModel,
      afterClosed: jasmine.any(Function)
    });
  });
});























