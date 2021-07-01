import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GetApiService} from "../../services/database/get-api.service";
import {PostApiService} from "../../services/database/post-api.service";
import {DeleteApiService} from "../../services/database/delete-api.service";
import {GetProduct, PostProduct} from "../../model/product";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {PostAddress} from "../../model/address";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public products: GetProduct[] = [];
  public newProductName: string = "";
  public newProductPrice: number = 0;
  public newProductCost: number = 0;
  public tempDeleteInformation: string = "";

  constructor(private modalService: NgbModal, private getApiService: GetApiService,
              private postApiService: PostApiService, private deleteApiService: DeleteApiService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.getApiService.getAllProducts().subscribe(
      value => {
        this.products = value;
        this.products.forEach(product => product.name_readonly = true);
        this.products.forEach(product => product.price_readonly = true);
        this.products.forEach(product => product.cost_readonly = true);

      },
      error => {
        alert("An error is occurred in getAllProducts()");
        console.log(error);
      }
    );
  }


  addNewProduct(content: TemplateRef<any>) {

    this.modalService.open(content, {backdrop: false}).result.then(
      //close
      () => {
        let newProduct = <GetProduct> {};

        if (this.newProductName === "") {
          this.newProductName = "New Product";
        }
        if(this.newProductPrice === null) {
          this.newProductPrice = 0;
        }
        if(this.newProductCost === null) {
          this.newProductCost = 0;
        }

        newProduct.name = this.newProductName;
        newProduct.price = this.newProductPrice;
        newProduct.cost = this.newProductCost;
        newProduct.hierarchy = this.products[this.products.length - 1].hierarchy + 1;

        newProduct.name_readonly = true;
        newProduct.price_readonly = true;
        newProduct.cost_readonly = true;

        this.postApiService.postProduct(newProduct).subscribe(
          value => {
            this.products.push(value);
          }
        );

      this.newProductName = "";
      this.newProductPrice = 0;
      this.newProductCost = 0;

      },
      //dismiss
      () => {}
    );

  }

  deleteProductById(content: TemplateRef<any>, product: GetProduct) {
    this.tempDeleteInformation = product.name;
    let id = product.id;
    this.modalService.open(content, {backdrop: false}).result.then(
      //close
      () => {
        this.deleteApiService.deleteProductById(id).subscribe(
          () => {
            this.products = this.products.filter(obj => obj !== product);
          }
        );
        this.organizeHierarchy();
      },
      //dismiss
      () => {

      }
    );
  }

  updateProduct(postProduct: PostProduct) {
    this.postApiService.postProduct(postProduct).subscribe();
  }

  //Intra-system functions
  organizeHierarchy() {
    let index: number = 1;

    for (let product of this.products) {
      if (product.hierarchy != (index)) {
        product.hierarchy = index;
        this.postApiService.postProduct(product).subscribe();
      }
      index++;
    }
  }


  // HTML functions
  changeReadOnly (product: GetProduct) {
    product.name_readonly = false;
    product.price_readonly = false;
    product.cost_readonly = false;
  }

  lostFocus(product: GetProduct) {
    product.name_readonly = true;
    product.price_readonly = true;
    product.cost_readonly = true;

    if (product.price === null) {
      product.price = 0;
    }
    if (product.cost === null) {
      product.cost = 0;
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.products, event.previousIndex, event.currentIndex);
    this.organizeHierarchy();
  }

}
