export interface CartResponse {
  result:          CartResult;
  operationResult: OperationResult;
  refId:           null;
  operationStatus: boolean;
  statusCode:      number;
}

export interface OperationResult {
  referenceId:    number;
  messageTitle:   string;
  messageContent: string;
  messageDetail:  string;
  result:         number;
}

export interface CartResult {
  totalCount: number;
  cart:       ResultCart[];
}

export interface ResultCart {
  productId:              string;
  quantity:               number;
  price:                  number;
  id:                     string;
  authUserId:             string;
  customerId:             string;
  authCustomerId:         string;
  rowCreatedDate:         Date;
  rowUpdatedDate:         Date;
  rowIsActive:            boolean;
  rowIsDeleted:           boolean;
  rowActiveAndNotDeleted: boolean;
  rowIsNotDeleted:        boolean;
}











