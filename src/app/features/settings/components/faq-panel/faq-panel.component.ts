import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-faq-panel',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ListComponent
  ],
  templateUrl: './faq-panel.component.html',
  styleUrl: './faq-panel.component.scss'
})
export class FaqPanelComponent {

}























