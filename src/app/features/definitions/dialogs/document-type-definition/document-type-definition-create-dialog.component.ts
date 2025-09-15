import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialDialogModule } from '@coder-pioneers/shared';
import { AlertService } from '@coder-pioneers/shared';
import { RequestDocumentTypeDefinition } from '@features/definitions/contracts/requests/request-document-type-definition';
import { DocumentTypeDefinitionService } from '@features/definitions/services/document-type-definition.service';
import { BaseDialogComponent, FormFieldConfig } from '@coder-pioneers/shared';
import { CoderBaseDialogComponent } from '@coder-pioneers/shared';
import { NgxSpinnerService } from 'ngx-spinner';
import { MY_FORMATS } from '@shared/pipes/date-format';
import { ResultSelecte } from '@contracts/response-selecte-personel';


@Component({
  selector: 'app-document-type-definition',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MaterialDialogModule
  ],
  templateUrl: './document-type-definition-create-dialog.component.html',
  styleUrl: './document-type-definition-create-dialog.component.scss',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DocumentTypeDefinitionCreateDialogComponent
  extends CoderBaseDialogComponent<DocumentTypeDefinitionCreateDialogComponent>
  implements OnInit {
  frm!: FormGroup;
  fields: FormFieldConfig[] = [];
  isFormVisible: boolean = false;
  Personels: ResultSelecte[] = [];
  hascearte:boolean= false;

  constructor(
    dialogRef: MatDialogRef<DocumentTypeDefinitionCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestDocumentTypeDefinition,
    alertService: AlertService,
    spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private documentTypeDefinitionService: DocumentTypeDefinitionService,
  )
  {
    super(dialogRef, spinner, alertService);
    this.dialogTitle = 'Doküman İşlemleri';
    this.titleIcon = 'approval';
    this.initializeFields();
    this.initializeForm();
  }

  // #region Form İşlemleri
  private initializeForm(): void {
    const customerId = sessionStorage.getItem('customerId') || null;
    const institutionId = sessionStorage.getItem('institutionId') || null;
    const userId = sessionStorage.getItem('userId');

    this.frm = this.formBuilder.group({
      id: [null],
      customerId: [customerId],
      institutionId: [institutionId],
      updateUserId: [userId],
      isActive: [1],
      name: [null, [Validators.required, Validators.maxLength(50)]],
    });
    if (this.data?.name) {  
      this.frm.patchValue(this.data);
    }
  }

  ngOnInit() {}

  private initializeFields() {
    this.fields = [
      {
        name: 'name',
        label: 'Doküman Adı',
        type: 'text',
        required: true,
        maxLength: 50,
        col: 12
      }
    ];
  }

  get frmControls() {
    return this.frm?.controls;
  }

  override onSubmit(requestDocumentTypeDefinition: RequestDocumentTypeDefinition)  {
    const numericId = this.data?.id || undefined;

    this.submitForm(
      (data) => this.documentTypeDefinitionService.create(data),
      (data) => this.documentTypeDefinitionService.update(data),
      requestDocumentTypeDefinition,
      numericId
    );
  }
}























