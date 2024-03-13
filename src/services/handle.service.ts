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
   solvable_rubiks:IRubik[]=[];
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
       localStorage.removeItem("TOKEN");
       this.route.navigate(['/login']);  
       this.popupService.AlertErrorDialog(err.response.data.message,"Get data failed");
      }
    }
    });
    return this.rubiks; 
   }
   
backHomePage()
{
  this.route.navigate(['/about']);
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
       localStorage.removeItem("TOKEN");
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
   
      localStorage.removeItem("TOKEN");
      this.route.navigate(['/login']);
      //this.popupService.AlertErrorDialog(err.response.data.message,"Get data failed");
    }
  });
}

async getSolvableRubik()
{
 var solvable_rubik_list=["Rubik's Coach Cube","Rubik's 3x3","Rubik’s Apprentice 2x2"];
 for(let i=0;i<solvable_rubik_list.length;i++)
 {  var rubik=solvable_rubik_list[i];
    var res=await axios.get(`${environment.server_url}/product-details/${rubik}`,{headers:{'Authorization':this.token}}).then((response)=>{
      this.solvable_rubiks.push(response.data.data);
    }).catch(err=>{
      if(err.response.status == 401)
      {
      localStorage.removeItem("TOKEN");
      this.route.navigate(['/login']);
       this.popupService.AlertErrorDialog(err.response.data.message,"Get data failed");
      }
    });
  }
  return this.solvable_rubiks;
}

async postProduct(formdata:any)
{
 var res=await axios.post(`${environment.server_url}/product`,formdata,{headers:{Authorization:this.token}}).then((response)=>
 {
   this.popupService.AlertSuccessDialog(response.data.message,'Add product success');
 }).catch(err=>{
   if(err.response.status==401)
  { 
     this.popupService.AlertErrorDialog(err.response.data.message,'Add product failed');
  }
 });
 
}

async postAccount(formdata:any)
{
  var res=await axios.post(`${environment.server_url}/add-account`,formdata,{headers:{Authorization:this.token}}).then((response)=>{
this.popupService.AlertSuccessDialog(response.data.message,'Add account success');
  }).catch(err=>{
    if(err.response.status==401)
    {
      this.popupService.AlertErrorDialog(err.response.data.message,'Add account failed');
    }
  });
} 

async getAccountPage()
{
  var res=await axios.get(`${environment.server_url}/add-account`,{headers:{Authorization:this.token}}).catch(err=>{
    if(err.response.status==401)
    { 
      localStorage.removeItem('TOKEN');
      this.route.navigate(['/login']);
      this.popupService.AlertErrorDialog(err.response.data.message,'Get data failed');
    }
  })
}

async getAddProduct()
{
  var res=await axios.get(`${environment.server_url}/product`,{headers:{Authorization:this.token}}).catch(err=>{
    if(err.response.status==401)
    { localStorage.removeItem('TOKEN');
      this.route.navigate(['/login']);
      this.popupService.AlertErrorDialog(err.response.data.message,'Get data failed');
    }
  })
}

}
