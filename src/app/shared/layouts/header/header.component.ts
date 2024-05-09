import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit
{ 
  avatar=localStorage.getItem("AVATAR");
  user=JSON.parse(localStorage.getItem("ACCOUNT") as string);
  constructor(private router:Router)
  {
  }
  ngOnInit(): void 
  {
  }
  signOut()
  {
    localStorage.removeItem("TOKEN");
    
    this.router.navigate(["/login"]);
  }
  
  navigateProfile()
  {
    var route=`/profile/${this.user.username}`;
    this.router.navigate([route]);
  }

  navigateDevices()
  {
    var route = `/device/${this.user.username}`;
    this.router.navigate([route]);
  }

} 
{
}
