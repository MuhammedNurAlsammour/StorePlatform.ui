import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent, PermissionsService } from '@coder-pioneers/shared';
import { CoderPioneersComponent } from '@coder-pioneers/ui-layout-components';
import { NgxSpinnerService } from 'ngx-spinner';
import { convertJsonToMenusFormat, sampleInputData, type ConvertedMenu, type Menu } from '../../utils/json-converter.util';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-rol-definitions',
  standalone: true,
  imports: [
    CoderPioneersComponent,
    CreateComponent,
    ListComponent
  ],
  templateUrl: './rol-definitions.component.html',
  styleUrl: './rol-definitions.component.scss'
})
export class RolDefinitionsComponent  extends BaseComponent implements OnInit{
  @ViewChild(ListComponent) listComponent?: ListComponent;
  searchValue: string = '';
  id?: string;

  constructor(
    public permissionsService: PermissionsService,
    private routers: Router,
    private route: ActivatedRoute,
    spinner: NgxSpinnerService
  )
  {
    super(spinner);
  }

  /**
   * Örnek kullanım için test fonksiyonu
   */
  testConversion() {
    const convertedData = convertJsonToMenusFormat(sampleInputData);
    console.log('Dönüştürülmüş veri:', convertedData);
    return convertedData;
  }

  /**
   * Custom veri ile dönüştürme
   */
  convertCustomData(inputData: Menu[]): ConvertedMenu[] {
    return convertJsonToMenusFormat(inputData);
  }

  //#region ngOnInit
  // Sayfa yüklendiğinde ilk çalışacak işlemler
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    if (
      !this.permissionsService.ifPermit('GET.Reading.GetRoles')
      ){
      this.routers.navigate(['/unauthorized']);
      return;
    }
  }
  //#endregion

  created() {
    this.listComponent?.getList();
  }

  //#region Arama
  // Arama
  receiveSearchValue(value: string) {
    this.searchValue = value;
  }
  //#endregion
}
























