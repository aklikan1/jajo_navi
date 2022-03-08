import {ProductsIncome} from "./productsIncome";

export interface GetEmporium {
  id: number;
  name: string;
  isSunday: boolean;
  productsIncome: ProductsIncome;
}

export interface PostEmporium {
  id: number;
  name: string;
  isSunday: boolean;
  productsIncome: ProductsIncome;
}
