import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BaseBottomSheetComponent, BaseBottomSheetConfig, MaterialDialogModule } from '@coder-pioneers/shared';

interface StatusOption {
  value: boolean;
  label: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-status-filter-bottom-sheet',
  standalone: true,
  imports: [
    CommonModule,
    MaterialDialogModule,
    BaseBottomSheetComponent
  ],
  templateUrl: './status-filter.component.html',
  styleUrl: './status-filter.component.scss'
})
export class StatusFilterBottomSheetComponent implements OnInit {
  @ViewChild('contentTpl') contentTemplate!: TemplateRef<any>;

  selectedStatus: boolean | null = null;

  bottomSheetConfig: BaseBottomSheetConfig = {
    title: 'Filtreleme',
    description: 'Kayıtları durumlarına göre filtrelemek için seçim yapın',
    icon: 'filter_list',
    saveButtonText: 'Uygula',
    cancelButtonText: 'Sıfırla',
    customClass: 'status-filter-sheet',
    data: {
      initialStatus: null
    }
  };

  statusOptions: StatusOption[] = [
    {
      value: false,
      label: 'Aktif',
      description: 'Aktif durumdaki kayıtları göster',
      icon: 'assets/images/vector/check.svg'
    },
    {
      value: true,
      label: 'Pasif',
      description: 'Pasif durumdaki kayıtları göster',
      icon: 'assets/images/vector/close.svg'
    }
  ];

  constructor(
    private bottomSheetRef: MatBottomSheetRef<StatusFilterBottomSheetComponent>
  ) {}

  ngOnInit(): void {
    if (this.bottomSheetConfig.data?.initialStatus !== undefined) {
      this.selectedStatus = this.bottomSheetConfig.data.initialStatus;
    }
  }

  selectStatus(status: boolean): void {
    this.selectedStatus = this.selectedStatus === status ? null : status;
  }

  onSave(): void {
    this.bottomSheetRef.dismiss(this.selectedStatus);
  }

  onCancel(): void {
    this.selectedStatus = null;
    this.bottomSheetRef.dismiss(null);
  }

  onDismiss(): void {
    this.bottomSheetRef.dismiss();
  }
}























