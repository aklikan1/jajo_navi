import {Component, Input, OnInit} from '@angular/core';
import {GetEmporium} from "../../../model/emporium";
import {GetTransport} from "../../../model/transport";
import {PostApiService} from "../../../services/database/post-api.service";
import {GetPayment} from "../../../model/payment";
import {GetApiService} from "../../../services/database/get-api.service";

@Component({
  selector: 'app-money-transports',
  templateUrl: './money-transports.component.html',
  styleUrls: ['./money-transports.component.css']
})
export class MoneyTransportsComponent implements OnInit {

  @Input() public actualEmporium: GetEmporium = <GetEmporium>{};
  @Input() public allTransports: GetTransport[] = <GetTransport[]>{};

  public paymentsByEmporiumId: GetPayment[] = <GetPayment[]>{};
  public totalPayments: number[] = [];

  public moneyCount: number[] = [];

  constructor(private getApiService: GetApiService, private postApiService: PostApiService) { }

  ngOnInit(): void {}

  getAllPaymentsByEmporiumId (emporiumId: number) {
    this.totalPayments = [];
    this.getApiService.getAllPaymentsByEmporiumId(emporiumId).subscribe(
      value => {
        this.paymentsByEmporiumId = value;
        this.paymentsByEmporiumId.forEach(payments => {
          this.totalPayments.push(payments.totalPayment);
        });
      }
    );
  }

  changePaidOption(transport: GetTransport) {
    transport.isPaid = !transport.isPaid;
    this.postApiService.postTransport(transport).subscribe();
  }
}
