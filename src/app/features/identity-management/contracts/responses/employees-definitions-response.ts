export interface EmployeesDefinitionsResponse {
  // Genel Bilgiler
  gender?: number | null;
  firstName: string;
  lastName: string;
  idNumber: string;
  status: number;
  startDate: Date;
  departureDate?: Date | null;
  bloodType?: number | null;
  martialStatus: number;
  userId?: string | null;

  // Özlük Bilgiler
  customerId: string;
  fileNumber?: string | null;
  ibanNumber?: string | null;
  workPlaceAdress?: string | null;
  personalAdress?: string | null;
  educationStatus: number;
  driverLicense: boolean;
  leaveProcessId?: string | null;
  advancePaymentProcessId?: string | null;
  taskProcessId?: string | null;
  createUserId: string;
  workPlaceCityId?: string | null;
  personalCityId?: string | null;
  institutionId: string;
  unitId: string;
  titleId: string;
  isActive: number;

  // İletişim Bilgiler
  phone?: string | null;
  workPhone?: string | null;
  relativePhone?: string | null;
  email?: string | null;

  // Eğitim Bilgiler
  schoolName: string;
  faculty: string;
  department: string;
  graduationDate: Date;
  educationTime: string;
  education: string;
  institutionStartDate: Date;
  institutionDepartureDate?: Date | null;
}























