import { Routes } from '@angular/router';
import { DefaulComponent } from './shared/layouts/defaul/defaul.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AboutComponent } from './pages/about/about.component';
import { ItemsComponent } from './pages/items/items.component';
import { ProductsComponent } from './shared/layouts/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { SolveComponent } from './pages/solve/solve.component';
import { RubikSolveComponent } from './pages/rubik-solve/rubik-solve.component';
import { ColorPaletteComponent } from './shared/layouts/color-palette/color-palette.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { AddAccountComponent } from './pages/add-account/add-account.component';
export const routes: Routes = [
    {path:'login',component:DefaulComponent,children:[{path:'',component:LoginComponent}]},
    {path:"about",component:AboutComponent},
    {path:'products',component:ProductsComponent,children:[{path:'',component:ItemsComponent}]},
    {path:'product-details/:id',component:ProductDetailComponent},
    {path:'solve',component:SolveComponent},
    {path:'rubik-solve',component:RubikSolveComponent},
    {path:'color',component:ColorPaletteComponent},
    {path:'add-product',component:AddProductComponent},
    {path:'add-account',component:AddAccountComponent},
    {path:"**",component:NotFoundComponent}
];
