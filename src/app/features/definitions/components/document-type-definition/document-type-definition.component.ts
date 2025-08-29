import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionsService } from '@coder-pioneers/shared';
import { BaseComponent } from '@coder-pioneers/shared';
import { CoderPioneersComponent } from '@coder-pioneers/ui-layout-components';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-document-type-definition',
  standalone: true,
  imports: [
    ListComponent,
    CreateComponent,
    CoderPioneersComponent,
  ],
  templateUrl: './document-type-definition.component.html',
  styleUrl: './document-type-definition.component.scss'
})
export class DocumentTypeDefinitionComponent  extends  BaseComponent implements OnInit {
  @ViewChild(ListComponent)
  listComponent?: ListComponent;

  searchValue: string = '';

  constructor(
    public permissionsService: PermissionsService,
    private routers: Router,
    spinner: NgxSpinnerService
  )
  {
    super(spinner);
  }

  //#region ngOnInit
  // Sayfa yüklendiğinde ilk çalışacak işlemler
  ngOnInit(): void {
    if (
      !this.permissionsService.ifPermit('GET.Reading.TümÜnvanlarıGörüntüle')
      ){
      this.routers.navigate(['/unauthorized']);
      return;
    }
  }
  //#endregion

  created() {
    this.listComponent?.getList();
  }

  receiveSearchValue(value: string) {
    this.searchValue = value;
  }

  //#region İndirme
  // html,json,excel,csv,txt
  excel() {
    this.listComponent?.exportToExcel();
  }

  exportToCSV() {
    this.listComponent?.exportToCSV();
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


  //#region Filtreleme
  // filtre1,filtre2,filtre3,filtre4
  filtre1() {
  }

  filtre2() {
  }

  filtre3() {
  }

  filtre4() {
  }
  //#endregion
}




















