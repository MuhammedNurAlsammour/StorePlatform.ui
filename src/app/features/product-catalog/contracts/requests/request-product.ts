import { Base_Contract, Status } from '@coder-pioneers/shared';

export class RequestProduct extends Base_Contract {
  name:                 string | undefined | null;
  description:          string | undefined | null;
  price:                number | undefined | null;
  stock:                number | undefined | null;
  categoryId:           string | undefined | null;
  productId:            string | undefined | null;
  hasInventoryTracking: boolean | undefined | null;
  defaultLocation:      string | undefined | null;
  barcode:              string | undefined | null;
  qrCode:               string | undefined | null;
}


















