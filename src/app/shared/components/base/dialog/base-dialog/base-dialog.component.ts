import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MaterialDialogModule } from '@coder-pioneers/shared';
import { map, Observable, startWith } from 'rxjs';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'selectAutocomplete';
  required?: boolean;
  maxLength?: number;
  options?: Array<{
    id: any;
    name: string;
  }>;
  placeholder?: string;
  defaultValue?: any;
  col?: number | string; // number (col-6) veya string (col)
  rowStart?: boolean; // Yeni satır başlangıcı
  rowEnd?: boolean;   // Satır sonu
  autocompleteOptions?: any[];
  displayFn?: (item: any) => string;
  filterFn?: (value: string, options: any[]) => any[];
}

@Component({
  selector: 'app-base-dialog',
  standalone: true,
  imports: [MaterialDialogModule],
  templateUrl: './base-dialog.component.html',
  styleUrls: ['./base-dialog.component.scss']
})
export class BaseDialogComponent implements OnInit, OnChanges {
  @Input() dialogTitle: string = '';
  @Input() titleIcon: string = '';
  @Input() buttonStatus: string = '2'; // 1: Onayla, 0: Reddet 2: kaydet
  @Input() titleIconColor: string = 'rgb(19, 196, 202)';
  @Input() saveButtonText: string = 'Kaydet';
  @Input() cancelButtonText: string = 'Vazgeç';
  @Input() isSaveButtonVisible: boolean = true;
  @Input() isCancelButtonVisible: boolean = true;
  @Input() frm: FormGroup | undefined;
  @Input() fields: FormFieldConfig[] = [];
  @Output() formSubmit: EventEmitter<any> = new EventEmitter();

  filteredOptions: Map<string, Observable<any[]>> = new Map();

  ngOnInit() {
    this.setupAutocompleteFields();
  }

  ngOnChanges() {
    // Re-setup autocomplete when fields change
    this.setupAutocompleteFields();
  }

  displayFn(field: FormFieldConfig) {
    return (value: any): string => {
      if (!value) return '';
      return field.displayFn ? field.displayFn(value) : value.name || '';
    };
  }

  getCurrentCharacterCount(fieldName: string, maxLength: number): string {
    const control = this.frm?.get(fieldName);
    const currentLength = control?.value?.toString().length || 0;
    return `${currentLength}/${maxLength}`;
  }

  getColClass(field: FormFieldConfig): string {
    if (!field.col) {
      return 'col-12'; // Varsayılan değer
    }

    if (typeof field.col === 'string') {
      return field.col; // 'col' gibi string değerler için
    }

    return `col-${field.col}`; // number değerler için (col-6, col-12, vb.)
  }

  getFieldRows(): FormFieldConfig[][] {
    const rows: FormFieldConfig[][] = [];
    let currentRow: FormFieldConfig[] = [];

    for (const field of this.fields) {
      // Eğer field rowStart true ise, yeni satır başlat
      if (field.rowStart) {
        // Eğer mevcut satır varsa, onu rows'a ekle
        if (currentRow.length > 0) {
          rows.push([...currentRow]);
        }
        // Yeni satır başlat
        currentRow = [field];
      } else {
        // Mevcut satıra ekle
        currentRow.push(field);
      }

      // Eğer field rowEnd true ise, satırı tamamla
      if (field.rowEnd) {
        rows.push([...currentRow]);
        currentRow = [];
      }
    }

    // Eğer son satırda kalan alanlar varsa, onları da ekle
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  }

  onFormSubmit() {
    if (this.frm) {
      this.formSubmit.emit(this.frm.value);
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.frm?.get(fieldName);
    if (control?.errors?.['required']) {
      return `${this.fields.find(f => f.name === fieldName)?.label || fieldName} alanı zorunludur`;
    }
    return '';
  }

  private setupAutocompleteFields() {
    // Clear existing filtered options
    this.filteredOptions.clear();

    this.fields.forEach(field => {
      if (field.type === 'selectAutocomplete' && field.autocompleteOptions) {
        this.setupAutocomplete(field);
      }
    });
  }

  private setupAutocomplete(field: FormFieldConfig) {
    if (this.frm && field.autocompleteOptions && field.autocompleteOptions.length > 0) {
      const filterFn = field.filterFn || this.defaultFilterFn;

      this.filteredOptions.set(
        field.name,
        this.frm.get(field.name)!.valueChanges.pipe(
          startWith(''),
          map(value => {
            const searchStr = typeof value === 'string' ? value :
              (field.displayFn ? field.displayFn(value) : (value?.name || ''));
            return filterFn(searchStr, field.autocompleteOptions!);
          })
        )
      );
    }
  }

  // Update autocomplete options when they change
  updateAutocompleteOptions(fieldName: string, options: any[]) {
    const field = this.fields.find(f => f.name === fieldName);
    if (field) {
      field.autocompleteOptions = options;
      this.setupAutocomplete(field);
    }
  }

  private defaultFilterFn(value: string, options: any[]): any[] {
    const filterValue = value.toLowerCase();
    return options.filter(option =>
      option.name.toLowerCase().includes(filterValue));
  }

  getFilteredOptions(fieldName: string): Observable<any[]> {
    return this.filteredOptions.get(fieldName) || new Observable();
  }

  onAutocompleteSelected(event: MatAutocompleteSelectedEvent, fieldName: string): void {
    this.frm?.get(fieldName)?.setValue(event.option.value);
  }
}
