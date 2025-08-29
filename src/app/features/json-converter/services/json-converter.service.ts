import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonConverterService {

  constructor() { }

  /**
   * JSON'u TypeScript koduna dönüştür - Global approach
   */
  convertJsonToTypeScript(jsonData: any): string {
    // Global interface generation - herhangi bir JSON için çalışır
    return this.generateGlobalTypeScript(jsonData);
  }

  /**
   * Global TypeScript interface generator - herhangi bir JSON için çalışır
   */
  private generateGlobalTypeScript(jsonData: any): string {
    // Detect if it's an API response pattern
    if (this.isApiResponsePattern(jsonData)) {
      return this.generateApiResponseTypeScript(jsonData);
    }

    // Fallback to generic interface generation
    return this.generateGenericTypeScript(jsonData, 'RootInterface');
  }

  /**
   * API Response pattern için TypeScript kodu oluştur
   */
  private generateApiResponseTypeScript(jsonData: any): string {
    let code = `import { ApiResponse, BaseResponse } from '@contracts/interfaces/responses/base-response';\n\n`;

    // Ana response type'ını belirle
    const responseTypeName = this.detectResponseType(jsonData);
    const dataTypeName = `${responseTypeName}Data`;
    const itemTypeName = this.detectItemType(jsonData);

    // Response type
    code += `// ${responseTypeName} için ApiResponse kullanıyoruz\n`;
    code += `export type ${responseTypeName} = ApiResponse<${dataTypeName}>;\n\n`;

    // Data interface
    code += `// ${this.getDataTypeDescription(jsonData)} için data interface\n`;
    code += `export interface ${dataTypeName} {\n`;

    if (jsonData.result) {
      Object.keys(jsonData.result).forEach(key => {
        const value = jsonData.result[key];
        if (Array.isArray(value)) {
          code += `  ${key}: ${itemTypeName}[];\n`;
        } else {
          code += `  ${key}: ${this.getTypeScriptType(value)};\n`;
        }
      });
    }

    code += `}\n\n`;

    // Item interface (if array exists)
    const arrayField = this.findArrayField(jsonData.result);
    if (arrayField && arrayField.items.length > 0) {
      code += `// ${itemTypeName} BaseResponse'tan extend ediyor\n`;
      code += `export interface ${itemTypeName} extends BaseResponse {\n`;

      const sampleItem = arrayField.items[0];
      Object.keys(sampleItem).forEach(key => {
        if (!this.isBaseResponseField(key)) {
          const value = sampleItem[key];
          const fieldType = this.getTypeScriptType(value, key);
          code += `  ${key}: ${fieldType};\n`;
        }
      });

      code += `}\n`;
    }

    return code;
  }

  /**
   * API Response pattern olup olmadığını kontrol et
   */
  private isApiResponsePattern(data: any): boolean {
    return data &&
           typeof data === 'object' &&
           data.result &&
           data.operationResult &&
           typeof data.operationStatus === 'boolean' &&
           typeof data.statusCode === 'number';
  }

  /**
   * Response type'ını tespit et
   */
  private detectResponseType(data: any): string {
    if (!data.result) return 'ApiResponse';

    const arrayField = this.findArrayField(data.result);
    if (arrayField) {
      const fieldName = arrayField.name;
      if (fieldName.includes('product')) return 'ProductResponse';
      if (fieldName.includes('categor')) return 'CategoriesResponse';
      if (fieldName.includes('user')) return 'UsersResponse';
      if (fieldName.includes('order')) return 'OrdersResponse';

      // Generic name based on field
      const baseName = fieldName.replace(/s$/, ''); // Remove plural 's'
      return this.capitalizeFirstLetter(baseName) + 'Response';
    }

    return 'ApiResponse';
  }

  /**
   * Item type'ını tespit et
   */
  private detectItemType(data: any): string {
    const arrayField = this.findArrayField(data.result);
    if (arrayField) {
      const fieldName = arrayField.name;
      if (fieldName.includes('product')) return 'ProductResult';
      if (fieldName.includes('categor')) return 'CategoryResult';
      if (fieldName.includes('user')) return 'UserResult';
      if (fieldName.includes('order')) return 'OrderResult';

      // Generic name based on field
      const baseName = fieldName.replace(/s$/, ''); // Remove plural 's'
      return this.capitalizeFirstLetter(baseName) + 'Result';
    }

    return 'ItemResult';
  }

  /**
   * Array field'ını bul
   */
  private findArrayField(obj: any): { name: string, items: any[] } | null {
    if (!obj) return null;

    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value) && value.length > 0) {
        return { name: key, items: value };
      }
    }
    return null;
  }

  /**
   * Data type açıklaması
   */
  private getDataTypeDescription(data: any): string {
    const arrayField = this.findArrayField(data.result);
    if (arrayField) {
      const fieldName = arrayField.name;
      if (fieldName.includes('product')) return 'Ürün listesi';
      if (fieldName.includes('categor')) return 'Kategori listesi';
      if (fieldName.includes('user')) return 'Kullanıcı listesi';
      if (fieldName.includes('order')) return 'Sipariş listesi';
      return `${fieldName} listesi`;
    }
    return 'Veri listesi';
  }

  /**
   * BaseResponse field'ı olup olmadığını kontrol et
   */
  private isBaseResponseField(fieldName: string): boolean {
    const baseFields = [
      'id', 'authUserId', 'authUserName', 'authCustomerId', 'authCustomerName',
      'rowCreatedDate', 'rowUpdatedDate', 'rowIsActive', 'rowIsDeleted',
      'customerId'
    ];
    return baseFields.includes(fieldName);
  }



  /**
   * Değeri formatla - null/undefined için null döndür
   */
  private formatValue(value: any): string {
    if (value === null || value === undefined) {
      return 'null';
    }
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    return String(value);
  }

  /**
   * Genel JSON için TypeScript interface oluştur
   */
  private generateGenericTypeScript(obj: any, interfaceName: string = 'GeneratedInterface'): string {
    let code = `// Otomatik oluşturulan TypeScript interface\n\n`;

    code += this.generateInterface(obj, interfaceName);

    // Data tanımı
    code += `\n// Örnek veri\n`;
    code += `const sampleData: ${interfaceName} = ${JSON.stringify(obj, null, 2)};\n`;

    return code;
  }

  /**
   * Nesne için interface oluştur
   */
  private generateInterface(obj: any, interfaceName: string, depth: number = 0): string {
    if (obj === null || obj === undefined) {
      return `${interfaceName}: any;\n`;
    }

    const indent = '  '.repeat(depth);
    let code = `${indent}interface ${interfaceName} {\n`;

    for (const [key, value] of Object.entries(obj)) {
      const fieldType = this.getTypeScriptType(value, key, depth + 1);
      code += `${indent}  ${key}: ${fieldType};\n`;
    }

    code += `${indent}}\n`;
    return code;
  }

  /**
   * JavaScript değeri için TypeScript tipi belirle
   */
  private getTypeScriptType(value: any, key: string = '', depth: number = 0): string {
    if (value === null || value === undefined) {
      return 'null';
    }

    const type = typeof value;

    switch (type) {
      case 'string':
        // Tarih kontrolü
        if (this.isDateString(value)) {
          return 'Date';
        }
        return 'string';

      case 'number':
        return 'number';

      case 'boolean':
        return 'boolean';

      case 'object':
        if (Array.isArray(value)) {
          if (value.length > 0) {
            const firstItemType = this.getTypeScriptType(value[0], '', depth);
            return `${firstItemType}[]`;
          }
          return 'any[]';
        }

        // Nested object için interface oluştur
        {
          const interfaceName = this.capitalizeFirstLetter(key) + 'Type';
          return interfaceName;
        }

      default:
        return 'any';
    }
  }

  /**
   * String'in tarih olup olmadığını kontrol et
   */
  private isDateString(value: string): boolean {
    // ISO 8601 tarih formatı kontrolü
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3,})?Z?$/;
    return dateRegex.test(value) && !isNaN(Date.parse(value));
  }

  /**
   * İlk harfi büyük yap
   */
  private capitalizeFirstLetter(str: string): string {
    if (!str) return 'Unknown';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }



  /**
   * TypeScript kodunu güzelleştir
   */
  private beautifyTypeScript(code: string): string {
    // Basit beautification
    return code
      .replace(/{\s+/g, '{\n  ')
      .replace(/;\s+/g, ';\n  ')
      .replace(/}\s+/g, '\n}\n');
  }
}






