import {Component, OnInit, TemplateRef} from '@angular/core';
import {GetTransport, PostTransport} from "../../../model/transport";
import {NgbCalendar, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GetApiService} from "../../../services/database/get-api.service";
import {PostApiService} from "../../../services/database/post-api.service";
import {DeleteApiService} from "../../../services/database/delete-api.service";
import {GetAddress} from "../../../model/address";

@Component({
  selector: 'app-mainTransports',
  templateUrl: './mainTransports.component.html',
  styleUrls: ['./mainTransports.component.css']
})
export class MainTransportsComponent implements OnInit {

  constructor(private modalService: NgbModal, private getApiService: GetApiService,
              private postApiService: PostApiService, private deleteApiService: DeleteApiService,
              private calendar: NgbCalendar) { }

  ngOnInit(): void {
  }

}
