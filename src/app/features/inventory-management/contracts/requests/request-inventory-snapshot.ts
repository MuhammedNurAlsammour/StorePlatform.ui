import { Base_Contract } from '@contracts/interfaces/requests/base-contract';

export class RequestInventorySnapshot extends Base_Contract {
  groupByProduct?: boolean = false;
  getLatestOnly?: boolean = false;
  specificDate?: Date;
  startDate?: Date;
  endDate?: Date;
}
