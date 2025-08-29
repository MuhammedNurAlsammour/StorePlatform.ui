import { Base_Contract } from '@contracts/interfaces/requests/base-contract';

export class RequestOrderItems extends Base_Contract {
  orderId: string | undefined;
  productId: string | undefined;
  quantity: number | undefined;
  price: number | undefined;
}






