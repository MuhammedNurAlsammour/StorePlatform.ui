export interface ResponseIdAndNamesUpperUnite {
  result: ResultUpperUnite[];
  refId:  number;
}

export interface ResultUpperUnite {
  id:       string;
  unitName: string;
}

export interface ResponseIdAndNamesUnite {
  result: ResultUnite[];
  refId:  number;
}

export interface ResultUnite {
  id:       string;
  unitName: string;
}



export interface ResponseIdAndNameUnite {
  result:      ResultUnite;
  refId:       number;
  id:          number;
  mesajBaslik: string;
  mesajIcerik: string;
  mesajDetay:  string;
}

export interface ResultUnite {
  employeeId: string;
  firstName:  string;
  lastName:   string;
}




















