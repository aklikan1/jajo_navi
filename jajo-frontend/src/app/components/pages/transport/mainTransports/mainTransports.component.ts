import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {GetTransport, PostTransport} from "../../../model/transport";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GetApiService} from "../../../services/database/get-api.service";
import {PostApiService} from "../../../services/database/post-api.service";
import {DeleteApiService} from "../../../services/database/delete-api.service";
import {GetAddress} from "../../../model/address";
import {GetEmporium} from "../../../model/emporium";
import {GetProduct} from "../../../model/product";
import {GetCount, PostCount} from "../../../model/count";
import {DateTime} from "luxon";

@Component({
  selector: 'app-mainTransports',
  templateUrl: './mainTransports.component.html',
  styleUrls: ['./mainTransports.component.css']
})
export class MainTransportsComponent implements OnInit {

  public selectedTransportAddresses: GetAddress[] = [];

  public tempEndTimeShift: any;
  public currentOpenedItemId: number = 0;
  public tempDeleteInformation: string = "";
  public quantity: number = 0;

  @Input() public actualEmporium: GetEmporium = <GetEmporium>{};
  @Output() public refreshAllTransports = new EventEmitter <GetTransport[]>();

  public transports: GetTransport[] = [];
  public allProducts: GetProduct[] = [];
  public firstHalfTransportAddresses: GetAddress[] = [];
  public secondTransportHalfAddresses: GetAddress[] = [];
  public countsByEmporiumId: GetCount[] = [];

  constructor(private modalService: NgbModal, private getApiService: GetApiService,
              private postApiService: PostApiService, private deleteApiService: DeleteApiService) { }

  ngOnInit(): void {}

  getAllTransports(emporiumId: number) {
    this.getApiService.getAllTransportsByEmporiumId(emporiumId).subscribe(
      value => {
        this.transports = value;
        this.transports.forEach(x => x.addButton = false);

        this.refreshAllTransports.emit(this.transports);

        this.getAddressesWithoutExisting(emporiumId);
      }
    );
  }

  getAddressesWithoutExisting(emporiumId: number) {
    this.getApiService.getAvailableAddresses(emporiumId).subscribe(
      value => {
        let newAddresses: GetAddress[];
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
        this.countsByEmporiumId.forEach(x => x.readonly = true);
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
                newPushTransport.isSent = false;
                this.transports.push(newPushTransport);

                this.sortTransportsByAddressHierarchy();

                this.refreshAllTransports.emit(this.transports);
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
    this.tempDeleteInformation = transport.address.name;
    let id = transport.id;
    this.modalService.open(confirmDeleteModal, {backdrop: false}).result.then(
      () => {
        this.deleteApiService.deleteTransportById(id).subscribe(
          () => {
            this.transports = this.transports.filter((obj => obj !== transport));

            this.refreshAllTransports.emit(this.transports);
          }
        );

      },
      () => {}
    )
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

            this.getAllTransports(this.actualEmporium.id);
          }
        );
      }
    );
  }

  updateCountById(count: GetCount) {
    this.postApiService.postCount(count).subscribe(
      () => {
        this.getAllTransports(this.actualEmporium.id);
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

        this.getAllTransports(this.actualEmporium.id);
      }
    );
  }


  autoTime(maxEndShift: TemplateRef<any>) {
    let dateTime = DateTime.now();
    let constTime: number = 15;

    this.tempEndTimeShift = (dateTime.hour<9? "0"+dateTime.hour:dateTime.hour)+":"+("0"+dateTime.minute).slice(-2);
    let tempTransport: GetTransport = <GetTransport>{};
    this.modalService.open(maxEndShift, {backdrop: false}).result.then(
      () => {
        this.transports.forEach((value, index, array)=> {
          let tempTimeBetweenTransports: number = (array.length-index-1)*constTime;
          let inputTime: DateTime = DateTime.fromObject({hour: parseInt(this.tempEndTimeShift.slice(0, 2)),
            minute: parseInt(this.tempEndTimeShift.slice(-2))}).minus({minutes: tempTimeBetweenTransports});

          tempTransport = value;
          tempTransport.time = inputTime.toSQLTime().substring(0, 8);

          this.postApiService.postTransport(tempTransport).subscribe();
        });

        this.refreshAllTransports.emit(this.transports);
      },
      () => {}
    );
  }

  plusOrMinusFifteenMinutes(transport: GetTransport, type: string) {
    let tempTransport: GetTransport = <GetTransport>{};

    this.transports.forEach(value => {

      if (value.address.hierarchy >= transport.address.hierarchy) {
        tempTransport = value;
        if (type === 'plus') {
          tempTransport.time = tempTimeShiftPlus().toSQLTime().substring(0, 8);
        }

        if (type === 'minus') {
          tempTransport.time = tempTimeShiftMinus().toSQLTime().substring(0, 8);
        }
        this.postApiService.postTransport(tempTransport).subscribe();
      }
    });

    this.refreshAllTransports.emit(this.transports);

    function tempTimeShiftPlus () {
      return DateTime.fromObject({
        hour: parseInt(tempTransport.time.substring(0, 2)),
        minute: parseInt(tempTransport.time.substring(5, 3))
      }).plus({minutes: 15});
    }

    function tempTimeShiftMinus () {
      return DateTime.fromObject({
        hour: parseInt(tempTransport.time.substring(0, 2)),
        minute: parseInt(tempTransport.time.substring(5, 3))
      }).minus({minutes: 15});
    }
  }

  sortTransportsByAddressHierarchy () {
    this.transports = this.transports.sort(function (a, b) {
      return a.address.hierarchy - b.address.hierarchy;
    });
  }

  changeReadOnly(count: GetCount) {
    count.readonly = false;
  }

  lostFocus(count: GetCount) {
    count.readonly = true;
  }

}
