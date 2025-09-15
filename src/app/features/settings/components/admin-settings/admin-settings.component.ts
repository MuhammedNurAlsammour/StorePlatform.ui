import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import {
  AdminSettingsCardsComponent,
  AlertService,
  PermissionsService,
} from '@coder-pioneers/shared';
import { CoderPioneersComponent } from '@coder-pioneers/ui-layout-components';
import $ from 'jquery';

interface AdminCard {
  permission: string;
  route: string;
  title: string;
  description: string;
  backgroundColor: string;
  iconBackgroundColor: string;
  materialIconName: string;
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [
    CoderPioneersComponent,
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
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss',
})
export class AdminSettingsComponent implements OnInit {
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  constructor(
    private _formBuilder: FormBuilder,
    private alertService: AlertService,
    public permissionsService: PermissionsService
  ) {}

  //#region ngOnInit
  // Sayfa yüklendiğinde ilk çalışacak işlemler
  ngOnInit() {
    $(function () {
      let flag = 0;

      $('.share').on('click', function (this: any) {
        if (flag == 0) {
          $(this).siblings('.one').animate(
            {
              top: '260px',
              left: '43%',
            },
            200
          );

          $(this).siblings('.two').delay(200).animate(
            {
              top: '342px',
              left: '43%',
            },
            200
          );

          $(this).siblings('.three').delay(300).animate(
            {
              top: '342px',
              left: '43%',
            },
            200
          );

          $(this).siblings('.three').delay(300).animate(
            {
              top: '234px',
              left: '50%',
            },
            200
          );

          $('.one i,.two i, .three i').delay(500).fadeIn(200);
          flag = 1;
        } else {
          $('.one, .two, .three').animate(
            {
              top: '72%',
              left: '68%',
            },
            200
          );

          $('.one i,.two i, .three i').delay(500).fadeOut(200);
          flag = 0;
        }
      });
    });
  }
  //#endregion

  alert() {
    this.alertService.warning('yakında güncelleniyor ...');
  }

  //#region adminCards
  adminCards: AdminCard[] = [
    {
      permission: 'GET.Reading.GetAllUsers',
      route: '/user-definitions',
      title: 'Kullanıcı Tanımları',
      description: 'Kullanıcı tanımları ve yönetimi',
      backgroundColor: '#e9ecef',
      iconBackgroundColor: '#2196f3',
      materialIconName: 'group',
    },
    {
      permission: 'GET.Reading.GetRoles',
      route: '/rol-definitions',
      title: 'Rol Tanımları',
      description: 'Rol tanımları ve yönetimi',
      backgroundColor: '#212529',
      iconBackgroundColor: '#ffc107',
      materialIconName: 'admin_panel_settings',
    },
    {
      permission: 'GET.Reading.GetAllCustomers',
      route: '/customer-definitions',
      title: 'Müşteri Tanımları',
      description: 'Müşteri tanımları ve yönetimi',
      backgroundColor: '#ced4da',
      iconBackgroundColor: '#9c27b0',
      materialIconName: 'people',
    },
    {
      permission: 'GET.Reading.KategorilerListesiGetirir',
      route: '/categories-management',
      title: 'Kategori Tanımları',
      description: 'Kategori tanımları ve yönetimi',
      backgroundColor: '#ced4da',
      iconBackgroundColor: '#3577b0',
      materialIconName: 'category',
    },
  ];
  //#endregion
}

