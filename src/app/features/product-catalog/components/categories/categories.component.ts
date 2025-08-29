import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CoderPioneersComponent } from '@coder-pioneers/ui-layout-components';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from '@coder-pioneers/shared';
import { PermissionsService } from '@coder-pioneers/shared';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    ListComponent,
    CreateComponent,
    CoderPioneersComponent,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent extends BaseComponent implements OnInit {

//#region ViewChild Tanımlamaları
@ViewChild(ListComponent)
listComponent?: ListComponent;
//#endregion

//#region Component Properties - Komponent Özellikleri
searchValue: string = '';
showBreadcrumbs: boolean = true;
//#endregion

constructor(
  public permissionsService: PermissionsService,
  private routers: Router,
  spinner: NgxSpinnerService
) 
{
  super(spinner);
}

ngOnInit(): void {
  if (
    !this.permissionsService.ifPermit('GET.Reading.TümKategorileriGetir')
    ){
    this.routers.navigate(['/unauthorized']);
    return;
  }
}

//#region Arama Fonksiyonu
receiveSearchValue(value: string) {
  this.searchValue = value;
}
//#endregion

//#region Oluşturma Fonksiyonu
created() {
  this.listComponent?.getList();
}
//#endregion

//#region İndirme Fonksiyonu
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














