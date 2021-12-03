import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbCalendar, NgbDateStruct, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GetApiService} from "../../services/database/get-api.service";
import {PostApiService} from "../../services/database/post-api.service";
import {DeleteApiService} from "../../services/database/delete-api.service";
import {GetTransport, PostTransport} from "../../model/transport";
import {GetEmporium, PostEmporium} from "../../model/emporium";
import {GetProduct} from "../../model/product";
import {GetCount, PostCount} from "../../model/count";
import {GetAddress} from "../../model/address";

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent implements OnInit {

  public emporiums: GetEmporium[] = [];
  public transports: GetTransport[] = [];
  public allProducts: GetProduct[] = [];
  public firstHalfTransportAddresses: GetAddress[] = [];
  public secondTransportHalfAddresses: GetAddress[] = [];
  public countsByEmporiumId: GetCount[] = [];

  public actualEmporium: GetEmporium = <GetEmporium>{};

  public newEmporiumDate: NgbDateStruct = <NgbDateStruct>{};
  public tempDeleteInformation: string = "";
  public quantity: number = 0;
  public currentOpenedItemId: number = 0;

  public selectedTransportAddresses: GetAddress[] = [];

  constructor(private modalService: NgbModal, private getApiService: GetApiService,
              private postApiService: PostApiService, private deleteApiService: DeleteApiService,
              private calendar: NgbCalendar) { }

  ngOnInit(): void {
    this.getAllEmporiums();
  }

  getAllEmporiums() {
    this.getApiService.getAllEmporiums().subscribe(
      value => {
        this.emporiums = value;
        this.actualEmporium = value[0];

        let actualEmporiumId = value[0].id;
        this.getAllTransports(actualEmporiumId);
        this.getAllCountsByEmporiumId(actualEmporiumId);
        this.getAllProducts();
      }
    );
  }

  getAllTransports(emporiumId: number) {
    this.getApiService.getAllTransportsByEmporiumId(emporiumId).subscribe(
      value => {
        this.transports = value;
        this.transports.forEach(x => x.addButton = false);

        this.getAddressesWithoutExisting(emporiumId);
      }
    );
  }

  getAddressesWithoutExisting(emporiumId: number) {
    this.getApiService.getAvailableAddresses(emporiumId).subscribe(
      value => {
        let newAddresses: GetAddress[] = [];
        newAddresses = value;

        let halfAddresses = Math.ceil(newAddresses.length / 2);
        this.firstHalfTransportAddresses = newAddresses.slice(0, halfAddresses);
        this.secondTransportHalfAddresses = newAddresses.slice(halfAddresses, newAddresses.length);
      }
    );
  }

  getAllCountsByEmporiumId(emporiumId: number) {
    this.getApiService.getAllCountsByEmporiumId(emporiumId).subscribe(
      value => {
        this.countsByEmporiumId = value;
      }
    );
  }

  getAllProducts() {
    this.getApiService.getAllProducts().subscribe(
      value => {
        this.allProducts = value;
      }
    );
  }

  changeActualEmporium(emporium: GetEmporium) {
    this.actualEmporium = emporium;
    this.getAllTransports(emporium.id);
    this.getAllCountsByEmporiumId(emporium.id);
  }

  addNewEmporium(content: TemplateRef<any>) {
    this.newEmporiumDate = this.calendar.getToday();

    this.modalService.open(content, {backdrop: false}).result.then(
      //close
      () => {
        let newEmporium: PostEmporium = <PostEmporium>{};

        let day = this.newEmporiumDate.day.toString();
        let month = this.newEmporiumDate.month < 10 ?
          "0"+this.newEmporiumDate.month.toString() : this.newEmporiumDate.month.toString();
        let year = this.newEmporiumDate.year.toString();
        newEmporium.name = day+"-"+month+"-"+year;

        this.postApiService.postEmporium(newEmporium).subscribe(
          value => {
            this.emporiums.unshift(value);
            this.actualEmporium = value;
            this.transports = [];
          },
          error => {console.error("Error in addNewEmporium()"+error)}
        );
      },
      //dismiss
      () => {}
    );
  }

  deleteEmporiumById(content: TemplateRef<any>, emporium: GetEmporium) {
    this.tempDeleteInformation = emporium.name;
    let id = emporium.id;
    this.modalService.open(content, {backdrop: false}).result.then(
      () => {
        this.deleteApiService.deleteEmporiumById(id).subscribe();
        this.emporiums = this.emporiums.filter(obj => obj !== emporium);
        this.actualEmporium=this.emporiums[0];
        this.getAllTransports(this.actualEmporium.id);
        this.getAllCountsByEmporiumId(this.actualEmporium.id);
      },
      () => {}
    );
  }

  addNewTransports(newTransportTemplate: TemplateRef<any>) {
    this.modalService.open(newTransportTemplate, {backdrop: false}).result.then(
      () => {
        this.selectedTransportAddresses.forEach(
          item => {
            let newTempTransport: PostTransport = <PostTransport>{};
            newTempTransport.address = item;
            newTempTransport.emporium = this.actualEmporium;

            this.postApiService.postTransport(newTempTransport).subscribe(
              value => {
                let newPushTransport: GetTransport = <GetTransport>{};
                newPushTransport.id = value.id;
                newPushTransport.address = value.address;
                newPushTransport.addButton = false;
                newPushTransport.time = value.time;
                newPushTransport.emporium = value.emporium;
                newPushTransport.message = value.message;
                newPushTransport.actualProducts = [];
                newPushTransport.availableProducts = this.allProducts;
                this.transports.push(newPushTransport);

                this.sortTransportsByAddressHierarchy();
              }
            );
          }
        );
      },
      () => {}
    );

    this.selectedTransportAddresses=[];
    this.getAddressesWithoutExisting(this.actualEmporium.id);
  }

  deleteTransportById(confirmDeleteModal: TemplateRef<any>, transport: GetTransport) {

  }


  handleOpened(transport: GetTransport) {
    this.currentOpenedItemId = transport.id;
  }

  disableShowProductList(transport: GetTransport) {
    transport.addButton = true;
  }

  addTransportCount(quantityProduct: TemplateRef<any>, product: GetProduct, transport: GetTransport) {

    this.modalService.open(quantityProduct, {backdrop: false}).result.then(
      () => {
        if (this.quantity === undefined || this.quantity === null) {
          this.quantity = 0;
        }
        let tempQuantity: PostCount = <PostCount>{};
        tempQuantity.count = this.quantity;
        tempQuantity.product = product;
        tempQuantity.transport = transport;

        this.postApiService.postCount(tempQuantity).subscribe(
          value => {
            this.countsByEmporiumId.push(value);
            this.countsByEmporiumId.sort((n1, n2) => n1.product.hierarchy - n2.product.hierarchy);

            transport.availableProducts = transport.availableProducts.filter( obj => obj !== product);
          }
        );
      }
    );
  }

  deleteCountById( count: GetCount, transport: GetTransport) {
    this.tempDeleteInformation = count.product.name;
    let id = count.id;
    this.deleteApiService.deleteCountById(id).subscribe(
      () => {
        this.countsByEmporiumId = this.countsByEmporiumId.filter(obj => obj !== count);
        transport.availableProducts.push(count.product);
        transport.availableProducts.sort((n1, n2) => n1.hierarchy - n2.hierarchy);
      }
    );
  }

  sortTransportsByAddressHierarchy () {
    this.transports = this.transports.sort(function (a, b) {
      return a.address.hierarchy - b.address.hierarchy;
    });
  }

}


