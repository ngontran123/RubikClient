import { Injectable,Inject, ElementRef } from '@angular/core';
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

  async initMqtt()
  {
    var response=await axios.get(`${environment.server_url}/mqtt_connect`,{headers:{'Authorization':this.token}}).catch(err=>{
      if(err.response.status==401)
        {
          this.popupService.AlertErrorDialog(err.response.data.message,"Init Mqtt failed");

        }
    });
  }

  async transmitMqtt(command:string)
  {
    var content={command:command};
    var response =await axios.post(`${environment.server_url}/mqtt_transmit`,content,{headers:{'Authorization':this.token}}).then((res)=>{
      this.popupService.AlertSuccessDialog(res.data.message,"Success");

    }).catch(err=>{
      if(err.response.status==401)
        {
          this.popupService.AlertErrorDialog(err.response.data.message,"Transmit Mqtt failed");
        }
      });
  }

  async getProfilePage(username:string)
  {
  var response=await axios.get(`${environment.server_url}/profile/${username}`,{headers:{Authorization:this.token}}).then(res=>{
  }).catch(err=>{
   if(err.response.status==401)
   {
    localStorage.removeItem('TOKEN');
    this.route.navigate(['/login']);
    
   }
  });
  }
   
backHomePage()
{
  this.route.navigate(['/about']);
}

  async getRubikById(id:string)
  {

   var response=await axios.get(`${environment.server_url}/product-details/${id}`,{headers:{Authorization:this.token}}).then((res)=>
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
  var response = await axios.get(`${environment.server_url}/about`,{headers:{Authorization:this.token}}).catch(err=>{
    if(err.response.status == 401)
    { 
   
      localStorage.removeItem("TOKEN");
      this.route.navigate(['/login']);
      //this.popupService.AlertErrorDialog(err.response.data.message,"Get data failed");
    }
  });
}

async getDetailSolveRubikPage(name:string)
{
  var response = await axios.get(`${environment.server_url}/rubik-solve/${name}`,{headers:{Authorization:this.token}}).catch(err=>{
   if(err.response.status==401)
   {
    localStorage.removeItem('TOKEN');
    this.route.navigate(['/login']);
   }
  });
}

async getSolvableRubik()
{
 var solvable_rubik_list=["Rubik's Coach Cube","Rubik's 3x3","Rubik’s Apprentice 2x2"];
 for(let i=0;i<solvable_rubik_list.length;i++)
 {  var rubik=solvable_rubik_list[i];
    var res=await axios.get(`${environment.server_url}/product-details/${rubik}`,{headers:{Authorization:this.token}}).then((response)=>{
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

async solveRubik(name:string,colors:string[])
{  
  var req_data={colors:colors};
  var data:string='';
  const res=await axios.post(`${environment.server_url}/solve_rubik/${name}`,req_data,{headers:{Authorization:this.token}}).then(response=>{
    data=response.data.message;
  }).catch(err=>{
     if(err.response.status==401)
     {
      this.popupService.AlertErrorDialog(err.response.data.message,'Solve failed');
     }
  });
  return data;
}

async loadVideo(video_ref:ElementRef)
{
  var response = await axios.get(`${environment.server_url}/load_video`,{headers:{Authorization:this.token},responseType:'blob'}).then((response)=>{   
    const blob= new Blob([response.data],{type:'image/jpeg'});
    const url= URL.createObjectURL(blob);
    video_ref.nativeElement.src=url;
  });
}
}
