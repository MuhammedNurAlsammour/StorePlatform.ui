import { Base_Contract } from '@coder-pioneers/shared';

export class RequestBusinesses extends Base_Contract {
  createUserId: string | undefined;
  name: string | undefined;
  description: string | undefined;
  subDescription: string | undefined;
  categoryId: string | undefined;
  subCategoryId: string | undefined;
  provinceId: string | undefined;
  countriesId: string | undefined;
  districtId: string | undefined;
  address: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  phone: string | undefined;
  mobile: string | undefined;
  email: string | undefined;
  website: string | undefined;
  facebookUrl: string | undefined;
  instagramUrl: string | undefined;
  whatsApp: string | undefined;
  telegram: string | undefined;
  primaryContactType1: number | undefined;
  primaryContactValue1: string | undefined;
  primaryContactType2: number | undefined;
  primaryContactValue2: string | undefined;
  subscriptionType: number | undefined;
  isVerified: boolean | undefined;
  isFeatured: boolean | undefined;
  workingHours: string | undefined;
  icon: string | undefined;
  ownerId: string | undefined;
}
