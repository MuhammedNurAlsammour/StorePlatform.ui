import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter, ThemePalette } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  AlertService,
  BaseDialog,
  ListRolePermissions,
} from '@coder-pioneers/shared';
import { ListAuthorizeDefinitionEndpointAuth } from '@features/identity-management/contracts/responses/list-authorize-definition-endpoint-auth';
import { ListAuthorizeDefinitionEndpoints } from '@features/identity-management/contracts/responses/list-authorize-definition-endpoints';
import { DataRolItem } from '@features/identity-management/contracts/responses/list-rol-definitions';
import {
  ApplicationServiceApi,
  ApplicationServiceApiPrimary,
  ApplicationServiceAuthApi,
} from '@features/identity-management/services/application.service';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface Task {
  id?: number;
  name: string;
  completed: boolean;
  color: ThemePalette;
  code?: string;
  httpType?: string;
  subtasks?: Task[];
}

export interface AuthTask {
  id?: number;
  name: string;
  completed: boolean;
  color: ThemePalette;
  code?: string;
  httpType?: string;
  subtaskAuth?: AuthTask[];
}

interface Menus {
  menu: string;
  codes: string[];
}

@Component({
  selector: 'app-authorize-definition-endpoints-dialog',
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
    MatChipsModule,
    MatTabsModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatCheckboxModule,
  ],
  templateUrl: './authorize-definition-endpoints-dialog.component.html',
  styleUrl: './authorize-definition-endpoints-dialog.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class AuthorizeDefinitionEndpointsDialogComponent
  extends BaseDialog<AuthorizeDefinitionEndpointsDialogComponent>
  implements OnInit
{
  endpoints?: ListAuthorizeDefinitionEndpoints[];
  hasEndpoints?: ListRolePermissions;
  tasks?: Task[];
  allTasksCompleted: boolean | undefined;

  endpointsPrimary?: ListAuthorizeDefinitionEndpoints[];
  hasEndpointsPrimary?: ListRolePermissions;
  tasksPrimary?: Task[];

  endpointAuth?: ListAuthorizeDefinitionEndpointAuth[];
  authTask?: AuthTask[];

  // Yetki kopyalama özellikleri
  isLoadingApi: boolean = false;
  showJsonEditor: boolean = false;
  jsonData: string = '';

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private tasksAuthSubject = new BehaviorSubject<AuthTask[]>([]);
  tasksAuth$ = this.tasksAuthSubject.asObservable();
  constructor(
    dialogRef: MatDialogRef<AuthorizeDefinitionEndpointsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataRolItem,
    private alertService: AlertService,
    // Auth
    private applicationServiceAuth: ApplicationServiceAuthApi,
    // Primary
    private applicationServicePrimary: ApplicationServiceApiPrimary,
    // Api
    private applicationService: ApplicationServiceApi
  ) {
    super(dialogRef);
  }

  //#region ngOnInit
  // Sayfa yüklendiğinde ilk çalışacak işlemler
  //#endregion
  ngOnInit() {
    this.allTasksCompleted = this.tasks?.every((task) => task.completed);
    this.allTasksCompleted = this.tasksPrimary?.every((task) => task.completed);
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    this.getEndpoints();
    this.getEndpointsPrimary();
    this.getEndpointAuth();

    // Keyboard shortcuts için event listener ekle
    this.setupKeyboardShortcuts();
  }

  /**
   * Klavye kısayollarını ayarlar
   */
  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (event) => {
      // Ctrl+Shift+C: API'den kopyala
      if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        this.copyFromApi();
      }

      // Ctrl+Shift+V: Yapıştır
      if (event.ctrlKey && event.shiftKey && event.key === 'V') {
        event.preventDefault();
        this.pasteFromClipboard();
      }

      // Ctrl+Shift+X: Mevcut verileri kopyala
      if (event.ctrlKey && event.shiftKey && event.key === 'X') {
        event.preventDefault();
        this.copyToClipboard();
      }
    });
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
  async getEndpoints() {
    const apiResult = await this.applicationService.read();
    this.endpoints = Array.isArray(apiResult)
      ? apiResult
      : apiResult
      ? [apiResult]
      : [];
    this.hasEndpoints = new ListRolePermissions();
    let _taskId = 0;

    if (this.endpoints) {
      this.tasks = this.endpoints.map((endpoint) => ({
        number: _taskId++,
        name: endpoint.name,
        completed: false,
        color: 'primary',
        subtasks: endpoint.actions.map((action) => ({
          name: action.definition,
          completed: this.hasEndpoints?.rolePermissions?.includes(action?.code)
            ? true
            : false,
          color: 'primary',
          code: action.code,
          httpType: action.httpType,
        })),
      }));
    }
  }

  //#region Listeleme Primary
  // getEndpoints api task listesini getiren fonksiyon primary
  async getEndpointsPrimary() {
    const apiResult = await this.applicationServicePrimary.read();
    this.endpointsPrimary = Array.isArray(apiResult)
      ? apiResult
      : apiResult
      ? [apiResult]
      : [];
    this.hasEndpointsPrimary = new ListRolePermissions();
    let _taskId = 0;

    if (this.endpointsPrimary) {
      this.tasksPrimary = this.endpointsPrimary.map((endpoint) => ({
        number: _taskId++,
        name: endpoint.name,
        completed: false,
        color: 'primary',
        subtasks: endpoint.actions.map((action) => ({
          name: action.definition,
          completed: this.hasEndpointsPrimary?.rolePermissions?.includes(
            action?.code
          )
            ? true
            : false,
          color: 'primary',
          code: action.code,
          httpType: action.httpType,
        })),
      }));
    }
  }

  // getEndpoints AuthApi task ROL listesini getiren fonksiyon
  async getEndpointAuth() {
    const authResult = await this.applicationServiceAuth.read();
    this.endpointAuth = Array.isArray(authResult)
      ? authResult
      : authResult
      ? [authResult]
      : [];
    this.hasEndpoints = new ListRolePermissions();
    let _taskId = 0;

    if (this.endpointAuth) {
      this.authTask = this.endpointAuth.map((endpoint) => ({
        number: _taskId++,
        name: endpoint.name,
        completed: false,
        color: 'primary',
        subtaskAuth: endpoint.actions.map((actionAuth) => ({
          name: actionAuth.definition,
          completed: this.hasEndpoints?.rolePermissions?.includes(
            actionAuth?.code
          )
            ? true
            : false,
          color: 'primary',
          code: actionAuth.code,
          httpType: actionAuth.httpType,
        })),
      }));
    }
  }
  //#endregion

  //#region Tümünü Seç
  // tümünü Seç
  setAll(completed: boolean) {
    this.allComplete = completed;

    if (this.tasks) {
      this.tasks.forEach((task) => {
        if (task.subtasks) {
          task.subtasks.forEach((subtask) => {
            subtask.completed = completed;
          });
        }
      });
    }

    if (this.tasksPrimary) {
      this.tasksPrimary.forEach((task) => {
        if (task.subtasks) {
          task.subtasks.forEach((subtask) => {
            subtask.completed = completed;
          });
        }
      });
    }

    if (this.authTask) {
      this.authTask.forEach((task) => {
        if (task.subtaskAuth) {
          task.subtaskAuth.forEach((subtask) => {
            subtask.completed = completed;
          });
        }
      });
    }
  }

  someComplete(): boolean {
    if (!this.tasks || !this.authTask || !this.tasksPrimary) return false;

    // Auth Tasks
    const authTasksState = this.authTask.map(
      (task) =>
        task.subtaskAuth?.some((t) => t.completed) &&
        !task.subtaskAuth?.every((t) => t.completed)
    );

    // API primary Tasks
    const apiTasksPrimaryState = this.tasksPrimary.map(
      (task) =>
        task.subtasks?.some((t) => t.completed) &&
        !task.subtasks?.every((t) => t.completed)
    );

    // API Tasks
    const apiTasksState = this.tasks.map(
      (task) =>
        task.subtasks?.some((t) => t.completed) &&
        !task.subtasks?.every((t) => t.completed)
    );

    return (
      apiTasksState.some((state) => state) ||
      apiTasksPrimaryState.some((state) => state) ||
      authTasksState.some((state) => state)
    );
  }
  //#endregion

  updateAllComplete() {
    if (!this.tasks || !this.authTask || !this.tasksPrimary) {
      this.allComplete = false;
      return;
    }

    const authAllComplete = this.authTask.every((task) =>
      task.subtaskAuth?.every((subtask) => subtask.completed)
    );

    const apiPrimaryAllComplete = this.tasksPrimary.every((task) =>
      task.subtasks?.every((subtask) => subtask.completed)
    );

    const apiAllComplete = this.tasks.every((task) =>
      task.subtasks?.every((subtask) => subtask.completed)
    );

    this.allComplete =
      apiAllComplete && authAllComplete && apiPrimaryAllComplete;
  }

  //#region Formatlama
  // Api formatlama tüm Seçili
  //#region Api Formatlama
  getApiSelectedCount(): number {
    if (!this.tasks) return 0;
    return this.tasks.reduce((count, task) => {
      if (!task.subtasks) return count;
      return (
        count + task.subtasks.filter((subtask) => subtask.completed).length
      );
    }, 0);
  }

  getApiPrimarySelectedCount(): number {
    if (!this.tasksPrimary) return 0;
    return this.tasksPrimary.reduce((count, task) => {
      if (!task.subtasks) return count;
      return (
        count + task.subtasks.filter((subtask) => subtask.completed).length
      );
    }, 0);
  }

  // Api formatlama karta seçili ve tümü  seç  kart
  getTaskSelectedCount(task: Task): number {
    if (!task.subtasks) return 0;
    return task.subtasks.filter((subtask) => subtask.completed).length;
  }
  getTaskUnselectedCount(task: Task): number {
    if (!task.subtasks) return 0;
    return task.subtasks.filter((subtask) => !subtask.completed).length;
  }

  getTotalSelectedCount(): Observable<number> {
    return this.tasks$.pipe(
      map((tasks) =>
        tasks.reduce(
          (total, task) => total + this.getTaskSelectedCount(task),
          0
        )
      )
    );
  }
  // Task Selection Methods
  isAllTaskSelected(task: Task): boolean {
    return task.subtasks?.every((subtask) => subtask.completed) ?? false;
  }

  isSomeTaskSelected(task: Task): boolean {
    const selectedCount = this.getTaskSelectedCount(task);
    return selectedCount > 0 && selectedCount < (task.subtasks?.length ?? 0);
  }

  toggleAllTaskItems(task: Task, checked: boolean): void {
    if (task.subtasks) {
      task.subtasks.forEach((subtask) => {
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
      return (
        count + task.subtaskAuth.filter((subtask) => subtask.completed).length
      );
    }, 0);
  }

  // AuthApi formatlama karta seçili
  getAuthTaskSelectedCount(taskAuth: AuthTask): number {
    if (!taskAuth.subtaskAuth) return 0;
    return taskAuth.subtaskAuth.filter((task) => task.completed).length;
  }

  getAuthTaskUnselectedCount(taskAuth: AuthTask): number {
    if (!taskAuth.subtaskAuth) return 0;
    return taskAuth.subtaskAuth.filter((task) => !task.completed).length;
  }

  getAuthTotalSelectedCount(): Observable<number> {
    return this.tasksAuth$.pipe(
      map((tasksAuth) =>
        tasksAuth.reduce(
          (total, task) => total + this.getAuthSelectedCount(task),
          0
        )
      )
    );
  }
  isAllAuthTaskSelected(task: AuthTask): boolean {
    return (
      task.subtaskAuth?.every((subtaskAuth) => subtaskAuth.completed) ?? false
    );
  }

  isSomeAuthTaskSelected(task: AuthTask): boolean {
    const selectedCount = this.getAuthSelectedCount(task);
    return selectedCount > 0 && selectedCount < (task.subtaskAuth?.length ?? 0);
  }

  toggleAllAuthTaskItems(task: AuthTask, checked: boolean): void {
    if (task.subtaskAuth) {
      task.subtaskAuth.forEach((subtaskAuth) => {
        subtaskAuth.completed = checked;
      });
    }
  }
  getAuthApiSelectedCount(): number {
    if (!this.authTask) return 0;
    return this.authTask.reduce((count, task) => {
      if (!task.subtaskAuth) return count;
      return (
        count +
        task.subtaskAuth.filter((subtaskAuth) => subtaskAuth.completed).length
      );
    }, 0);
  }

  //#endregion AuthApi formatlama

  // Navigation Methods
  setStep(index: number): void {
    this.step = index;
  }
  //#endregion

  //#region Basit Görüntüleme Fonksiyonları
  /**
   * Gösterilecek task listesini döndürür
   */
  getDisplayTasks(): Task[] {
    return this.tasks || [];
  }

  /**
   * Gösterilecek primary task listesini döndürür
   */
  getDisplayTasksPrimary(): Task[] {
    return this.tasksPrimary || [];
  }

  /**
   * Gösterilecek auth task listesini döndürür
   */
  getDisplayAuthTasks(): AuthTask[] {
    return this.authTask || [];
  }

  /**
   * Toplam seçili öğe sayısını döndürür
   */
  getTotalSelectedCountValue(): number {
    return (
      this.getApiSelectedCount() +
      this.getApiPrimarySelectedCount() +
      this.getAuthApiSelectedCount()
    );
  }

  /**
   * Subtask'tan HTTP metodunu döndürür
   */
  getHttpMethod(subtask: Task | AuthTask): string {
    // Önce httpType özelliğini kontrol et
    if (subtask.httpType) {
      return subtask.httpType.toUpperCase();
    }

    // Eğer httpType yoksa, name'den çıkarmaya çalış
    const upperName = subtask.name.toUpperCase();
    if (upperName.includes('GET')) return 'GET';
    if (upperName.includes('POST')) return 'POST';
    if (upperName.includes('PUT')) return 'PUT';
    if (upperName.includes('DELETE')) return 'DELETE';
    if (upperName.includes('PATCH')) return 'PATCH';
    return 'UNKNOWN';
  }

  /**
   * HTTP metoduna göre CSS sınıfını döndürür
   */
  getHttpMethodClass(subtask: Task | AuthTask): string {
    const method = this.getHttpMethod(subtask);
    switch (method) {
      case 'GET':
        return 'http-method-get';
      case 'POST':
        return 'http-method-post';
      case 'PUT':
        return 'http-method-put';
      case 'DELETE':
        return 'http-method-delete';
      case 'PATCH':
        return 'http-method-patch';
      default:
        return 'http-method-unknown';
    }
  }

  //#endregion

  //#region Yetki Kopyalama Fonksiyonları
  /**
   * API'den veri kopyalar ve otomatik olarak uygular
   */
  async copyFromApi(): Promise<void> {
    try {
      this.isLoadingApi = true;

      // API endpoint'inden veri çek
      const apiUrl =
        'http://72.60.33.111:3000/guideapi/api/ApplicationServices/GetAuthorizeDefinitionEndpoints';

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Veriyi JSON string olarak ayarla
      this.jsonData = JSON.stringify(data, null, 2);

      // Otomatik olarak uygula
      this.applyJsonData();

      this.alertService.success(
        "API'den veri başarıyla kopyalandı ve uygulandı!"
      );
    } catch (error) {
      console.error("API'den veri kopyalama hatası:", error);
      this.alertService.error(
        "API'den veri kopyalanırken hata oluştu: " + (error as Error).message
      );
    } finally {
      this.isLoadingApi = false;
    }
  }

  /**
   * Mevcut verileri clipboard'a kopyalar
   */
  async copyToClipboard(): Promise<void> {
    try {
      const currentData = {
        api: this.tasks,
        apiPrimary: this.tasksPrimary,
        auth: this.authTask,
      };

      const jsonString = JSON.stringify(currentData, null, 2);

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(jsonString);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = jsonString;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      this.alertService.success("Veriler clipboard'a kopyalandı!");
    } catch (error) {
      console.error('Clipboard kopyalama hatası:', error);
      this.alertService.error(
        'Veriler kopyalanırken hata oluştu: ' + (error as Error).message
      );
    }
  }

  /**
   * Clipboard'dan veri yapıştırır
   */
  async pasteFromClipboard(): Promise<void> {
    try {
      let clipboardText = '';

      if (navigator.clipboard && window.isSecureContext) {
        clipboardText = await navigator.clipboard.readText();
      } else {
        // Fallback için prompt kullan
        clipboardText = prompt('JSON verisini buraya yapıştırın:') || '';
      }

      if (clipboardText.trim()) {
        this.jsonData = clipboardText;
        this.showJsonEditor = true;
        this.alertService.info(
          "Veri clipboard'dan alındı. JSON editöründe görüntülendi."
        );
      }
    } catch (error) {
      console.error('Clipboard yapıştırma hatası:', error);
      this.alertService.error(
        "Clipboard'dan veri alınırken hata oluştu: " + (error as Error).message
      );
    }
  }

  /**
   * JSON verisini parse eder ve uygular
   */
  applyJsonData(): void {
    try {
      if (!this.jsonData.trim()) {
        this.alertService.warning('JSON verisi boş olamaz!');
        return;
      }

      const parsedData = JSON.parse(this.jsonData);

      // Veri yapısını kontrol et
      if (!Array.isArray(parsedData)) {
        this.alertService.error('JSON verisi bir array olmalıdır!');
        return;
      }

      // API verilerini güncelle
      this.updateTasksFromJsonData(parsedData);

      this.showJsonEditor = false;
      this.jsonData = '';

      this.alertService.success('JSON verisi başarıyla uygulandı!');
    } catch (error) {
      console.error('JSON uygulama hatası:', error);
      this.alertService.error(
        'JSON verisi uygulanırken hata oluştu: ' + (error as Error).message
      );
    }
  }

  /**
   * JSON verisini formatlar
   */
  formatJson(): void {
    try {
      if (!this.jsonData.trim()) {
        this.alertService.warning('JSON verisi boş olamaz!');
        return;
      }

      const parsed = JSON.parse(this.jsonData);
      this.jsonData = JSON.stringify(parsed, null, 2);
      this.alertService.success('JSON başarıyla formatlandı!');
    } catch (error) {
      this.alertService.error(
        'JSON formatlanırken hata oluştu: ' + (error as Error).message
      );
    }
  }

  /**
   * JSON verisini temizler
   */
  clearJson(): void {
    this.jsonData = '';
    this.alertService.info('JSON verisi temizlendi!');
  }

  /**
   * Tek bir code'u clipboard'a kopyalar
   */
  async copyCodeToClipboard(code: string): Promise<void> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      this.alertService.success(`Code kopyalandı: ${code}`);
    } catch (error) {
      console.error('Code kopyalama hatası:', error);
      this.alertService.error(
        'Code kopyalanırken hata oluştu: ' + (error as Error).message
      );
    }
  }

  /**
   * Task'ın seçili kodlarını JSON formatında kopyalar
   */
  async copyTaskCodesAsJson(task: Task | AuthTask): Promise<void> {
    try {
      const subtasks =
        (task as Task).subtasks || (task as AuthTask).subtaskAuth;
      if (!subtasks || subtasks.length === 0) {
        this.alertService.warning("Bu task'ta kod bulunamadı!");
        return;
      }

      // Seçili kodları filtrele
      const selectedCodes = subtasks
        .filter((subtask) => subtask.completed && subtask.code)
        .map((subtask) => ({
          code: subtask.code,
          name: subtask.name,
          httpType: subtask.httpType,
        }));

      if (selectedCodes.length === 0) {
        this.alertService.warning("Bu task'ta seçili kod bulunamadı!");
        return;
      }

      // JSON formatında hazırla
      const jsonData = {
        taskName: task.name,
        selectedCodes,
        totalSelected: selectedCodes.length,
        totalAvailable: subtasks.length,
      };

      const jsonString = JSON.stringify(jsonData, null, 2);

      // Clipboard'a kopyala
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(jsonString);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = jsonString;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      this.alertService.success(
        `${task.name} task'ından ${selectedCodes.length} kod JSON formatında kopyalandı!`
      );
    } catch (error) {
      console.error('Task kodları kopyalama hatası:', error);
      this.alertService.error(
        'Task kodları kopyalanırken hata oluştu: ' + (error as Error).message
      );
    }
  }

  /**
   * JSON verisinden task'ları günceller
   */
  private updateTasksFromJsonData(jsonData: any[]): void {
    try {
      let _taskId = 0;

      // Mevcut yetkileri al
      const existingPermissions = new ListRolePermissions();

      // API tasks'ları güncelle
      this.tasks = jsonData.map((endpoint) => ({
        id: _taskId++,
        name: endpoint.name,
        completed: false,
        color: 'primary' as ThemePalette,
        subtasks:
          endpoint.actions?.map((action: any) => ({
            name: action.definition,
            completed:
              existingPermissions?.rolePermissions?.includes(action?.code) ||
              false,
            color: 'primary' as ThemePalette,
            code: action.code,
            httpType: action.httpType,
          })) || [],
      }));

      // Primary tasks'ları da aynı şekilde güncelle (eğer varsa)
      if (this.tasksPrimary) {
        this.tasksPrimary = jsonData.map((endpoint) => ({
          id: _taskId++,
          name: endpoint.name,
          completed: false,
          color: 'primary' as ThemePalette,
          subtasks:
            endpoint.actions?.map((action: any) => ({
              name: action.definition,
              completed:
                existingPermissions?.rolePermissions?.includes(action?.code) ||
                false,
              color: 'primary' as ThemePalette,
              code: action.code,
              httpType: action.httpType,
            })) || [],
        }));
      }

      // Auth tasks'ları da güncelle (eğer varsa)
      if (this.authTask) {
        this.authTask = jsonData.map((endpoint) => ({
          id: _taskId++,
          name: endpoint.name,
          completed: false,
          color: 'primary' as ThemePalette,
          subtaskAuth:
            endpoint.actions?.map((action: any) => ({
              name: action.definition,
              completed:
                existingPermissions?.rolePermissions?.includes(action?.code) ||
                false,
              color: 'primary' as ThemePalette,
              code: action.code,
              httpType: action.httpType,
            })) || [],
        }));
      }
    } catch (error) {
      console.error('Task güncelleme hatası:', error);
      throw error;
    }
  }
  //#endregion
}

export enum addState {
  Close,
}



