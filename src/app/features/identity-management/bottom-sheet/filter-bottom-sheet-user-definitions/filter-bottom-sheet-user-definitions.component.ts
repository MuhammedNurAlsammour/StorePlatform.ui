import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MaterialListModule } from '@coder-pioneers/shared';


interface RoleCount {
  name: string;
  count: number;
}

@Component({
  selector: 'app-filter-bottom-sheet-user-definitions',
  standalone: true,
  imports: [
    MaterialListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './filter-bottom-sheet-user-definitions.component.html',
  styleUrl: './filter-bottom-sheet-user-definitions.component.scss'
})
export class FilterBottomSheetUserDefinitionsComponent {
  searchText: string = '';
  selectedRoles: string[] = [];
  filteredRoles: RoleCount[] = [];
  initialSelection: string[] = [];
  rolesCounts: Map<string, number> = new Map();

  constructor(
    private bottomSheetRef: MatBottomSheetRef<FilterBottomSheetUserDefinitionsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      availableRoles: string[];
      selectedRoles: string[];
      originalData: any[];
    }
  ) {
    this.selectedRoles = [...data.selectedRoles];
    this.initialSelection = [...data.selectedRoles];
    this.calculateRoleCounts();
  }
  //#region DOĞRU
  private calculateRoleCounts() {
    // Calculate count for each role
    this.rolesCounts = this.data.originalData.reduce((acc, user) => {
      if (user.roleName) {
        acc.set(user.roleName, (acc.get(user.roleName) || 0) + 1);
      }
      return acc;
    }, new Map<string, number>());

    // Initialize filteredRoles with counts
    this.filteredRoles = this.data.availableRoles.map(role => ({
      name: role,
      count: this.rolesCounts.get(role) || 0
    }));
  }

  getTotalUsersCount(): number {
    return this.filteredRoles.reduce((sum, role) => sum + role.count, 0);
  }

  filterRoles() {
    if (!this.searchText) {
      this.filteredRoles = this.data.availableRoles.map(role => ({
        name: role,
        count: this.rolesCounts.get(role) || 0
      }));
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredRoles = this.data.availableRoles
        .filter(role => role.toLowerCase().includes(searchLower))
        .map(role => ({
          name: role,
          count: this.rolesCounts.get(role) || 0
        }));
    }
  }

  isAllSelected(): boolean {
    return this.filteredRoles.length > 0 &&
           this.filteredRoles.every(role => this.selectedRoles.includes(role.name));
  }

  isIndeterminate(): boolean {
    const selectedFilteredCount = this.filteredRoles
      .filter(role => this.selectedRoles.includes(role.name)).length;
    return selectedFilteredCount > 0 && selectedFilteredCount < this.filteredRoles.length;
  }

  toggleAll(checked: boolean) {
    if (checked) {
      this.selectedRoles = [
        ...new Set([...this.selectedRoles, ...this.filteredRoles.map(role => role.name)])
      ];
    } else {
      this.selectedRoles = this.selectedRoles.filter(
        role => !this.filteredRoles.map(r => r.name).includes(role)
      );
    }
  }

  isRoleSelected(role: string): boolean {
    return this.selectedRoles.includes(role);
  }

  onRoleFilterChange(role: string, checked: boolean) {
    if (checked) {
      this.selectedRoles.push(role);
    } else {
      this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    }
  }

  hasChanges(): boolean {
    if (this.selectedRoles.length !== this.initialSelection.length) return true;
    return !this.selectedRoles.every(role => this.initialSelection.includes(role));
  }

  resetFilters() {
    this.selectedRoles = [];
  }

  applyFilters() {
    this.bottomSheetRef.dismiss({
      selectedRoles: this.selectedRoles
    });
  }

  dismiss() {
    this.bottomSheetRef.dismiss();
  }
}























