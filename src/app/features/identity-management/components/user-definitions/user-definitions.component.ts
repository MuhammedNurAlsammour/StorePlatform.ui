import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent, PermissionsService } from '@coder-pioneers/shared';
import { CoderPioneersComponent } from '@coder-pioneers/ui-layout-components';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-user-definitions',
  standalone: true,
  imports: [
    ListComponent,
    CreateComponent,
    CoderPioneersComponent
  ],
  templateUrl: './user-definitions.component.html',
  styleUrl: './user-definitions.component.scss'
})
export class UserDefinitionsComponent extends BaseComponent implements OnInit {
  //#region Değişkenler
  @ViewChild(ListComponent)
  listComponent?: ListComponent;
  searchValue: string = '';
  durumu!: boolean;
  //#endregion

  constructor(
    public permissionsService: PermissionsService,
    private routers: Router,
    spinner: NgxSpinnerService
  ) {
    super(spinner);
  }

  ngOnInit(): void {
    if (!this.permissionsService.ifPermit('GET.Reading.GetAllUsers')) {
      this.routers.navigate(['/unauthorized']);
      return;
    }
  }

  //#region Veri İşleme Metodları
  created() {
    this.listComponent?.getList();
  }

  receiveSearchValue(value: string) {
    this.searchValue = value;
  }

  receiveDurumuValue(value: boolean) {
    this.durumu = value;
  }
  //#endregion

  //#region Dışa Aktarma İşlemleri
  excel() {
    sessionStorage.setItem('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaHVzZXlpbi5pbmFuYyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvdXNlcmRhdGEiOiI3MmM1NGIxYS04ZTFjLTQ1ZWEtOGVkZC1iNWRhMTA5MWUzMjUiLCJuYmYiOjE3NTQzMjE5MDEsImV4cCI6Mjc1NDMyMTkwMCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo3MDA3IiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MjYzIn0.VIZiO3o8HlRFubVLIfHuDGBMFy2rl7Ry4Xztg6JHJh0');
  }

  exportToCSV() {
    sessionStorage.setItem('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibXVoYW1tZWQubnVyIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy91c2VyZGF0YSI6IjcyYzU0YjFhLThlMWMtNDVlYS04ZWRkLWI1ZGExMDkxZTMyNSIsIm5iZiI6MTc1NDMyNDYyOCwiZXhwIjoyNzU0MzI0NjI3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjIwMjkiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjIwMjkifQ.Q8COJQVPoIp40xo-u6i6dyG6tAgzcpRpPSsLdXPIks4');
  }

  exportToTXT() {
    this.listComponent?.exportToTXT();
  }

  exportToJSON() {
    this.listComponent?.exportToJSON();
  }

  exportToHTML() {
    this.listComponent?.exportToHTML();
  }
  //#endregion
}




















