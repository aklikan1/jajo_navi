import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TransportComponent} from './transport/transport.component';
import {RouterModule} from '@angular/router';
import {NavigationRoutes} from './navigation.routing';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CdkTableModule} from '@angular/cdk/table';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { AddressComponent } from './address/address.component';
import { ProductsComponent } from './products/products.component';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSliderModule} from "@angular/material/slider";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatMenuModule} from "@angular/material/menu";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatFormFieldModule} from "@angular/material/form-field";
import { MainTransportsComponent } from './transport/mainTransports/mainTransports.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {MatTooltipModule} from "@angular/material/tooltip";
import { MessageTransportsComponent } from './transport/message-transports/message-transports.component';
import { MoneyTransportsComponent } from './transport/money-transports/money-transports.component';
import { ProductsTransportComponent } from './transport/products-transport/products-transport.component';


@NgModule({
  declarations: [
    TransportComponent,
    AddressComponent,
    ProductsComponent,
    MainTransportsComponent,
    MessageTransportsComponent,
    MoneyTransportsComponent,
    ProductsTransportComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(NavigationRoutes),
        HttpClientModule,
        FormsModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        CdkTableModule,
        MatCardModule,
        MatTabsModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatGridListModule,
        MatSliderModule,
        DragDropModule,
        MatCheckboxModule,
        MatMenuModule,
        NgbModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        ClipboardModule,
        MatTooltipModule

    ]
})
export class NavigationModule { }
