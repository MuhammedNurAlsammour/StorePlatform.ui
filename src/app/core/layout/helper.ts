import { animate, style, transition, trigger } from '@angular/animations';

export interface INavbarData {
    routeLink: string;
    class1?: string;
    icon?: string;
    label: string;
    code?: string;
    code2?: string;
    cl2?: string;
    expanded?: boolean;// sub  menu  açık  veya kapalı
    items?: INavbarData[];
    badgeCount?: number;
    tooltip?: string;
    backgroundColor?: string;
    iconColor?: string;
    textColor?: string;
}


export const fadeInOut = trigger('fadeInOut', [
    transition(':enter', [
      style({opacity: 0}),
      animate('350ms',
        style({opacity: 1})
      )
    ]),
    transition(':leave', [
      style({opacity: 1}),
      animate('350ms',
        style({opacity: 0})
      )
    ])
  ]);
