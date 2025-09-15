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
  selector: 'app-report-management',
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
  templateUrl: './report-management.component.html',
  styleUrl: './report-management.component.scss'
})
export class ReportManagementComponent implements OnInit{

  constructor(
    public permissionsService: PermissionsService,
    private router: Router,
  )
  {}

  ngOnInit(): void { }


 adminCards: AdminCard[] = [
  {
    permission: 'GET.Reading.YıllıkİzinkullanımRaporunuGör(Aç/Kapat)',
    route: '/annual-leave-report',
    title: 'Yıllık İzin kullanım Raporunu',
    description: 'Yıllık İzin Raporunu ve yönetimi',
    status: 'Aktif',
    backgroundColor: '#f8d7da',
    iconBackgroundColor: '#dc3545',
    materialIconName: 'event'
  },
  {
    permission: 'GET.Reading.İzinRaporunuGör(Aç/Kapat)',
    route: '/leave-report',
    title: 'İzin Raporunu',
    description: 'İzin Raporunu ve yönetimi',
    status: 'Aktif',
    backgroundColor: '#d4edda',
    iconBackgroundColor: '#28a745',
    materialIconName: 'event'
  },
  {
    permission: 'GET.Reading.FazlaMesaiRaporunuGör(Aç/Kapat)',
    route: '/overtime-report',
    title: 'Fazla Mesai Raporunu',
    description: 'Fazla mesai Raporunu ve yönetimi',
    status: 'Aktif',
    backgroundColor: '#d1ecf1',
    iconBackgroundColor: '#17a2b8',
    materialIconName: 'schedule'
  },
  {
    permission: 'GET.Reading.PersonelRaporunuGör(Aç/Kapat)',
    route: '/personnel-report',
    title: 'Personel Raporunu',
    description: 'Personel Raporunu ve yönetimi',
    status: 'Aktif',
    backgroundColor: '#ced4da',
    iconBackgroundColor: '#9c27b0',
    materialIconName: 'people'
  },
];

}























