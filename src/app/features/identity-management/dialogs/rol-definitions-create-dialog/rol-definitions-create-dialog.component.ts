import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter, ThemePalette } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AlertService, BaseDialog, ListRolePermissions, SearchbarService } from '@coder-pioneers/shared';
import { RequestRolDefinitions } from '@features/identity-management/contracts/requests/request-rol-definitions';
import { Menu, UpdateRoleEndpoint } from '@features/identity-management/contracts/requests/update-role-endpoint';
import { ListAuthorizeDefinitionEndpointAuth } from '@features/identity-management/contracts/responses/list-authorize-definition-endpoint-auth';
import { ListAuthorizeDefinitionEndpoints } from '@features/identity-management/contracts/responses/list-authorize-definition-endpoints';
import { DataRolItem } from '@features/identity-management/contracts/responses/list-rol-definitions';
import { ApplicationServiceApi, ApplicationServiceApiPrimary, ApplicationServiceAuthApi } from '@features/identity-management/services/application.service';
import { AuthorizationEndpointsApiPrimaryService, AuthorizationEndpointsApiService, AuthorizationEndpointsAuthApiService } from '@features/identity-management/services/authorization-endpoints.service';
import { RolDefinitionsService } from '@features/identity-management/services/rol-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';

export interface Task {
  id?: number;
  name: string;
  completed: boolean;
  color: ThemePalette;
  code?: string;
  subtasks?: Task[];
}

export interface AuthTask {
  id?: number;
  name: string;
  completed: boolean;
  color: ThemePalette;
  code?: string;
  subtaskAuth?: AuthTask[];
}

interface Menus {
  menu: string;
  codes: string[];
}

