import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs';
import { FilterBottomSheetUserDefinitionsComponent } from './filter-bottom-sheet-user-definitions/filter-bottom-sheet-user-definitions.component';
import { StatusFilterBottomSheetComponent } from './status-filter-bottom-sheet-user-definitions/status-filter.component';

@Injectable({
  providedIn: 'root'
})
export class FilterBottomSheetService {
  constructor(private bottomSheet: MatBottomSheet) {}
  openStatusFilter(initialStatus: boolean | null): Observable<boolean | null> {
    const bottomSheetRef = this.bottomSheet.open(StatusFilterBottomSheetComponent, {
      data: { initialStatus },
      panelClass: 'filter-bottom-sheet'
    });
    return bottomSheetRef.afterDismissed();
  }

  openFilterSheet(
    availableRoles: string[],
    selectedRoles: string[],
    originalData: any[]
  ): Observable<any> {
    const bottomSheetRef = this.bottomSheet.open(FilterBottomSheetUserDefinitionsComponent, {
      data: { availableRoles, selectedRoles, originalData },
      panelClass: 'filter-bottom-sheet'
    });

    return bottomSheetRef.afterDismissed();
  }

}




















