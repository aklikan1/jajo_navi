import {GetAddress} from "./address";
import {GetEmporium} from "./emporium";
import {GetProduct} from "./product";

export interface GetTransport {
  id: number;
  address: GetAddress;
  emporium: GetEmporium;
  message: string;
  time: string;
  addButton: boolean;
  actualProducts: GetProduct[];
  availableProducts: GetProduct[];
  isSent: boolean;
}

export interface PostTransport {
  id: number;
  address: GetAddress;
  emporium: GetEmporium;
  time: string;
  isSent: boolean;
}
