import {Routes} from '@angular/router';
import {TransportComponent} from './transport/transport.component';
import {AddressComponent} from './address/address.component';
import {ProductsComponent} from './products/products.component';

export const NavigationRoutes: Routes = [
  {
    path: 'transport',
    component: TransportComponent
  },
  {
    path: 'address',
    component: AddressComponent
  },
  {
    path: 'products',
    component: ProductsComponent
  }
];
