import { Base_Contract } from '@coder-pioneers/shared';

export class RequestEmployeesDefinitions extends Base_Contract {
  // Genel Bilgiler
  gender?: number | null;
  firstName!: string;
  lastName!: string;
  idNumber!: string;
  status!: number;
  startDate!: Date;
  departureDate?: Date | null;
  bloodType?: number | null;
  martialStatus!: number;
  institutionStartDate!: Date;
  institutionDepartureDate?: Date | null;
  specialCase: boolean | undefined;

  // Özlük Bilgiler
  fileNumber?: string | null;
  ibanNumber?: string | null;
  workPlaceAdress?: string | null;
  personalAdress?: string | null;
  driverLicense!: boolean;
  leaveProcessId?: string | null;
  overtimeProcessId?: string | null;
  advancePaymentProcessId?: string | null;
  taskProcessId?: string | null;
  createUserId!: string;
  workPlaceCityId?: string | null;
  personalCityId?: string | null;
  unitId!: string;
  titleId!: string;
  disabilityStatus!: number;

  // İletişim Bilgiler
  phone?: string | null;
  workPhone?: string | null;
  relativePhone?: string | null;
  email?: string | null;

  // Eğitim Bilgiler
  educationStatus:          number | undefined;
  provinceId:               string | undefined;
  universityId:             string | undefined;
  facultyName:              string | undefined;
  durationOfEducation:      number | undefined;
  highscoolName:string | undefined;

  selectedTab:        number | undefined;

}




















