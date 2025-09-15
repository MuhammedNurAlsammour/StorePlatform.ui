export interface ListInstitutionDefinitionsRes {
  result: Result[];
  refId:  number;
}

export interface Result {
  institutionName: string;
  id:              string;
  customerId:      number;
  provinceId:      string;
  districtId:      string;
  countryId:       string;
  isActive:        number;
  description:    string;
  provinceName: string;
  districtName: string;
  countryName:  string;
  workDayNumber:number;
  foodCost: number;
  commuteCost:number;
  taxNumber:string;
  sskWorkplaceNumber:string;
  sskBranch:string;
}






















