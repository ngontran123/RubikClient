import { Routes } from '@angular/router';
import { DefaulComponent } from './shared/layouts/defaul/defaul.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AboutComponent } from './pages/about/about.component';
import { ItemsComponent } from './pages/items/items.component';
import { ProductsComponent } from './shared/layouts/products/products.component';

export const routes: Routes = [
    {path:'login',component:DefaulComponent,children:[{path:'',component:LoginComponent}]},
    {path:"about",component:AboutComponent},
    {path:'product',component:ItemsComponent},
    {path:'products',component:ProductsComponent,children:[{path:'',component:ItemsComponent}]},
    {path:"**",component:NotFoundComponent}
];

