import {Component, Input, OnInit} from '@angular/core';
import {GetCount} from "../../../model/count";
import {GetApiService} from "../../../services/database/get-api.service";
import {GetProduct} from "../../../model/product";
import {GetEmporium} from "../../../model/emporium";
import {ProductsIncome} from "../../../model/productsIncome";
import {TakeProduct} from "../../../model/takeProduct";

@Component({
  selector: 'app-products-transport',
  templateUrl: './products-transport.component.html',
  styleUrls: ['./products-transport.component.css']
})
export class ProductsTransportComponent implements OnInit {

  public productsIncome: ProductsIncome = <ProductsIncome>{};
  public takeProducts: TakeProduct[] = []
  public incomeMoney: number = 0;
  public izaMoney: number = 0;

  public messageToIza: string = '';

  @Input() public actualEmporium: GetEmporium = <GetEmporium>{};

  constructor(private getApiService: GetApiService) { }

  ngOnInit(): void {}

  getCountProductsByEmporiumId (emporiumId: number) {
    this.getApiService.getProductsIncomeByEmporiumId(emporiumId).subscribe(
      value => {
        this.productsIncome = value;
        this.takeProducts = this.productsIncome.takeProducts;
        this.incomeMoney = this.productsIncome.incomeMoney;
        this.izaMoney = this.productsIncome.izaMoney;

        this.createMessageToIza(this.takeProducts);
      }
    );
  }

  createMessageToIza (takeProducts: TakeProduct[]) {
    this.messageToIza = "Hej. Sprzedałem miody:\n"
    takeProducts.forEach(value => {
      if (value.productId != 1) {
        this.messageToIza = this.messageToIza + value.productName.substring(5)+" - "+value.productCount + "\n"
      }
    });

    this.messageToIza = this.messageToIza + "Dla Ciebie: "+ this.izaMoney + " zł";
  }

}
