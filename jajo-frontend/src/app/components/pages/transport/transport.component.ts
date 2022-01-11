import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbCalendar, NgbDateStruct, NgbModal, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {GetApiService} from "../../services/database/get-api.service";
import {PostApiService} from "../../services/database/post-api.service";
import {DeleteApiService} from "../../services/database/delete-api.service";
import {GetEmporium, PostEmporium} from "../../model/emporium";
import {MainTransportsComponent} from "./mainTransports/mainTransports.component";
import {GetTransport} from "../../model/transport";
import {GetMessage} from "../../model/message";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent implements OnInit {

  public emporiums: GetEmporium[] = [];

  public actualEmporium: GetEmporium = <GetEmporium>{};

  // Messages values
  public allTransports: GetTransport[] = [];
  public allMessages: GetMessage[] = [];

  public newEmporiumDate: NgbDateStruct = <NgbDateStruct>{};
  public tempDeleteInformation: string = "";

  @ViewChild(MainTransportsComponent) private mainTransportsComponent!: MainTransportsComponent;

  constructor(private modalService: NgbModal, private getApiService: GetApiService,
              private postApiService: PostApiService, private deleteApiService: DeleteApiService,
              private calendar: NgbCalendar) { }

  ngOnInit(): void {
    this.getAllMessages();
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

        //this.getAllTransports(this.actualEmporium.id);
      }
    );
  }

  changeActualEmporium(emporium: GetEmporium) {
    this.actualEmporium = emporium;

    this.mainTransportsComponent.getAllTransports(emporium.id);
    this.mainTransportsComponent.getAllCountsByEmporiumId(emporium.id);

    //this.getAllTransports(emporium.id);
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
            this.allTransports = [];
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

        //this.getAllTransports(this.actualEmporium.id);
      },
      () => {}
    );
  }

  //Messages Tab
/*
  getAllTransports(emporiumId: number) {
    this.getApiService.getAllTransportsByEmporiumId(emporiumId).subscribe(
      value => {
        this.allTransports = value;
      }
    );
  }

 */

  getAllMessages() {
    this.getApiService.getAllMessages().subscribe(
      value => {
        this.allMessages = value;
      }
    );
  }

  changeSundayOption() {
    let isSundayInActualEmporium: boolean = this.actualEmporium.isSunday;
    let tempEmporium = this.actualEmporium;
    if (!isSundayInActualEmporium) {
      tempEmporium.isSunday = true;
      this.postApiService.postEmporium(tempEmporium).subscribe(
        value => {
          this.actualEmporium = value;
          this.mainTransportsComponent.getAllTransports(this.actualEmporium.id);
        }
      );
    } else {
      tempEmporium.isSunday = false;
      this.postApiService.postEmporium(tempEmporium).subscribe(
        value => {
          this.actualEmporium = value;
          this.mainTransportsComponent.getAllTransports(this.actualEmporium.id);
        }
      );
    }
  }

  createMessages () {
    let isSunday: boolean = this.actualEmporium.isSunday;

    this.allTransports.forEach(value => {
      let isMrMrs: boolean = value.address.isMrMrs;

      if (!isSunday && !isMrMrs) {
        value.message = this.allMessages.find(obj => !obj.isSunday && !obj.isMrMrs)!.message + value.time.substring(5, -2);
      }
      if (isSunday && !isMrMrs) {
        value.message = this.allMessages.find(obj => obj.isSunday && !obj.isMrMrs)!.message + value.time.substring(5, -2);
      }
      if (!isSunday && isMrMrs) {
        value.message = this.allMessages.find(obj => !obj.isSunday && obj.isMrMrs)!.message + value.time.substring(5, -2);
      }
      if (isSunday && isMrMrs) {
        value.message = this.allMessages.find(obj => obj.isSunday && obj.isMrMrs)!.message + value.time.substring(5, -2);
      }
    });
  }

  refreshAllTransportsFromMainTransports($event: GetTransport[]) {
    this.allTransports = $event;

    this.createMessages();
  }

  changeSendMessage(transport: GetTransport) {
    if (!transport.isSent) {
      transport.isSent = true;
      this.postApiService.postTransport(transport).subscribe();
    } else {
      transport.isSent = false;
      this.postApiService.postTransport(transport).subscribe();
    }
  }
}


