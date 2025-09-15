export interface UpdateRoleEndpoint {
  customerId:    string;
  institutionId: string;
  role:  string;
  menus: Menu[];
}

export interface Menu {
  menu:  string;
  codes: string[];
}























