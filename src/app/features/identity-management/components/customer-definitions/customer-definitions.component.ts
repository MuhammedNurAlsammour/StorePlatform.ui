import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { BaseComponent, PermissionsService } from '@coder-pioneers/shared';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { CoderPioneersComponent } from '@coder-pioneers/ui-layout-components';

@Component({
  selector: 'app-customer-definitions',
  standalone: true,
  imports: [
    ListComponent,
    CreateComponent,
    CoderPioneersComponent
  ],
  templateUrl: './customer-definitions.component.html',
  styleUrl: './customer-definitions.component.scss'
})
export class CustomerDefinitionsComponent extends BaseComponent implements OnInit,AfterViewInit {
  searchValues: string = '';
  isLinear = false;
  selectedStaffId!: string;
  durumu!: boolean;

  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  tabNumber?: number = 0;
  selected = new FormControl(this.tabNumber);

  @ViewChild(ListComponent) listComponent?: ListComponent;
  searchValue: string = '';

  constructor(
    private routers: Router,
    public permissionsService: PermissionsService,
    spinner: NgxSpinnerService
  )
  {
    super(spinner);
  }

  ngAfterViewInit() {
    if (this.tabGroup) {
      this.tabGroup.disableRipple = true;
      this.tabGroup.dynamicHeight = true;
    }
  }

  ngOnInit(): void {
    if (
      !this.permissionsService.ifPermit('GET.Reading.TümMüşterileriGör')
      ){
      this.routers.navigate(['/unauthorized']);
      return;
    }
  }

  created() {
    this.listComponent?.getList();
  }

  receiveSearchValue(value: string) {
    this.searchValue = value;
  }

  receiveSearchValues(value: string) {
    this.searchValue = value;
  }

  receiveDurumuValue(value: boolean) {
    this.durumu = value;
  }


  //#region Dışa Aktarma İşlemleri
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
}




















