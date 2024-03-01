import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/layouts/header/header.component';
import { Router,NavigationStart } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rbApp';
  showHeader:boolean=true;
 
  constructor(private router:Router)
  {
    router.events.forEach((e)=>{

  if(e instanceof NavigationStart)
  {  
   var token=localStorage.getItem('TOKEN');
    if(e['url'] =="/")
    {  
      if(token!=null && token!="")
      { 
        router.navigate(['/about']);
      }
      else
      {
      router.navigate(['/login']);
      }
    }
    if(e['url']=='/login')
    { 
      this.showHeader=false;
      if(token!=null && token!="")
      { 
        router.navigate(['/about']);
      }
    }

    else{
      if(e['url']=='/')
      {
       this.showHeader=false;
      }  
      else
      {
      this.showHeader=true;
      }
    }
  }
    });
  }

}
