import { Routes } from '@angular/router';
import { DefaulComponent } from './shared/layouts/defaul/defaul.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
    {path:'login',component:DefaulComponent,children:[{path:'',component:LoginComponent}]},
    {path:"about",component:AboutComponent},
    {path:"**",component:NotFoundComponent}
];

