export interface TypeOfResignationResponse {
  result:      ResultTypeOfResignation[];
  refId:       number;
  id:          number;
  mesajBaslik: string;
  mesajIcerik: string;
  mesajDetay:  string;
}

export interface ResultTypeOfResignation {
  id:string;
  typeName:string;
  customerId: string;
}






















