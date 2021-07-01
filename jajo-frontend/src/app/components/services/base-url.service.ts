import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseUrlService {

  // @ts-ignore
  //public baseUrl = window["cfgApiBaseUrl"] + "/api";
  public baseUrl = "http://localhost:8080/api";

  constructor() { }
}
