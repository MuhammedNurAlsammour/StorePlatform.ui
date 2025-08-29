export interface PersonnelManagersPanelResponse {
  result:      ResultPersonnelManagersPanel[];
  refId:       number;
  id:          number;
  mesajBaslik: string;
  mesajIcerik: string;
  mesajDetay:  string;
}

export interface ResultPersonnelManagersPanel {
  id:                        string;
  employeeId:                        string;
  userId:                    string;
  gender:                    number;
  firstName:                 string;
  lastName:                  string;
  idNumber:                  string;
  bloodType:                 number;
  martialStatus:             number;
  photo:                     string;
  startDate:                 Date;
  departureDate:             Date;
  status:                    number;
  isActive:                  number;
  fileNumber:                string;
  ibanNumber:                string;
  workPlaceAdress:           string;
  personalAdress:            string;
  driverLicense:             boolean;
  departureDescription:      string;
  departureType:             number;
  leaveProcessId:            string;
  leaveProcessName:          string;
  advancePaymentProcessId:   string;
  advancePaymentProcessName: string;
  taskProcessId:             string;
  taskProcessName:           string;
  customerId:                string;
  dateOfBirth?:               Date | null;
  numberOfChildren:          number;
  workPlaceCityId:           string;
  workPlaceCity:             string;
  personalCityId:            string;
  personalCity:              string;
  personalDistrictId:        string;
  personalDistrict:          string;
  disabilityStatus:          number;
  institutionId:             string;
  institutionName:           string;
  unitId:                    string;
  unitName:                  string;
  unitManager:               null;
  titleId:                   string;
  titleName:                 string;
  institutionStartDate?:      Date;
  institutionDepartureDate:  Date;
  workTime?:                  string;
  phone:                     string;
  workPhone:                 string;
  relativePhone?:             string | null;
  email?:                     string;
  educationStatus:           number;
  provinceId:                string;
  provinceName:              string;
  universityId:              string;
  universityName:            string;
  facultyName:               string;
  durationOfEducation:       number;
  highscoolName:             string;
  employeeIds:               string[];
}





















