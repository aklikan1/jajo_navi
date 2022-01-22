import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {GetTransport} from "../../../model/transport";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GetApiService} from "../../../services/database/get-api.service";
import {PostApiService} from "../../../services/database/post-api.service";
import {GetMessage} from "../../../model/message";
import {GetEmporium} from "../../../model/emporium";
import {MainTransportsComponent} from "../mainTransports/mainTransports.component";

@Component({
  selector: 'app-message-transports',
  templateUrl: './message-transports.component.html',
  styleUrls: ['./message-transports.component.css']
})
export class MessageTransportsComponent implements OnInit {

  @Input() public actualEmporium: GetEmporium = <GetEmporium>{};
  @Input() public allTransports: GetTransport[] = <GetTransport[]>{};
  @Output() public sundayOptionEmitter = new EventEmitter <void>();

  public allMessages: GetMessage[] = [];

  constructor(private getApiService: GetApiService,
              private postApiService: PostApiService) { }

  ngOnInit(): void {
    this.getAllMessages();
  }

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
          this.sundayOptionEmitter.emit();
        }
      );
    } else {
      tempEmporium.isSunday = false;
      this.postApiService.postEmporium(tempEmporium).subscribe(
        value => {
          this.actualEmporium = value;
          this.sundayOptionEmitter.emit();
        }
      );
    }
  }

  createMessages (allTransports: GetTransport[]) {
    this.allTransports = allTransports;
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
