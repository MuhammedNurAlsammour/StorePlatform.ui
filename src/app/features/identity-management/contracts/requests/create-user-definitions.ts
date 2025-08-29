import { Base_Contract } from '@coder-pioneers/shared';

export class Create_User_Definitions extends Base_Contract {
   phone: string | undefined;
   fullName: string | undefined;
   userRoleId: number | undefined;
   nameSurname:     string | undefined;
   username:        string | undefined;
   email:           string | undefined;
   phoneNumber:     string | undefined;
   password:        string | undefined;
   passwordConfirm: string | undefined;
}



export class Create_User_employeeId extends Base_Contract {
}

export class Respon_User_Definitions  {
  title:   string | undefined;
  status:  number | undefined;
  message: string | undefined;
  userId: string | undefined;
}


export class RequestUserDefinitions extends Base_Contract {
  phone: string | undefined;
  fullName: string | undefined;
  userRoleId: number | undefined;
  nameSurname:     string | undefined;
  username:        string | undefined;
  email:           string | undefined;
  phoneNumber:     string | undefined;
  password:        string | undefined;
  passwordConfirm: string | undefined;
}




















