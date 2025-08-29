import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AdminSettingsCardsComponent, AlertService, PermissionsService } from '@coder-pioneers/shared';

interface AdminCard {
  permission?: string;
  route: string;
  title: string;
  title2?: string;
  onTitle2?: boolean;
  description: string;
  status:'Aktif' | 'Beklemede' | 'Pasif';
  backgroundColor: string;
  iconBackgroundColor:string;
  materialIconName:string;
}
@Component({
  selector: 'app-demand-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CommonModule,
    RouterModule,
    AdminSettingsCardsComponent,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatTabsModule,
  ],
  templateUrl: './demand-management.component.html',
  styleUrl: './demand-management.component.scss'
})
export class DemandManagementComponent implements OnInit{

  constructor(
    private router: Router,
    private alertService: AlertService,
    public permissionsService: PermissionsService
  )
  {
  }
  ngOnInit(): void {  }
  alert(){
    this.alertService.warning('İzin görme yetkiniz yok !!!');
  }
  alertOvertime(){
    this.alertService.warning('Fazla Mesai görme yetkiniz yok !!!');
  }
  alerTaskAssignment(){
    this.alertService.warning('Görev atama yetkiniz yok !!!');
  }

 adminCards: AdminCard[] = [

];

}




















