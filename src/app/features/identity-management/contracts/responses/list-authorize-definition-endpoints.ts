export interface ListAuthorizeDefinitionEndpoints {
  name:    string;
  actions: Action[];
}

export interface Action {
  actionType: ActionType;
  httpType:   HTTPType;
  definition: string;
  code:       string;
}

export enum ActionType {
  Deleting = 'Deleting',
  Reading = 'Reading',
  Updating = 'Updating',
  Writing = 'Writing',
}

export enum HTTPType {
  Delete = 'DELETE',
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
}























