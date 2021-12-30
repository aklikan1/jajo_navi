import {GetProduct} from "./product";
import {GetTransport} from "./transport";

export interface GetCount {
  id: number;
  count: number;
  transport: GetTransport;
  product: GetProduct;
  readonly: boolean;
}

export interface PostCount {
  count: number;
  transport: GetTransport;
  product: GetProduct;
}
