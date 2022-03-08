export interface GetPayment {
  id: number;
  paymentEgg: number;
  costEgg: number;
  paymentHoney: number;
  costHoney: number;
  totalPayment: number;
  totalCost: number;
}

export interface PostPayment {
  id: number;
  paymentEgg: number;
  costEgg: number;
  paymentHoney: number;
  costHoney: number;
}
