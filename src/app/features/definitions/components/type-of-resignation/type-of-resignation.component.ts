import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CoderPioneersComponent } from '@coder-pioneers/ui-layout-components';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from '@coder-pioneers/shared';
import { PermissionsService } from '@coder-pioneers/shared';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-type-of-resignation',
  standalone: true,
  imports: [
    ListComponent,
    CreateComponent,
    CoderPioneersComponent,
  ],
  templateUrl: './type-of-resignation.component.html',
  styleUrl: './type-of-resignation.component.scss'
})
export class TypeOfResignationComponent extends BaseComponent implements OnInit {
searchValue: string = '';
showBreadcrumbs: boolean = true;

@ViewChild(ListComponent)
listComponent?: ListComponent;

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
    !this.permissionsService.ifPermit('GET.Reading.IstifaTanimlariniListele')
    ){
    this.routers.navigate(['/unauthorized']);
    return;
  }
}

receiveSearchValue(value: string) {
  this.searchValue = value;
}

created() {
  this.listComponent?.getList();
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




















