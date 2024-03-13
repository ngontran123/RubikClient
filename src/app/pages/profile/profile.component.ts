import { Component, OnInit } from '@angular/core';
import { HandleService } from '../../../services/handle.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers:[HandleService]
})
export class ProfileComponent implements OnInit{
  constructor(private handleService:HandleService)
  {

  }
  user=JSON.parse(localStorage.getItem('ACCOUNT') as string);
  role!:string;
  convertRole(role_id:number)
  { let role='';
    switch(role_id)
    {
      case 0:role='User';break;
      case 1:role='Admin';break;
    }
    return role;
  }
  backHomePage()
  {
    this.handleService.backHomePage();
  }
   ngOnInit(): void 
   { 
    this.role=this.convertRole(this.user.role_id as number);   }
}
