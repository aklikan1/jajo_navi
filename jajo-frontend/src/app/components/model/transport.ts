import {GetAddress} from "./address";
import {Time} from "@angular/common";
import {GetEmporium} from "./emporium";
import {GetMessage} from "./message";
import {GetProduct} from "./product";
import {DateTime} from "luxon";

export interface GetTransport {
  id: number;
  address: GetAddress;
  emporium: GetEmporium;
  message: GetMessage;
  time: string;
  addButton: boolean;
  actualProducts: GetProduct[];
  availableProducts: GetProduct[];
}

export interface PostTransport {
  id: number;
  address: GetAddress;
  emporium: GetEmporium;
  time: string;
  message: GetMessage;
}
