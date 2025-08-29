import { Status } from '@coder-pioneers/shared';

export class RequestUnitDefinitions{
  id: string | undefined;
  createdAt: Date | undefined;
  isActive:Status | undefined;
  userId: string | undefined| null;
  updateUserId: string | undefined;
  customerId: string | undefined ;
  institutionId:number | undefined | null;
  unitName:string | undefined;
  description:string | undefined;
  upperId:string | undefined;
  unitManager:string | undefined;
  leaveManager:string | undefined;
  leaveProcessId:string | undefined;
  advancePaymentProcessId: string | undefined;
  overtimeProcessId:string | undefined;
  overtimeProcessName:string | undefined;
  taskProcessId:string | undefined;
  Active:boolean | undefined;
}




















