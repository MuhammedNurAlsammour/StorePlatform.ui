import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CpMainContentComponent } from '@coder-pioneers/ui-main-content';
import { CpSidebarComponent } from '@coder-pioneers/ui-sidebar';
import { navbarData } from './nav-data';
import { CpHeaderComponent } from '@coder-pioneers/ui-header';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CpSidebarComponent,
    CpHeaderComponent,
    MatIconModule,
    CpMainContentComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  isSideNavCollapsed = false;
  screenWidth = 0;
  navData = navbarData;
  companyLogo = "assets/login/Logo4.png";
  version = '1.0.2';
  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  onHeaderToggle(data: HeaderToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

}
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}


interface HeaderToggle {
  screenWidth: number;
  collapsed: boolean;
}
