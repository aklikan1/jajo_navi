import {Component, Input, OnInit} from '@angular/core';
import {GetEmporium} from "../../../model/emporium";
import {GetTransport} from "../../../model/transport";
import {PostApiService} from "../../../services/database/post-api.service";

@Component({
  selector: 'app-money-transports',
  templateUrl: './money-transports.component.html',
  styleUrls: ['./money-transports.component.css']
})
export class MoneyTransportsComponent implements OnInit {

  @Input() public actualEmporium: GetEmporium = <GetEmporium>{};
  @Input() public allTransports: GetTransport[] = <GetTransport[]>{};

  public moneyCount: number[] = [];

  constructor(private postApiService: PostApiService) { }

  ngOnInit(): void {
  }

  changePaidOption(transport: GetTransport) {
    transport.isPaid = !transport.isPaid;
    this.postApiService.postTransport(transport).subscribe();
  }
}
