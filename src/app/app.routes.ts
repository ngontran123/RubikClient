import { Routes } from '@angular/router';
import { DefaulComponent } from './shared/layouts/defaul/defaul.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AboutComponent } from './pages/about/about.component';
import { ItemsComponent } from './pages/items/items.component';
import { ProductsComponent } from './shared/layouts/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

export const routes: Routes = [
    {path:'login',component:DefaulComponent,children:[{path:'',component:LoginComponent}]},
    {path:"about",component:AboutComponent},
    {path:'products',component:ProductsComponent,children:[{path:'',component:ItemsComponent}]},
    {path:'product-details/:id',component:ProductDetailComponent},
    {path:"**",component:NotFoundComponent}
];
