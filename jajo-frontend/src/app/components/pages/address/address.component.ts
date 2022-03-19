import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GetApiService} from "../../services/database/get-api.service";
import {GetAddress, PostAddress} from "../../model/address";
import {PostApiService} from "../../services/database/post-api.service";
import {DeleteApiService} from "../../services/database/delete-api.service";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  public addresses: GetAddress[] = [];
  public newAddressName: string = "";
  public tempDeleteInformation: string = "";

  constructor(private modalService: NgbModal, private getApiService: GetApiService,
              private postApiService: PostApiService, private deleteApiService: DeleteApiService) { }

  ngOnInit(): void {
    this.getAllAddresses();
  }

  getAllAddresses () {
    this.getApiService.getAllAddresses().subscribe(
      value => {
        this.addresses = value;
        this.addresses.forEach(adres => adres.read_only = true)
      },
      error => {
        alert("An error is occurred in getAllAddresses()");
        console.log(error);
      }
    );
  };

  changeAddressName(address: GetAddress) {
    address.read_only = false;
    let selectInput: any;

    selectInput = document.getElementById(address.id.toString());
    selectInput.focus();
    selectInput.select();
  }

  updateAddress(postAddress: PostAddress) {
    this.postApiService.postAddress(postAddress).subscribe();
  }

  lostFocus(address: GetAddress) {
    address.read_only = true;
  }

  addNewBudget(content: TemplateRef<any>) {

    this.modalService.open(content, {backdrop: false}).result.then(
      //close
      () => {

        let newAddress: GetAddress = <GetAddress> {};

        if (this.newAddressName === "") {
          this.newAddressName = "Nowy Adres";
        }

        newAddress.name = this.newAddressName;

        if (this.addresses.length == 0) {
          newAddress.hierarchy = 1;
        } else {
          newAddress.hierarchy = this.addresses[this.addresses.length - 1].hierarchy + 1;
        }

        newAddress.read_only = true;
        newAddress.isMrMrs = false;

        this.postApiService.postAddress(newAddress).subscribe(
          value => {
            this.addresses.push(value);
          }
        );

        this.newAddressName = "";
      },
      //dismiss
      () => {}
    );

  }

  deleteAddressById(content: TemplateRef<any>, address: GetAddress) {

    this.tempDeleteInformation = address.name;
    let id = address.id;
    this.modalService.open(content, {backdrop: false}).result.then(
      //close
      () => {
        this.deleteApiService.deleteAddressById(id).subscribe();
        this.addresses = this.addresses.filter(obj => obj !== address);
        this.organizeHierarchy();
      },
      //dismiss
      () => {

      }
    );
  }

  organizeHierarchy() {
    let index: number = 1;

    for (let address of this.addresses) {
      if (address.hierarchy != (index)) {
        address.hierarchy = index;
        this.postApiService.postAddress(address).subscribe();
      }
      index++;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.addresses, event.previousIndex, event.currentIndex);
    this.organizeHierarchy();
  }

  changeOfficial(checked: boolean, address: GetAddress) {
    address.isMrMrs = checked;
    this.postApiService.postAddress(address).subscribe();

  }
}
