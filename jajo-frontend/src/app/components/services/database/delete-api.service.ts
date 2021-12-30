import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseUrlService} from "../base-url.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DeleteApiService {

  private DELETE_ADDRESS_BY_ID = `${this.baseUrl.baseUrl}\\address\\`;
  private DELETE_PRODUCT_BY_ID = `${this.baseUrl.baseUrl}\\products\\`;
  private DELETE_EMPORIUM_BY_ID = `${this.baseUrl.baseUrl}\\emporium\\`;
  private DELETE_COUNT_BY_ID = `${this.baseUrl.baseUrl}\\count\\`
  private DELETE_TRANSPORT_BY_ID = `${this.baseUrl.baseUrl}\\transport\\`

  constructor(private baseUrl: BaseUrlService, private http: HttpClient) { }

  deleteAddressById (id: number) : Observable<any> {
    return this.http.delete<any>(this.DELETE_ADDRESS_BY_ID+id);
  }

  deleteProductById (id: number) : Observable<any> {
    return this.http.delete<any>(this.DELETE_PRODUCT_BY_ID+id);
  }

  deleteEmporiumById (id: number) : Observable<any> {
    return this.http.delete<any>(this.DELETE_EMPORIUM_BY_ID+id);
  }

  deleteCountById (id: number): Observable<any> {
    return this.http.delete<any>(this.DELETE_COUNT_BY_ID+id);
  }

  deleteTransportById (id: number): Observable<any> {
    return this.http.delete<any>(this.DELETE_TRANSPORT_BY_ID+id);
  }
}
