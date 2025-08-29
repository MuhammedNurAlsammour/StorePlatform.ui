export interface DocumentTypeDefinitionResponse {
  result:      ResultDocumentTypeDefinition[];
  refId:       number;
  id:          number;
  mesajBaslik: string;
  mesajIcerik: string;
  mesajDetay:  string;
}

export interface ResultDocumentTypeDefinition {
  name:            string;
  customerId:      string;
  customerName:    string;
  institutionId:   string;
  institutionName: string;
  createdUserId:   string;
  updatedAt:       null;
  updatedUserId:   null;
  id:              string;
  createdAt:       Date;
  isActive:        number;
}




















