import { Component, OnInit } from '@angular/core';
import { HandleService } from '../../../services/handle.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers:[HandleService]
})
export class ProfileComponent implements OnInit{
  constructor(private handleService:HandleService,private route:ActivatedRoute)
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

  getProfilePage()
  {
    var username=this.route.snapshot.paramMap.get('username');
    this.handleService.getProfilePage(username as string); 
  }
   ngOnInit(): void 
   { 
    this.getProfilePage();
    this.role=this.convertRole(this.user.role_id as number);   }
}
