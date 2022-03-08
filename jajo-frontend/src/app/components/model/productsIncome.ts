import {GetEmporium} from "./emporium";
import {TakeProduct} from "./takeProduct";

export interface ProductsIncome {
  id: number;
  incomeMoney: number;
  izaMoney: number;
  emporium: GetEmporium;
  takeProducts: TakeProduct[];
}
