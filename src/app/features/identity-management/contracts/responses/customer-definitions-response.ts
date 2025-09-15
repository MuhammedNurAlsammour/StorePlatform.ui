
export interface CustomerDefinitionsResponse {
  datas:      ResultCustomerDefinitions[];
  totalCount: number;
}

export interface ResultCustomerDefinitions {
  name:           string;
  logo:           string;
  address:        string;
  phoneNumber:    string;
  email:          string;
  webSite:        string;
  description:    string;
  country:        string;
  city:           string;
  county:         string;
  users:          string;
  id:             string;
  rowCreatedDate: Date;
  rowUpdatedDate: Date;
  rowIsActive:    boolean;
  rowIsDeleted:   boolean;
}























