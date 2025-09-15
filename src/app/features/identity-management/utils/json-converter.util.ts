// Interface tanımları
export interface Action {
  actionType: string;
  httpType: string;
  definition: string;
  code: string;
}

export interface Menu {
  name: string;
  actions: Action[];
}

export interface ConvertedMenu {
  menu: string;
  codes: string[];
}

export interface AssignEndpointsToRoleRequest {
  role: string;
  institutionId: string;
  customerId: string;
  menus: ConvertedMenu[];
}

/**
 * JSON formatını dönüştürür
 * @param inputData - Giriş JSON verisi
 * @returns Dönüştürülmüş menus array
 */
export function convertJsonToMenusFormat(inputData: Menu[]): ConvertedMenu[] {
  return inputData.map(item => ({
    menu: item.name,
    codes: item.actions.map(action => action.code)
  }));
}

/**
 * Tam request object oluşturur
 * @param role - Role adı
 * @param institutionId - Institution ID
 * @param customerId - Customer ID
 * @param inputData - Menu verisi
 * @returns Tam request object
 */
export function createAssignEndpointsRequest(
  role: string,
  institutionId: string,
  customerId: string,
  inputData: Menu[]
): AssignEndpointsToRoleRequest {
  return {
    role,
    institutionId: institutionId.trim(), // Boşlukları temizle
    customerId: customerId.trim(), // Boşlukları temizle
    menus: convertJsonToMenusFormat(inputData)
  };
}

/**
 * Örnek kullanım için test fonksiyonu
 */
export function createSampleRequest(): AssignEndpointsToRoleRequest {
  return createAssignEndpointsRequest(
    'SuperAdmin',
    '17b48d1e-54a6-42c5-8c20-e2a523dfc1ac',
    '72c54b1a-8e1c-45ea-8edd-b5da1091e325',
    sampleInputData
  );
}

/**
 * Örnek veri
 */
export const sampleInputData: Menu[] = [
  {
    name: 'AuthorizationEndpoints',
    actions: [
      {
        actionType: 'Writing',
        httpType: 'POST',
        definition: 'Assign Role Endpoint',
        code: 'POST.Writing.AssignRoleEndpoint'
      }
    ]
  },
  {
    name: 'Customers',
    actions: [
      {
        actionType: 'Reading',
        httpType: 'GET',
        definition: 'Get All Customers',
        code: 'GET.Reading.GetAllCustomers'
      },
      {
        actionType: 'Reading',
        httpType: 'GET',
        definition: 'Get Customer By Id',
        code: 'GET.Reading.GetCustomerById'
      },
      {
        actionType: 'Writing',
        httpType: 'POST',
        definition: 'Create Customer',
        code: 'POST.Writing.CreateCustomer'
      },
      {
        actionType: 'Updating',
        httpType: 'PUT',
        definition: 'Update Customer',
        code: 'PUT.Updating.UpdateCustomer'
      },
      {
        actionType: 'Deleting',
        httpType: 'DELETE',
        definition: 'Remove Customer',
        code: 'DELETE.Deleting.RemoveCustomer'
      }
    ]
  },
  {
    name: 'Roles',
    actions: [
      {
        actionType: 'Reading',
        httpType: 'GET',
        definition: 'Get Roles',
        code: 'GET.Reading.GetRoles'
      },
      {
        actionType: 'Reading',
        httpType: 'GET',
        definition: 'Get Role By Id',
        code: 'GET.Reading.GetRoleById'
      },
      {
        actionType: 'Reading',
        httpType: 'GET',
        definition: 'Get Role Permissions',
        code: 'GET.Reading.GetRolePermissions'
      },
      {
        actionType: 'Writing',
        httpType: 'POST',
        definition: 'Create Role',
        code: 'POST.Writing.CreateRole'
      },
      {
        actionType: 'Updating',
        httpType: 'PUT',
        definition: 'Update Role',
        code: 'PUT.Updating.UpdateRole'
      },
      {
        actionType: 'Deleting',
        httpType: 'DELETE',
        definition: 'Delete Role',
        code: 'DELETE.Deleting.DeleteRole'
      }
    ]
  },
  {
    name: 'Users',
    actions: [
      {
        actionType: 'Reading',
        httpType: 'GET',
        definition: 'Get All Users',
        code: 'GET.Reading.GetAllUsers'
      },
      {
        actionType: 'Reading',
        httpType: 'GET',
        definition: 'Get User By Id',
        code: 'GET.Reading.GetUserById'
      },
      {
        actionType: 'Reading',
        httpType: 'POST',
        definition: 'Assign Role To User',
        code: 'POST.Reading.AssignRoleToUser'
      }
    ]
  }
];






















