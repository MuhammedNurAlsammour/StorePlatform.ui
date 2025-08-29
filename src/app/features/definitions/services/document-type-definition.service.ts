import { Injectable } from '@angular/core';
import { BaseService } from '@coder-pioneers/shared';
import { HttpClientService } from '@coder-pioneers/shared';
import { BaseResponses } from '@coder-pioneers/shared';
import { AlertService } from '@coder-pioneers/shared';
import { RequestDocumentTypeDefinition } from '../contracts/requests/request-document-type-definition';
import { DocumentTypeDefinitionResponse } from '../contracts/responses/document-type-definition-response';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeDefinitionService extends BaseService<
  DocumentTypeDefinitionResponse,
  RequestDocumentTypeDefinition,
  RequestDocumentTypeDefinition,
  BaseResponses> {
  constructor(
    httpClientService: HttpClientService,
    alertService: AlertService
  ) {
    super(httpClientService, alertService, {
      controller: 'DocumentType',
      defaultActions: {
        list: 'GetDocumentTypeList',
        insert: 'InsertDocumentType',
        update: 'UpdateDocumentType',
      },
    });
  }
}




