@Component({
  selector: 'app-rol-definitions-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  templateUrl: './rol-definitions-create-dialog.component.html',
  styleUrl: './rol-definitions-create-dialog.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class RolDefinitionsCreateDialogComponent
  extends BaseDialog<RolDefinitionsCreateDialogComponent>
  implements OnInit {
  frm?: FormGroup;
  endpoints?: ListAuthorizeDefinitionEndpoints[];
  hasEndpoints?: ListRolePermissions;
  tasks?: Task[];
  roleName: string = '';
  allTasksCompleted: boolean | undefined;

  endpointsPrimary?: ListAuthorizeDefinitionEndpoints[];
  hasEndpointsPrimary?: ListRolePermissions;
  tasksPrimary?: Task[];

  endpointAuth?: ListAuthorizeDefinitionEndpointAuth[];
  authTask?: AuthTask[];


  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();


  private tasksAuthSubject = new BehaviorSubject<AuthTask[]>([]);
  tasksAuth$ = this.tasksAuthSubject.asObservable();
  constructor(
    dialogRef: MatDialogRef<RolDefinitionsCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DataRolItem,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    // Auth
    private applicationServiceAuth: ApplicationServiceAuthApi,
    private authorizationEndpointsAuthApiService: AuthorizationEndpointsAuthApiService,
    private roleDefinitionsService: RolDefinitionsService,
    // Primary
    private applicationServicePrimary: ApplicationServiceApiPrimary,
    private authorizationEndpointsApiPrimaryService: AuthorizationEndpointsApiPrimaryService,
    // Api
    private applicationService: ApplicationServiceApi,
    private authorizationEndpointsApiService: AuthorizationEndpointsApiService,

    private searchbarService:SearchbarService,
    private spinner: NgxSpinnerService,
    ) {
    super(dialogRef);
    this.roleName = data?.name ?? '';

  }

  //#region ngOnInit
  // Sayfa yüklendiğinde ilk çalışacak işlemler
  //#endregion
  ngOnInit() {
    this.allTasksCompleted = this.tasks?.every(task => task.completed);
    this.allTasksCompleted = this.tasksPrimary?.every(task => task.completed);
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    this.getEndpoints();
    this.getEndpointsPrimary();
    this.getEndpointAuth();
  }

  allComplete: boolean = false;
  step = 0;


  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  //#region Listeleme
  // getEndpoints api task listesini getiren fonksiyon
  async getEndpoints(){
    const apiResult = await this.applicationService.read();
    this.endpoints = Array.isArray(apiResult) ? apiResult : apiResult ? [apiResult] : [];
    if (this.data && this.data.id)
      this.hasEndpoints = await this.roleDefinitionsService.readFilter({roleId:this.data?.id});
    else
      this.hasEndpoints = new ListRolePermissions();
      let _taskId = 0;

    if (this.endpoints){
      this.tasks = this.endpoints.map(endpoint => ({
        number: _taskId++,
        name: endpoint.name,
        completed: false,
        color: 'primary',
        subtasks: endpoint.actions.map(action => ({
          name: action.definition,
          completed: this.hasEndpoints?.rolePermissions?.includes(action?.code) ? true : false,
          color: 'primary',
          code: action.code,
        })),
      }));
    }
  }

    //#region Listeleme Primary
  // getEndpoints api task listesini getiren fonksiyon primary
  async getEndpointsPrimary(){
    const apiResult = await this.applicationServicePrimary.read();
    this.endpointsPrimary = Array.isArray(apiResult) ? apiResult : apiResult ? [apiResult] : [];
    if (this.data && this.data.id)
      this.hasEndpointsPrimary =
    await this.roleDefinitionsService.readFilter({roleId:this.data?.id});
    else
      this.hasEndpointsPrimary = new ListRolePermissions();
      let _taskId = 0;

    if (this.endpointsPrimary){
      this.tasksPrimary = this.endpointsPrimary.map(endpoint => ({
        number: _taskId++,
        name: endpoint.name,
        completed: false,
        color: 'primary',
        subtasks: endpoint.actions.map(action => ({
          name: action.definition,
          completed:
          this.hasEndpointsPrimary?.rolePermissions?.includes(action?.code) ? true : false,
          color: 'primary',
          code: action.code,
        })),
      }));
    }
  }

  // getEndpoints AuthApi task ROL listesini getiren fonksiyon
  async getEndpointAuth(){
    const authResult = await this.applicationServiceAuth.read();
    this.endpointAuth = Array.isArray(authResult) ? authResult : authResult ? [authResult] : [];
    if (this.data && this.data.id)
      this.hasEndpoints = await this.roleDefinitionsService.readFilter({id:this.data?.id});
    else
      this.hasEndpoints = new ListRolePermissions();
      let _taskId = 0;

    if (this.endpointAuth){
      this.authTask = this.endpointAuth.map(endpoint => ({
        number: _taskId++,
        name: endpoint.name,
        completed: false,
        color: 'primary',
        subtaskAuth: endpoint.actions.map(actionAuth => ({
          name: actionAuth.definition,
          completed: this.hasEndpoints?.rolePermissions?.includes(actionAuth?.code) ? true : false,
          color: 'primary',
          code: actionAuth.code,
        })),
      }));
    }
  }
  //#endregion


  //#region create
  // save api task Request  Yapar
  async save() {
    try {
      this.spinner.show('s2');

      if (!this.data) {
        const customerId = sessionStorage.getItem('customerId');
        const institutionId = sessionStorage.getItem('institutionId');
        const req: RequestRolDefinitions = new RequestRolDefinitions();
        req.name = this.roleName;
        req.customerId = customerId!;
        req.institutionId = institutionId!;

        const createResult = this.roleDefinitionsService.create(req);
        if (!createResult) {
          throw new Error('Role creation service returned undefined');
        }
        await firstValueFrom(createResult);
      }

      // Tüm yetkileri tek seferde kaydet
      await this.saveAllEndpoints();

      this.spinner.hide('s2');
      this.dialogRef.close(true);
    } catch (error) {
      this.spinner.hide('s2');
      this.alertService.error('İşlem sırasında bir hata oluştu: ' + (error as Error).message);
      console.error('Save operation failed:', error);
    }
  }

  /**
   * Tüm endpoint yetkilerini tek seferde kaydeder
   * Üç farklı servisi paralel olarak çağırır
   */
  private async saveAllEndpoints(): Promise<void> {
    const customerId = sessionStorage.getItem('customerId');
    const institutionId = sessionStorage.getItem('institutionId');

    // Tüm endpoint verilerini hazırla
    const endpointRequests: Array<{
      tasks: Task[] | AuthTask[],
      service: any,
      method: 'create' | 'update',
      serviceName: string
    }> = [
      {
        tasks: this.tasks!,
        service: this.authorizationEndpointsApiService,
        method: 'create',
        serviceName: 'API Service'
      },
      {
        tasks: this.tasksPrimary!,
        service: this.authorizationEndpointsApiPrimaryService,
        method: 'create',
        serviceName: 'API Primary Service'
      },
      {
        tasks: this.authTask!,
        service: this.authorizationEndpointsAuthApiService,
        method: 'update',
        serviceName: 'Auth API Service'
      }
    ];

    // Paralel olarak tüm istekleri gönder
    const promises = endpointRequests.map(async (endpointRequest) => {
      try {
        const request = this.prepareEndpointRequest(endpointRequest.tasks, customerId!, institutionId!);

        if (endpointRequest.method === 'create') {
          const createResponse = endpointRequest.service.create(request);
          if (!createResponse) {
            throw new Error(`${endpointRequest.serviceName} creation service returned undefined`);
          }
          return await firstValueFrom(createResponse);
        } else {
          const updateResponse = endpointRequest.service.update(request);
          if (!updateResponse) {
            throw new Error(`${endpointRequest.serviceName} update service returned undefined`);
          }
          return await firstValueFrom(updateResponse);
        }
      } catch (error) {
        console.error(`${endpointRequest.serviceName} işlemi başarısız:`, error);
        throw error;
      }
    });

    // Tüm istekleri bekle
    await Promise.all(promises);
  }

  /**
   * Endpoint isteği hazırlar
   */
  private prepareEndpointRequest(tasks: Task[] | AuthTask[], customerId: string, institutionId: string): UpdateRoleEndpoint {
    const processedCodes = new Set<string>();
    const requestData = tasks?.reduce((acc, task) => {
      const subtasks = (task as Task).subtasks || (task as AuthTask).subtaskAuth;
      subtasks?.forEach(subtask => {
        if (subtask.completed && subtask.code && !processedCodes.has(subtask.code)) {
          if (!acc[task.name]) {
            acc[task.name] = {
              menu: task.name,
              codes: []
            };
          }
          acc[task.name].codes.push(subtask.code);
          processedCodes.add(subtask.code);
        }
      });
      return acc;
    }, {} as { [menu: string]: Menu });

    const menus = Object.values(requestData);

    return {
      role: this.roleName,
      institutionId,
      customerId,
      menus
    };
  }
  //#endregion

  //#region Tümünü Seç
  // tümünü Seç
  setAll(completed: boolean) {
    this.allComplete = completed;

    if (this.tasks) {
      this.tasks.forEach(task => {
        if (task.subtasks) {
          task.subtasks.forEach(subtask => {
            subtask.completed = completed;
          });
        }
      });
    }

    if (this.tasksPrimary) {
      this.tasksPrimary.forEach(task => {
        if (task.subtasks) {
          task.subtasks.forEach(subtask => {
            subtask.completed = completed;
          });
        }
      });
    }

    if (this.authTask) {
      this.authTask.forEach(task => {
        if (task.subtaskAuth) {
          task.subtaskAuth.forEach(subtask => {
            subtask.completed = completed;
          });
        }
      });
    }
  }

  someComplete(): boolean {
    if (!this.tasks || !this.authTask || !this.tasksPrimary) return false;

    // Auth Tasks
    const authTasksState = this.authTask.map(task =>
      task.subtaskAuth?.some(t => t.completed) &&
      !task.subtaskAuth?.every(t => t.completed)
    );

    // API primary Tasks
    const apiTasksPrimaryState = this.tasksPrimary.map(task =>
      task.subtasks?.some(t => t.completed) &&
      !task.subtasks?.every(t => t.completed)
    );

    // API Tasks
    const apiTasksState = this.tasks.map(task =>
      task.subtasks?.some(t => t.completed) &&
      !task.subtasks?.every(t => t.completed)
    );

    return apiTasksState.some(state => state) ||
           apiTasksPrimaryState.some(state => state) ||
           authTasksState.some(state => state);
  }
  //#endregion

  updateAllComplete() {
    if (!this.tasks || !this.authTask || !this.tasksPrimary) {
      this.allComplete = false;
      return;
    }

    const authAllComplete = this.authTask.every(task =>
      task.subtaskAuth?.every(subtask => subtask.completed)
    );

    const apiPrimaryAllComplete = this.tasksPrimary.every(task =>
      task.subtasks?.every(subtask => subtask.completed)
    );

    const apiAllComplete = this.tasks.every(task =>
      task.subtasks?.every(subtask => subtask.completed)
    );

    this.allComplete = apiAllComplete && authAllComplete && apiPrimaryAllComplete;
  }




  //#region Formatlama
  // Api formatlama tüm Seçili
  //#region Api Formatlama
  getApiSelectedCount(): number {
    if (!this.tasks) return 0;
    return this.tasks.reduce((count, task) => {
      if (!task.subtasks) return count;
      return count + task.subtasks.filter(subtask => subtask.completed).length;
    }, 0);
  }

  getApiPrimarySelectedCount(): number {
    if (!this.tasksPrimary) return 0;
    return this.tasksPrimary.reduce((count, task) => {
      if (!task.subtasks) return count;
      return count + task.subtasks.filter(subtask => subtask.completed).length;
    }, 0);
  }

  // Api formatlama karta seçili ve tümü  seç  kart
  getTaskSelectedCount(task: Task): number {
    if (!task.subtasks) return 0;
    return task.subtasks.filter(subtask => subtask.completed).length;
  }
  getTaskUnselectedCount(task: Task): number {
    if (!task.subtasks) return 0;
    return task.subtasks.filter(subtask => !subtask.completed).length;
  }

  getTotalSelectedCount(): Observable<number> {
    return this.tasks$.pipe(
      map(tasks => tasks.reduce((total, task) =>
        total + this.getTaskSelectedCount(task), 0
      ))
    );
  }
  // Task Selection Methods
  isAllTaskSelected(task: Task): boolean {
    return task.subtasks?.every(subtask => subtask.completed) ?? false;
  }

  isSomeTaskSelected(task: Task): boolean {
    const selectedCount = this.getTaskSelectedCount(task);
    return selectedCount > 0 && selectedCount < (task.subtasks?.length ?? 0);
  }

  toggleAllTaskItems(task: Task, checked: boolean): void {
    if (task.subtasks) {
      task.subtasks.forEach(subtask => {
        subtask.completed = checked;
      });
    }
  }
  //#endregion Api Formatlama


  //#region AuthApi formatlama tüm Seçili
  // Api formatlama karta seçili ve tümü  seç  kart
  getAuthSelectedCount(task: AuthTask): number {
    if (!this.authTask) return 0;
    return this.authTask.reduce((count, task) => {
      if (!task.subtaskAuth) return count;
      return count + task.subtaskAuth.filter(subtask => subtask.completed).length;
    }, 0);
  }

  // AuthApi formatlama karta seçili
  getAuthTaskSelectedCount(taskAuth: AuthTask): number {
    if (!taskAuth.subtaskAuth) return 0;
    return taskAuth.subtaskAuth.filter(task => task.completed).length;
  }

  getAuthTaskUnselectedCount(taskAuth: AuthTask): number {
    if (!taskAuth.subtaskAuth) return 0;
    return taskAuth.subtaskAuth.filter(task => !task.completed).length;
  }


  getAuthTotalSelectedCount(): Observable<number> {
    return this.tasksAuth$.pipe(
      map(tasksAuth => tasksAuth.reduce((total, task) =>
        total + this.getAuthSelectedCount(task), 0
      ))
    );
  }
  isAllAuthTaskSelected(task: AuthTask): boolean {
    return task.subtaskAuth?.every(subtaskAuth => subtaskAuth.completed) ?? false;
  }

  isSomeAuthTaskSelected(task: AuthTask): boolean {
    const selectedCount = this.getAuthSelectedCount(task);
    return selectedCount > 0 && selectedCount < (task.subtaskAuth?.length ?? 0);
  }

  toggleAllAuthTaskItems(task: AuthTask, checked: boolean): void {
    if (task.subtaskAuth) {
      task.subtaskAuth.forEach(subtaskAuth => {
        subtaskAuth.completed = checked;
      });
    }
  }
  getAuthApiSelectedCount(): number {
    if (!this.authTask) return 0;
    return this.authTask.reduce((count, task) => {
      if (!task.subtaskAuth) return count;
      return count + task.subtaskAuth.filter(subtaskAuth => subtaskAuth.completed).length;
    }, 0);
  }

  //#endregion AuthApi formatlama



  // Navigation Methods
  setStep(index: number): void {
    this.step = index;
  }
  //#endregion
}

export enum addState {
  Close
}




















