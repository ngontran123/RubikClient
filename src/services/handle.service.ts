import { Injectable,Inject } from '@angular/core';
import { IRubik } from '../app/models/item.model';
import axios from 'axios';
import { environment } from '../environments/environment';
import { PopupService } from './popup.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class HandleService {
  constructor(private popupService:PopupService,private route:Router){}//private route:Router) { }
   rubiks:IRubik[]=[];
   rubik!:IRubik;
   token=localStorage.getItem('TOKEN');
  async getAllRubiks()
   {
    var response =await axios.get(`${environment.server_url}/get-rubik`,{headers:{'Authorization':this.token}}).then((res)=>
   {
  this.rubiks=res.data.list;
  return this.rubiks;
    }).catch(err=>{
    if(err!=null)
    {
      if(err.response.status==401)
      {
       this.route.navigate(['/login']);  
       this.popupService.AlertErrorDialog(err.response.data.message,"Get data failed");
      }
    }
    });
    return this.rubiks; 
   }
   
  async getRubikById(id:string)
  {

   var response=await axios.get(`${environment.server_url}/product-details/${id}`,{headers:{'Authorization':this.token}}).then((res)=>
   {
    this.rubik=res.data.data;
    return this.rubik;
   }).catch(err=>{
       if(err.response.status == 401)
       {
       this.route.navigate(['/login']);
        this.popupService.AlertErrorDialog(err.response.data.message,"Get data failed");
       }
   });
   return this.rubik;
}

async getAboutPage()
{
  var response = await axios.get(`${environment.server_url}/about`,{headers:{'Authorization':this.token}}).catch(err=>{
    if(err.response.status == 401)
    {
      this.route.navigate(['/login']);
      //this.popupService.AlertErrorDialog(err.response.data.message,"Get data failed");
    }
  });
}

async getSolvablerRubik()
{
  
}

}
