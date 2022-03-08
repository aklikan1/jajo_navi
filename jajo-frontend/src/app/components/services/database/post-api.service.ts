import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../base-url.service";
import {PostAddress} from "../../model/address";
import {Observable} from "rxjs";
import {PostProduct} from "../../model/product";
import {PostEmporium} from "../../model/emporium";
import {PostCount} from "../../model/count";
import {PostTransport} from "../../model/transport";
import {PostPayment} from "../../model/payment";

@Injectable({
  providedIn: 'root'
})
export class PostApiService {

  private POST_ADDRESS = `${this.baseUrl.baseUrl}\\address`;
  private POST_PRODUCT = `${this.baseUrl.baseUrl}\\products`;
  private POST_EMPORIUM = `${this.baseUrl.baseUrl}\\emporium`;
  private POST_COUNT = `${this.baseUrl.baseUrl}\\count`
  private POST_TRANSPORT = `${this.baseUrl.baseUrl}\\transport`
  private POST_PAYMENT = `${this.baseUrl.baseUrl}\\payment`

  constructor(private http: HttpClient, private baseUrl: BaseUrlService) {}

  //Functions

  postAddress (address: PostAddress): Observable<any> {
    return this.http.post(this.POST_ADDRESS, address);
  }

  postProduct (product: PostProduct): Observable<any> {
    return this.http.post(this.POST_PRODUCT, product);
  }

  postEmporium(emporium: PostEmporium): Observable<any> {
    return this.http.post(this.POST_EMPORIUM, emporium);
  }

  postCount(count: PostCount): Observable<any> {
    return this.http.post(this.POST_COUNT, count);
  }

  postTransport(transport: PostTransport): Observable<any> {
    return this.http.post(this.POST_TRANSPORT, transport);
  }

  postPayment (payment: PostPayment): Observable<any> {
    return this.http.post(this.POST_PAYMENT, payment);
  }
}
