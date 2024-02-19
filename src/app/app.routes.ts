import { Routes } from '@angular/router';
import { DefaulComponent } from './shared/layouts/defaul/defaul.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    {path:'login',component:DefaulComponent,children:[{path:'',component:LoginComponent}]}
];

