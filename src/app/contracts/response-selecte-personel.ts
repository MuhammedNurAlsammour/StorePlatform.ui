export interface ListpersonelSelecteRespon {
  result:      ResultSelecte[];
  refId:       number;
}

export interface ResultSelecte {
  firstName:     string;
  lastName:      string;
  employeeId:    string;
  employeeIds:   string[];
}

