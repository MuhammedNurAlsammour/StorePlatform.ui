export interface ListUserDefinitionsRes {
  result: Result[];
  refId:  number;
}

export interface Result {
  id:          string;
  username:    string;
  email:       string;
  fullName:    string;
  phone:       string;
  password:    string;
  firstName:   string;
  lastName:    string;
  customerId:  string;
  employeeId: string;
  userRoleId:  number;
  createdAt:   Date;
  isActive:    number;
}




export interface ListUserDefAuthRes {
  result:      ResultUser[];
  refId:       number;
  id:          number;
  mesajBaslik: string;
  mesajIcerik: string;
  mesajDetay:  string;
}

export interface ResultUser {
  id:               string;
  email:            string;
  phoneNumber:      string;
  nameSurname:      string;
  userName:         string;
  customerName:     string;
  twoFactorEnabled: boolean;
  roleName:         string;
  unitName:         string;
  isActive:boolean;
}

export interface ListUser {
  id:               string;
  email:            string;
  phoneNumber:     string;
  nameSurname:      string;
  userName:         string;
  userRole:         null;
  twoFactorEnabled: boolean;
}




















