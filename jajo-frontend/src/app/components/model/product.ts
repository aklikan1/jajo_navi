export interface GetProduct {
  id: number;
  name: string;
  price: number;
  cost: number;
  hierarchy: number;
  name_readonly: boolean;
  price_readonly: boolean;
  cost_readonly: boolean;
}

export interface PostProduct {
  id: number;
  name: string;
  price: number;
  cost: number;
  hierarchy: number;
}
