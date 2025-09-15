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
import { ApplicationServiceApi, ApplicationServiceAuthApi } from '@features/identity-management/services/application.service';
import { AuthorizationEndpointsApiService, AuthorizationEndpointsAuthApiService } from '@features/identity-management/services/authorization-endpoints.service';
import { RolDefinitionsService } from '@features/identity-management/services/rol-definitions.service';
import { BaseDialogComponent } from '@shared/components/base/dialog/base-dialog/base-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, map, Observable } from 'rxjs';

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
@Component({
  selector: 'app-rol-definitions-new',
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
  templateUrl: './rol-definitions-new.component.html',
  styleUrl: './rol-definitions-new.component.scss',
  providers: [provideNativeDateAdapter()],

})
export class RolDefinitionsNewComponent
  extends BaseDialog<RolDefinitionsNewComponent>
  implements OnInit {
  frm?: FormGroup;
  endpoints?: ListAuthorizeDefinitionEndpoints[];
  hasEndpoints?: ListRolePermissions;
  hasEndpointAuth?: ListRolePermissions;
  tasks?: Task[];
  roleName: string = '';
  allTasksCompleted: boolean | undefined;
  endpointAuth?: ListAuthorizeDefinitionEndpointAuth[];
  authTask?: AuthTask[];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  private tasksAuthSubject = new BehaviorSubject<AuthTask[]>([]);
  tasksAuth$ = this.tasksAuthSubject.asObservable();
  constructor(
    dialogRef: MatDialogRef<RolDefinitionsNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DataRolItem,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private applicationService: ApplicationServiceApi,
    private applicationServiceAuth: ApplicationServiceAuthApi,
    private roleDefinitionsService: RolDefinitionsService,
    private authorizationEndpointsApiService: AuthorizationEndpointsApiService,
    private authorizationEndpointsAuthApiService: AuthorizationEndpointsAuthApiService,
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    this.roleName = this.data?.name!;
    this.getEndpoints();
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
      this.hasEndpoints = await this.roleDefinitionsService.readFilter({id:this.data?.id});
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
  // getEndpoints AuthApi task ROL listesini getiren fonksiyon
  async getEndpointAuth(){
    const authResult = await this.applicationServiceAuth.read();
    this.endpointAuth = Array.isArray(authResult) ? authResult : authResult ? [authResult] : [];
    if (this.data && this.data.id)
      this.hasEndpointAuth = await this.roleDefinitionsService.readFilter({id:this.data?.id});
    else
      this.hasEndpointAuth = new ListRolePermissions();
      let _taskId = 0;

    if (this.endpointAuth){
      this.authTask = this.endpointAuth.map(endpoint => ({
        number: _taskId++,
        name: endpoint.name,
        completed: false,
        color: 'primary',
        subtaskAuth: endpoint.actions.map(actionAuth => ({
          name: actionAuth.definition,
          completed:
          this.hasEndpointAuth?.rolePermissions?.includes(actionAuth?.code) ? true : false,
          color: 'primary',
          code: actionAuth.code,
        })),
      }));
    }
  }
  //#endregion


  async save() {
    this.spinner.show('s2');
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    if (!this.data || !this.data.id) {
        const req = new RequestRolDefinitions();
        req.name = this.roleName;
        this.roleDefinitionsService.create(req);
     }
        await delay(5000);
        await this.saveEndpoints(
          this.tasks!,
          (req: UpdateRoleEndpoint) =>
            this.authorizationEndpointsApiService.create(req).toPromise()
          );
        await delay(3000);
        await this.saveEndpoints(
          this.authTask!,
          (req: UpdateRoleEndpoint) =>
            this.authorizationEndpointsAuthApiService.update(req).toPromise()
          );

    this.spinner.hide('s2');
    this.dialogRef.close(true);
}

private async saveEndpoints(
  tasks: Task[] | AuthTask[],
  assignFn: (req: UpdateRoleEndpoint) => Promise<any>
) {
    const processedCodes = new Set<string>();
    const customerId = sessionStorage.getItem('customerId');
    const institutionId = sessionStorage.getItem('institutionId');
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

    const request: UpdateRoleEndpoint = {
        role: this.roleName,
        institutionId: institutionId!,
        customerId: customerId!,
        menus
    };

    await assignFn(request);
}

  //#region Formatlama
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
    if (!this.tasks || !this.authTask) return false;

    // API Tasks
    const apiTasksState = this.tasks.map(task =>
      task.subtasks?.some(t => t.completed) &&
      !task.subtasks?.every(t => t.completed)
    );

    // Auth Tasks
    const authTasksState = this.authTask.map(task =>
      task.subtaskAuth?.some(t => t.completed) &&
      !task.subtaskAuth?.every(t => t.completed)
    );

    return apiTasksState.some(state => state) ||
           authTasksState.some(state => state);
  }
  //#endregion

  updateAllComplete() {
    if (!this.tasks || !this.authTask) {
      this.allComplete = false;
      return;
    }

    const apiAllComplete = this.tasks.every(task =>
      task.subtasks?.every(subtask => subtask.completed)
    );

    const authAllComplete = this.authTask.every(task =>
      task.subtaskAuth?.every(subtask => subtask.completed)
    );

    this.allComplete = apiAllComplete && authAllComplete;
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























