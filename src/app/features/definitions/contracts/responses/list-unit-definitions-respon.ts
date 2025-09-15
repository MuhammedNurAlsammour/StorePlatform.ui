export interface ListUnitDefinitionsRespon {
  result: ResultUnitDefinitions[];
  refId:  number;
  id:          number;
  mesajBaslik: string;
  mesajIcerik: string;
  mesajDetay:  string;
}

export interface ResultUnitDefinitions {
  unitName:      string;
  customerId:    string;
  institutionId: number;
  description:   string;
  upperId:       string;
  unitManager:   string;
  id:            string;
  userId:string;
  createdAt:     Date;
  isActive:      number;
  leaveManager : string;
  unitManagerName:  string;
  leaveManagerName: string;
  leaveProcessId:            string;
  leaveProcessName:          string;
  advancePaymentProcessId:   string;
  adcancePaymentProcessName: string;
  taskProcessId:             string;
  taskProcessName:           string;
  overtimeProcessId:string;
  overtimeProcessName:string;

}

export interface ListUnitLowerRespon {
  result: ResultUpperUniteLower[];
  refId:  number;
}

export interface ResultUpperUniteLower {
  unitName:      string;
  customerId:    string;
  institutionId: number;
  description:   string;
  upperId:       string;
  unitManager:   string;
  id:            string;
  userId:string;
  createdAt:     Date;
  isActive:      number;
  leaveManager : string;
  unitManagerName:  string;
  leaveManagerName: string;
  leaveProcessId:            string;
  leaveProcessName:          string;
  advancePaymentProcessId:   string;
  adcancePaymentProcessName: string;
  taskProcessId:             string;
  taskProcessName:           string;
  overtimeProcessId:string;
  overtimeProcessName:string;
}


export interface ListUnitDefNameRes {
  result:      ResultName[];
  refId:       number;
}

export interface ResultName {
  id:       number ;
  unitName: string ;
}


export interface ListUnitDefUpperNameRes {
  result:      ResultUpper[];
  refId:       number;
}

export interface ResultUpper {
  id:       number ;
  unitName: string ;
}

























