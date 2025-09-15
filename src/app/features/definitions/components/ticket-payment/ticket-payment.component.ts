import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CoderPioneersComponent } from '@coder-pioneers/ui-layout-components';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from '@coder-pioneers/shared';
import { PermissionsService } from '@coder-pioneers/shared';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-ticket-payment',
  standalone: true,
  imports: [
    ListComponent,
    CreateComponent,
    CoderPioneersComponent,
  ],
  templateUrl: './ticket-payment.component.html',
  styleUrl: './ticket-payment.component.scss'
})
export class TicketPaymentComponent  extends  BaseComponent implements OnInit {

searchValue: string = '';
showBreadcrumbs: boolean = true;

@ViewChild(ListComponent)
listComponent?: ListComponent;

constructor(
  public permissionsService: PermissionsService,
  private routers: Router,
  spinner: NgxSpinnerService
) {
  super(spinner);
}

ngOnInit(): void {
  if (
    !this.permissionsService.ifPermit('GET.Reading.YemekKartiTanimlariniListele')
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
//#endregion
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























