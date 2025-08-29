import { Injectable } from '@angular/core';

export interface CustomPipeConfig {
  name: string;
  transform: (value: any, ...args: any[]) => any;
}

@Injectable({
  providedIn: 'root'
})
export class PipeRegistryService {
  private pipes = new Map<string, (value: any, ...args: any[]) => any>();

  constructor() {
    // Varsayılan pipe'ları kaydet
    this.registerDefaultPipes();
  }

  /**
   * Yeni bir pipe kaydet
   * @param name Pipe adı
   * @param transformFunction Dönüştürme fonksiyonu
   */
  registerPipe(name: string, transformFunction: (value: any, ...args: any[]) => any): void {
    this.pipes.set(name, transformFunction);
  }

  /**
   * Pipe'ı çalıştır
   * @param pipeName Pipe adı
   * @param value Değer
   * @param args Ek parametreler
   * @returns Dönüştürülmüş değer
   */
  transform(pipeName: string, value: any, ...args: any[]): any {
    const pipe = this.pipes.get(pipeName);
    if (pipe) {
      return pipe(value, ...args);
    }
    return value;
  }

  /**
   * Pipe kayıtlı mı kontrol et
   * @param pipeName Pipe adı
   * @returns Boolean
   */
  hasPipe(pipeName: string): boolean {
    return this.pipes.has(pipeName);
  }

  /**
   * Tüm kayıtlı pipe isimlerini getir
   * @returns Pipe isimleri dizisi
   */
  getRegisteredPipes(): string[] {
    return Array.from(this.pipes.keys());
  }

  /**
   * Pipe'ı kaldır
   * @param pipeName Pipe adı
   */
  unregisterPipe(pipeName: string): void {
    this.pipes.delete(pipeName);
  }

  /**
   * Varsayılan pipe'ları kaydet
   */
  private registerDefaultPipes(): void {
    // Boolean pipe
    this.registerPipe('boolean', (value: any, trueText: string = 'Evet', falseText: string = 'Hayır') => {
      return value ? trueText : falseText;
    });

    // Uppercase pipe
    this.registerPipe('uppercase', (value: any) => {
      return value ? value.toString().toUpperCase() : '';
    });

    // Lowercase pipe
    this.registerPipe('lowercase', (value: any) => {
      return value ? value.toString().toLowerCase() : '';
    });

    // Currency pipe (basit)
    this.registerPipe('currency', (value: any, currency: string = 'TL', symbol: string = '₺') => {
      if (value === null || value === undefined) return '';
      const numValue = parseFloat(value);
      return isNaN(numValue) ? value : `${numValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${symbol}`;
    });

    // Percentage pipe
    this.registerPipe('percentage', (value: any, digits: number = 2) => {
      if (value === null || value === undefined) return '';
      const numValue = parseFloat(value);
      return isNaN(numValue) ? value : `%${(numValue * 100).toFixed(digits)}`;
    });

    // Truncate text pipe
    this.registerPipe('truncateCustom', (value: any, length: number = 20, suffix: string = '...') => {
      if (!value) return '';
      const text = value.toString();
      return text.length > length ? text.substring(0, length) + suffix : text;
    });

    // Date format pipe (basit)
    this.registerPipe('dateFormat', (value: any, format: string = 'dd/MM/yyyy') => {
      if (!value) return '';
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;

      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      switch (format) {
        case 'dd/MM/yyyy':
          return `${day}/${month}/${year}`;
        case 'MM/dd/yyyy':
          return `${month}/${day}/${year}`;
        case 'yyyy-MM-dd':
          return `${year}-${month}-${day}`;
        default:
          return `${day}/${month}/${year}`;
      }
    });

    // Status pipe
    this.registerPipe('status', (value: any, activeText: string = 'Aktif', inactiveText: string = 'Pasif') => {
      return value ? activeText : inactiveText;
    });

    // Number format pipe
    this.registerPipe('numberFormat', (value: any, digits: number = 2) => {
      if (value === null || value === undefined) return '';
      const numValue = parseFloat(value);
      return isNaN(numValue) ? value : numValue.toLocaleString('tr-TR', { minimumFractionDigits: digits });
    });
  }
}
