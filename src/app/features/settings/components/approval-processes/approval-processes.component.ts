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
import { AlertService, AdminSettingsCardsComponent, PermissionsService } from '@coder-pioneers/shared';

interface AdminCard {
  permission?: string;
  route: string;
  title: string;
  description: string;
  status:'Aktif' | 'Beklemede' | 'Pasif';
  backgroundColor: string;
  iconBackgroundColor:string;
  materialIconName:string;
}

@Component({
  selector: 'app-approval-processes',
  standalone: true,
  imports: [
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
  templateUrl: './approval-processes.component.html',
  styleUrl: './approval-processes.component.scss'
})
export class ApprovalProcessesComponent implements OnInit {
  constructor(
    private router: Router,
    private alertService: AlertService,
    public permissionsService: PermissionsService
  ){

  }
  ngOnInit(): void {
  }
  alert(){
    this.alertService.warning('İzin görme yetkiniz yok !!!');
  }
  alertOvertime(){
    this.alertService.warning('Fazla Mesai görme yetkiniz yok !!!');
  }

 adminCards: AdminCard[] = [
  {
    permission: 'GET.Reading.YöneticiIDsineGöreİzinTalepleriniGör',
    route: '/leave-approvals',
    title: 'İzin Onay',
    description: 'İzin Onay ve yönetimi',
    status: 'Aktif',
    backgroundColor: '#f8d7da',
    iconBackgroundColor: '#dc3545',
    materialIconName: 'event'
  },
  {
    permission: 'GET.Reading.YöneticiyeDüşenFazlaMesaiİtekleriniGör',
    route: '/overtime-approvals',
    title: 'Fazla Mesai Onay',
    description: 'Fazla mesai Onay ve yönetimi',
    status: 'Aktif',
    backgroundColor: '#d1ecf1',
    iconBackgroundColor: '#17a2b8',
    materialIconName: 'schedule'
  },
  {
    permission: 'PUT.Reading.TalepIsteginiOnayla/Reddet',
    route: '/task-support-approvals',
    title: 'Görev Onay',
    description: 'Görev Onay ve yönetimi',
    status: 'Aktif',
    backgroundColor: '#d4edda',
    iconBackgroundColor: '#28a745',
    materialIconName: 'assignment'
  },
  {
    permission: 'GET.Reading.PersonelIDsiileGeçiciGörevlendirmeListele',
    route: '/secondment-approval',
    title: 'Geçici/Görevlendirme Onay',
    description: 'Geçici/Görevlendirme Onay ve yönetimi',
    status: 'Aktif',
    backgroundColor: '#adb5bd',
    iconBackgroundColor: '#673ab7',
    materialIconName: 'assignment'
  },

];

}























