import { Routes } from '@angular/router';
import { AuthGuard } from '@coder-pioneers/auth';
import { LayoutComponent } from '@core/layout/layout.component';
import { ChangePasswordFirstLoginComponent } from './auth/change-password-first-login/change-password-first-login.component';
import { LoginsComponent } from './auth/login/login.component';
import { UnauthorizedComponent } from './auth/unauthorized/unauthorized.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: LayoutComponent,
    children: [],
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginsComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'change-password', component: ChangePasswordFirstLoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./core/layout/layout.component').then(
            (comp) => comp.LayoutComponent
          ),
      },
      {
        path: 'document-type-definitions',
        loadComponent: () =>
          import(
            './features/definitions/components/document-type-definition/document-type-definition.component'
          ).then((comp) => comp.DocumentTypeDefinitionComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'type-of-resignation-definitions',
        loadComponent: () =>
          import(
            './features/definitions/components/type-of-resignation/type-of-resignation.component'
          ).then((comp) => comp.TypeOfResignationComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'ticket-payment',
        loadComponent: () =>
          import(
            './features/definitions/components/ticket-payment/ticket-payment.component'
          ).then((comp) => comp.TicketPaymentComponent),
        canActivate: [AuthGuard],
      },

      {
        path: 'settings',
        loadComponent: () =>
          import(
            './features/settings/components/admin-settings/admin-settings.component'
          ).then((comp) => comp.AdminSettingsComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'management',
        loadComponent: () =>
          import(
            './features/settings/components/management/management.component'
          ).then((comp) => comp.ManagementComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'faqpanel',
        loadComponent: () =>
          import(
            './features/settings/components/faq-panel/faq-panel.component'
          ).then((comp) => comp.FaqPanelComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'approval-processes',
        loadComponent: () =>
          import(
            './features/settings/components/approval-processes/approval-processes.component'
          ).then((comp) => comp.ApprovalProcessesComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'demand-management',
        loadComponent: () =>
          import(
            './features/settings/components/demand-management/demand-management.component'
          ).then((comp) => comp.DemandManagementComponent),
        canActivate: [AuthGuard],
      },

      {
        path: 'user-definitions',
        loadComponent: () =>
          import(
            './features/identity-management/components/user-definitions/user-definitions.component'
          ).then((comp) => comp.UserDefinitionsComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'customer-definitions',
        loadComponent: () =>
          import(
            './features/identity-management/components/customer-definitions/customer-definitions.component'
          ).then((comp) => comp.CustomerDefinitionsComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'rol-definitions',
        loadComponent: () =>
          import(
            './features/identity-management/components/rol-definitions/rol-definitions.component'
          ).then((comp) => comp.RolDefinitionsComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'test-conversion',
        loadComponent: () =>
          import(
            './features/identity-management/components/rol-definitions/test-conversion.component'
          ).then((comp) => comp.TestConversionComponent),
        canActivate: [AuthGuard],
      },

      {
        path: 'json-converter',
        loadComponent: () =>
          import('./features/json-converter/json-converter.component').then(
            (comp) => comp.JsonConverterComponent
          ),
        canActivate: [AuthGuard],
      },

      {
        path: 'categories-management',
        loadComponent: () =>
          import(
            './features/categories-management/components/categories/categories.component'
          ).then((comp) => comp.CategoriesComponent),
        canActivate: [AuthGuard],
      },

      // Businesses Management
      {
        path: 'businesses-management',
        loadComponent: () =>
          import(
            './features/Businesses-management/components/Businesses/Businesses.component'
          ).then((comp) => comp.BusinessesComponent),
        canActivate: [AuthGuard],
      },
    ],
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
