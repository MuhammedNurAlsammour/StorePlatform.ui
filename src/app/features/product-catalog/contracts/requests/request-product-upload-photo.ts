import { Base_Contract } from '@contracts/interfaces/requests/base-contract';

export class RequestProductUploadPhoto extends Base_Contract {
  productId: string | undefined | null;
  photoPath: string | undefined | null;
  photoBase64: string | undefined | null;
}



