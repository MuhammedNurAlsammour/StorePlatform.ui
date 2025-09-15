export interface TicketPaymentResponse {
  result:      ResultTicketPayment[];
  refId:       number;
  id:          number;
  mesajBaslik: string;
  mesajIcerik: string;
  mesajDetay:  string;
}

export interface ResultTicketPayment {
  id:         string;
  year:       number;
  month:      number;
  mealPrice:  number;
  customerId: string;
}























