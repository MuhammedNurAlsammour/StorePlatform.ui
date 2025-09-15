import { Base_Contract } from '@coder-pioneers/shared';

export class RequestCategory extends Base_Contract {
  name: string | undefined;
  description: string | undefined;
  parentId: string | undefined;
  icon: string | undefined;
  sortOrder: number | undefined;
  createUserId: string | undefined;
}

