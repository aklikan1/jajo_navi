import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbCalendar, NgbDateStruct, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GetApiService} from "../../services/database/get-api.service";
import {PostApiService} from "../../services/database/post-api.service";
import {DeleteApiService} from "../../services/database/delete-api.service";
import {GetEmporium, PostEmporium} from "../../model/emporium";
import {MainTransportsComponent} from "./mainTransports/mainTransports.component";
import {GetTransport} from "../../model/transport";
import {MessageTransportsComponent} from "./message-transports/message-transports.component";
import {MoneyTransportsComponent} from "./money-transports/money-transports.component";
import {GetCount} from "../../model/count";
import {ProductsTransportComponent} from "./products-transport/products-transport.component";
import {GetProduct} from "../../model/product";

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent implements OnInit {

  public emporiums: GetEmporium[] = [];
  public allTransports: GetTransport[] = [];
  public countsByEmporiumId: GetCount[] = [];

  public actualEmporium: GetEmporium = <GetEmporium>{};

  public newEmporiumDate: NgbDateStruct = <NgbDateStruct>{};
  public tempDeleteInformation: string = "";

  @ViewChild(MainTransportsComponent) private mainTransportsComponent!: MainTransportsComponent;
  @ViewChild(MessageTransportsComponent) private messageTransportsComponent!: MessageTransportsComponent;
  @ViewChild(MoneyTransportsComponent) private moneyTransportComponent!: MoneyTransportsComponent;
  @ViewChild(ProductsTransportComponent) private productsTransportComponent!: ProductsTransportComponent;

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
        this.mainTransportsComponent.getAllTransports(actualEmporiumId);
        this.mainTransportsComponent.getAllCountsByEmporiumId(actualEmporiumId);
        this.mainTransportsComponent.getAllProducts();

        this.moneyTransportComponent.getAllPaymentsByEmporiumId(actualEmporiumId);

        this.productsTransportComponent.getCountProductsByEmporiumId(this.actualEmporium.id);
      }
    );
  }

  changeActualEmporium(emporium: GetEmporium) {
    this.actualEmporium = emporium;

    this.mainTransportsComponent.getAllTransports(emporium.id);
    this.mainTransportsComponent.getAllCountsByEmporiumId(emporium.id);
    this.productsTransportComponent.getCountProductsByEmporiumId(this.actualEmporium.id);
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

        newEmporium.isSunday = false;

        this.postApiService.postEmporium(newEmporium).subscribe(
          value => {
            this.emporiums.unshift(value);
            this.actualEmporium = value;

            this.mainTransportsComponent.transports = [];
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
        this.mainTransportsComponent.getAllTransports(this.actualEmporium.id);
        this.mainTransportsComponent.getAllCountsByEmporiumId(this.actualEmporium.id);

      },
      () => {}
    );
  }

  //Parent data from children emits

  //Message emits

  changeSundayOption($event: GetTransport[]) {
    this.allTransports = $event;

    this.messageTransportsComponent.createMessages($event);
  }

  refreshAllTransportsFromMainTransports() {
    this.mainTransportsComponent.getAllTransports(this.actualEmporium.id);
  }

  refreshMoney() {
    this.moneyTransportComponent.getAllPaymentsByEmporiumId(this.actualEmporium.id);
    this.productsTransportComponent.getCountProductsByEmporiumId(this.actualEmporium.id);
  }

}


