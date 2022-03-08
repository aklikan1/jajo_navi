import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../base-url.service";
import {Observable} from "rxjs";
import {GetAddress} from "../../model/address";
import {GetProduct} from "../../model/product";
import {GetTransport} from "../../model/transport";
import {GetEmporium} from "../../model/emporium";
import {GetCount} from "../../model/count";
import {GetMessage} from "../../model/message";
import {GetPayment} from "../../model/payment";

@Injectable({
  providedIn: 'root'
})
export class GetApiService {

  private GET_ALL_ADDRESSES = `${this.baseUrl.baseUrl}\\address`;
  private GET_AVAILABLE_ADDRESSES = `${this.GET_ALL_ADDRESSES}\\available\\emporium\\`;
  private GET_ALL_PRODUCTS = `${this.baseUrl.baseUrl}\\products`;
  private GET_ALL_TRANSPORTS = `${this.baseUrl.baseUrl}\\transport`;
  private GET_ALL_TRANSPORTS_BY_EMPORIUM_ID = `${this.baseUrl.baseUrl}\\transport\\emporium\\`;
  private GET_ALL_EMPORIUMS = `${this.baseUrl.baseUrl}\\emporium`;
  private GET_ALL_COUNTS_BY_EMPORIUM_ID = `${this.baseUrl.baseUrl}\\count\\emporium\\`;
  private GET_ALL_MESSAGES = `${this.baseUrl.baseUrl}\\message`;
  private GET_ALL_PAYMENTS_BY_EMPORIUM_ID = `${this.baseUrl.baseUrl}\\payment\\emporium\\`;
  private GET_PRODUCTS_INCOME_BY_EMPORIUM_ID = `${this.baseUrl.baseUrl}\\productsIncome\\emporium\\`;

  constructor(private http: HttpClient, private baseUrl: BaseUrlService) { }

  //FUNCTIONS

  getAllAddresses () : Observable<GetAddress[]> {
    return this.http.get<GetAddress[]>(this.GET_ALL_ADDRESSES);
  }

  getAvailableAddresses (id: number) : Observable<GetAddress[]> {
    return this.http.get<GetAddress[]>(this.GET_AVAILABLE_ADDRESSES+id);
  }

  getAllProducts(): Observable<GetProduct[]> {
    return this.http.get<GetProduct[]>(this.GET_ALL_PRODUCTS);
  }

  getAllTransports(): Observable<GetTransport[]> {
    return this.http.get<GetTransport[]>(this.GET_ALL_TRANSPORTS);
  }

  getAllTransportsByEmporiumId(id: number): Observable<GetTransport[]> {
    return this.http.get<GetTransport[]>(this.GET_ALL_TRANSPORTS_BY_EMPORIUM_ID+id);
  }

  getAllEmporiums(): Observable<GetEmporium[]> {
    return this.http.get<GetEmporium[]>(this.GET_ALL_EMPORIUMS);
  }

  getAllCountsByEmporiumId(id: number): Observable<GetCount[]> {
    return this.http.get<GetCount[]>(this.GET_ALL_COUNTS_BY_EMPORIUM_ID+id);
  }

  getAllMessages() : Observable<GetMessage[]> {
    return this.http.get<GetMessage[]>(this.GET_ALL_MESSAGES);
  }

  getAllPaymentsByEmporiumId(id: number): Observable<GetPayment[]> {
    return this.http.get<GetPayment[]>(this.GET_ALL_PAYMENTS_BY_EMPORIUM_ID+id);
  }

  getProductsIncomeByEmporiumId (id: number): Observable<any> {
    return this.http.get<any>(this.GET_PRODUCTS_INCOME_BY_EMPORIUM_ID+id);
  }
}
