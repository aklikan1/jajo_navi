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


@NgModule({
  declarations: [
    TransportComponent,
    AddressComponent,
    ProductsComponent
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
        MatFormFieldModule

    ]
})
export class NavigationModule { }
