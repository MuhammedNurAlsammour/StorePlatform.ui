// management.component.ts
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragStart,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  NgZone,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AdminSettingsCardsComponent,
  AlertConfig,
  AlertPosition,
  AlertService,
  BaseComponent,
  PermissionsService,
} from '@coder-pioneers/shared';
import { NgxSpinnerService } from 'ngx-spinner';

interface AdminCard {
  permission?: string;
  route: string;
  title: string;
  description: string;
  status: 'Aktif' | 'Beklemede' | 'Pasif';
  backgroundColor: string;
  iconBackgroundColor: string;
  materialIconName: string;
}

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminSettingsCardsComponent,
    DragDropModule,
  ],
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
})
export class ManagementComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @HostBinding('class.dragging') get dragging() {
    return this.isDragging;
  }
  @Output() created = new EventEmitter();
  @ViewChild(CdkDropList) dropList?: CdkDropList<AdminCard[]>;
  @ViewChildren('cardItem') cardItems?: QueryList<ElementRef>;

  visibleCards: AdminCard[] = [];
  isRTL: boolean = false;
  isDragging: boolean = false;
  dragStartDelay: number = 50;
  touchDropThreshold: number = 20;
  private readonly STORAGE_KEY = 'adminCardOrder';

  constructor(
    private alertService: AlertService,
    spinner: NgxSpinnerService,
    public permissionsService: PermissionsService,
    @Inject(PLATFORM_ID) private platformId: object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
    super(spinner);
    const config = new AlertConfig();
    config.duration = 5000;
    config.positionY = AlertPosition.Top;
    config.positionX = AlertPosition.Right;
    alertService.setConfig(config);
  }

  alert() {
    this.alertService.warning('Görev atama yetkiniz yok');
  }

  alertInventory() {
    this.alertService.warning('Yakında!!!');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const dir = document.dir || document.documentElement.dir;
      this.isRTL = dir === 'rtl';
    }

    this.ngZone.runOutsideAngular(() => {
      this.filterVisibleCards();
      this.loadCardOrder();
      this.ngZone.run(() => {
        this.cdr.detectChanges();
      });
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupTouchHandlers();
    }
  }

  setupTouchHandlers(): void {
    if (!this.dropList) return;

    const container =
      this.elementRef.nativeElement.querySelector('.card-container');
    if (!container) return;

    this.dropList.entered.subscribe(() => {
      container.classList.add('cdk-drop-list-receiving');
      if (isPlatformBrowser(this.platformId) && 'vibrate' in navigator) {
        try {
          navigator.vibrate(10);
        } catch (e) {
          console.error('Titreşim desteklenmiyor:', e);
        }
      }
    });

    this.dropList.exited.subscribe(() => {
      container.classList.remove('cdk-drop-list-receiving');
    });

    this.cardItems?.changes.subscribe((items: QueryList<ElementRef>) => {
      items.forEach((item) => {
        const el = item.nativeElement;
        el.addEventListener(
          'touchstart',
          (e: TouchEvent) => {
            if (el.closest('.drag-handle')) {
              e.preventDefault();
            }
          },
          { passive: false }
        );
      });
    });
  }

  filterVisibleCards() {
    this.visibleCards = this.adminCards.filter(
      (card) =>
        !card.permission || this.permissionsService.ifPermit(card.permission)
    );
  }

  onDrop(event: CdkDragDrop<AdminCard[]>) {
    this.ngZone.run(() => {
      if (event.previousIndex !== event.currentIndex) {
        try {
          moveItemInArray(
            this.visibleCards,
            event.previousIndex,
            event.currentIndex
          );
          this.saveCardOrder();
          this.created.emit();

          if (isPlatformBrowser(this.platformId) && 'vibrate' in navigator) {
            try {
              navigator.vibrate([50, 30, 50]);
            } catch (e) {
              console.error('Titreşim desteklenmiyor:', e);
            }
          }
        } catch (error) {
          console.error('Sürükle ve bırak sırasında hata:', error);
          this.alertService.error('Kart sıralaması güncellenirken hata oluştu');
        } finally {
          setTimeout(() => {
            this.isDragging = false;
            this.cdr.detectChanges();
          }, 100);
        }
      } else {
        this.isDragging = false;
      }
    });
  }

  saveCardOrder() {
    try {
      const orderMap = this.visibleCards.map((card) => card.route);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orderMap));
    } catch (error) {
      console.error('Kart sırası kaydedilirken hata:', error);
      this.alertService.error('Kart sırası kaydedilemedi');
    }
  }

  loadCardOrder() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const savedOrder = localStorage.getItem(this.STORAGE_KEY);
      if (savedOrder) {
        const orderMap = JSON.parse(savedOrder) as string[];

        if (!Array.isArray(orderMap)) {
          throw new Error('Geçersiz kayıtlı sıra formatı');
        }

        const orderedCards: AdminCard[] = [];

        orderMap.forEach((route) => {
          const card = this.visibleCards.find((c) => c.route === route);
          if (card) {
            orderedCards.push(card);
          }
        });

        this.visibleCards.forEach((card) => {
          if (!orderMap.includes(card.route)) {
            orderedCards.push(card);
          }
        });

        if (orderedCards.length > 0) {
          this.visibleCards = orderedCards;
        }
      }
    } catch (error) {
      console.error('Kart sırası yüklenirken hata:', error);
    }
  }

  startDragging(event: CdkDragStart) {
    this.isDragging = true;

    const element = event.source.element.nativeElement;
    if (element) {
      element.classList.add('drag-start');
      element.style.opacity = '0.95';
      element.style.transform = 'scale(1.03) translateZ(0)';
      element.style.transition = 'transform 0.08s ease';
      element.style.willChange = 'transform';
      element.style.zIndex = '1000';

      element.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.3)';
      element.style.border = '2px solid #4caf50';

      if (isPlatformBrowser(this.platformId) && 'vibrate' in navigator) {
        try {
          navigator.vibrate(15);
        } catch (e) {
          console.error('Titreşim desteklenmiyor:', e);
        }
      }

      if (this.isRTL) {
        this.ngZone.runOutsideAngular(() => {
          const mirror = document.querySelector('.cdk-drag-preview');
          if (mirror) {
            (mirror as HTMLElement).style.transform =
              'scale(1.03) translateZ(0) rotate(-1deg)';
            (mirror as HTMLElement).style.boxShadow =
              '0 12px 30px rgba(76, 175, 80, 0.4)';
          }
        });
      }
    }

    const container =
      this.elementRef.nativeElement.querySelector('.card-container');
    if (container) {
      container.classList.add('dragging-active');
    }
  }

  endDragging(event: CdkDragEnd) {
    const element = event.source.element.nativeElement;
    if (element) {
      element.classList.remove('drag-start');
      element.style.opacity = '1';
      element.style.transform = 'scale(1) translateZ(0)';
      element.style.transition = 'transform 0.2s ease';
      element.style.zIndex = 'auto';

      element.style.boxShadow = '';
      element.style.border = '';
    }

    const container =
      this.elementRef.nativeElement.querySelector('.card-container');
    if (container) {
      container.classList.remove('dragging-active');
    }

    setTimeout(() => {
      this.isDragging = false;
      this.cdr.detectChanges();
    }, 50);
  }

  adminCards: AdminCard[] = [
    {
      permission:
        'GET.Reading.BusinessesİşletmelerveOrganizasyonlarListesiGetirir',
      route: '/businesses-management',
      title: 'İşletmeler',
      description: '(businesses) İşletmeleri yönetebilirsiniz',
      status: 'Aktif',
      backgroundColor: '#f8d7da',
      iconBackgroundColor: '#dc3545',
      materialIconName: 'business',
    },
  ];
}
