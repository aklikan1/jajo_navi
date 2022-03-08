import {GetProduct} from "./product";
import {GetTransport} from "./transport";

export interface GetCount {
  id: number;
  count: number;
  transport: GetTransport;
  product: GetProduct;
  readonly: boolean;
  liquid: number;
}

export interface PostCount {
  count: number;
  liquid: number;
  transport: GetTransport;
  product: GetProduct;
}
