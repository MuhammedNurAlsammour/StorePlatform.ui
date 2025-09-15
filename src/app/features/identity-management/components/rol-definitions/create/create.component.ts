import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertConfig, AlertPosition, AlertService, BaseComponent, DialogService, PermissionsService } from '@coder-pioneers/shared';
import { CoderPioneersCreateComponent } from '@coder-pioneers/ui-layout-components';
import { RequestRolDefinitions } from '@features/identity-management/contracts/requests/request-rol-definitions';
import { AuthorizeDefinitionEndpointsDialogComponent } from '@features/identity-management/dialogs/authorize-definition-endpoints-dialog/authorize-definition-endpoints-dialog.component';
import { RolDefinitionsCreateDialogComponent } from '@features/identity-management/dialogs/rol-definitions-create-dialog/rol-definitions-create-dialog.component';
import { RolDefinitionsService } from '@features/identity-management/services/rol-definitions.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
   CoderPioneersCreateComponent
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent extends BaseComponent implements OnInit{
  @Output() created = new EventEmitter();
  @Output() searchFilter = new EventEmitter<string>();

  constructor(
    private dialogService: DialogService,
    private alertService: AlertService,
    public permissionsService:PermissionsService,
    private rolDefinitionsService: RolDefinitionsService,
    spinner: NgxSpinnerService
  )
  {
    super(spinner);
    const config = new AlertConfig();
    config.duration = 5000;
    config.positionY = AlertPosition.Top;
    config.positionX = AlertPosition.Right;
    alertService.setConfig(config);
  }

  ngOnInit(): void {
  }

  create(){
    if (this.permissionsService.ifPermit('POST.Writing.CreateRole')){
      this.dialogService.openDialog({
        componentType: RolDefinitionsCreateDialogComponent,
        options: {
          width: '1050px'
        },
        data: {},
        disableClose:true,
        afterClosed: (data: RequestRolDefinitions)  => {
          (this.rolDefinitionsService.create(data))
          .subscribe(result => {
            const errorMessage: string = result?.message;
            this.alertService.success(errorMessage);
            this.created.emit();
          },(errorResponse: HttpErrorResponse) => {
            const errorMessage: string = errorResponse?.error?.mesajDetay;
            this.alertService.error(errorMessage);
          });
        }
      });
    } else {
      this.alertService.warning('yetkiniz yok');
    }
  }

  createalert(){
    this.alertService.warning('yetkiniz yok');
  }

  view(){
    if (this.permissionsService.ifPermit('POST.Writing.CreateRole')){
      this.dialogService.openDialog({
        componentType: AuthorizeDefinitionEndpointsDialogComponent,
        options: {
          width: '1050px'
        },
        data: {},
        disableClose:true,
        afterClosed: ()  => {
          this.created.emit();
        }
      });
    } else {
      this.alertService.warning('yetkiniz yok');
    }
  }

  filterList(value: string) {
    this.searchFilter.emit(value);
  }
}























