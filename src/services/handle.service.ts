import { Injectable,Inject, ElementRef } from '@angular/core';
import { IRubik } from '../app/models/item.model';
import axios from 'axios';
import { environment } from '../environments/environment';
import { PopupService } from './popup.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HandleService {

  constructor(private popupService:PopupService,private route:Router){
  }//private route:Router) { }
   rubiks:IRubik[]=[];
   rubik!:IRubik;
   solvable_rubiks:IRubik[]=[];
   token=localStorage.getItem('TOKEN');
   EventSource: any = window['EventSource'];
   eventSource!:EventSource;
   socket!:any;
  async getAllRubiks()
   {
    var response=await axios.get(`${environment.server_url}/get-rubik`,{headers:{'Authorization':this.token}}).then((res)=>
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

   async checkProductToken()
   {
    var response = await axios.get(`${environment.server_url}/products`,{headers:{Authorization:this.token}}).catch(err=>{
      if(err.response.status==400 || err.response.status==401)
        {
          localStorage.removeItem("TOKEN");
          this.route.navigate(['/login']);  
          this.popupService.AlertErrorDialog(err.response.data.message,"Get data failed");
        }
      }
    )
   }

  async initMqtt(username:string)
  { 
    var token=localStorage.getItem("TOKEN");
    this.eventSource=new EventSource(`${environment.server_url}/mqtt_connect/${username}`);
    var response=await axios.get(`${environment.server_url}/mqtt_connect/${username}`,{headers:{'Authorization':token}}).catch(err=>{
      if(err.response.status==401)
        {
          this.popupService.AlertErrorDialog(err.response.data.message,"Init Mqtt failed");
        }
    });
  }

  checkStatus(username:string)
  {
    var token = localStorage.getItem('TOKEN');
    var response = axios.get(`${environment.server_url}/mqtt_check_device_status/${username}`,{headers:{Authorization:token}}).catch(err=>{
      if(err.response.status==401)
        {
          this.popupService.AlertErrorDialog(err.response.data.message,"Check status device failed");
        }
    })
  }

  async transmitMqtt(command:string,topic:string)
  {
    var content={command:command,topic:topic};
    var response =await axios.post(`${environment.server_url}/mqtt_transmit`,content,{headers:{'Authorization':this.token}}).then((res)=>{
      this.popupService.AlertSuccessDialog(res.data.message,"Success");
    }).catch(err=>
      {
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
      this.popupService.AlertErrorDialog(err.response.data.message,"Get data failed");
    }
  });
}

async getDevicePage(username:string)
{ 
  var response = await axios.get(`${environment.server_url}/device/${username}`,{headers:{Authorization:this.token}}).catch(err=>{
    if(err.response.status == 401)
    { 
      localStorage.removeItem("TOKEN");
      this.route.navigate(['/login']);
      this.popupService.AlertErrorDialog(err.response.data.message,"Get data failed");
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

async getDeviceList(username:string):Promise<any>
{  
  var list;
  await axios.get<any>(`${environment.server_url}/device/${username}`,{headers:{Authorization:this.token}}).then(response=>{
  list=response.data.message;
  }).catch(err=>{
    if(err.response.status==401 || err.response.status==400)
      {
       this.popupService.AlertErrorDialog(err.response.data.message,'Solve failed');
      }
  });
  return list;
}

async resetCheckingStatus(username:string)
{ 
  var payload={username:username};
  var token=localStorage.getItem("TOKEN");
  await axios.post(`${environment.server_url}/reset_checking_status`,payload,{headers:{Authorization:token}}).catch(err=>{
    if(err.response.status==401 || err.response.status==400)
      {
       this.popupService.AlertErrorDialog(err.response.data.message,'Reset Status Failed');
      }});
}

async addNewDevice(username:string,device_name:string)
{
 try{
  var data={username:username,device_name:device_name};
  var token=localStorage.getItem("TOKEN");
  var popupService_tmp:PopupService;
  await axios.post(`${environment.server_url}/add_device`,data,{headers:{Authorization:token}}).catch(err=>{
     if(err.response.status==401 || err.response.status==400)
      {
        popupService_tmp.AlertErrorDialog(err.response.data.message,"Add Device Failed");
      }
  });
  }
  catch(err)
  {
    alert(err.message);
  }
}

async deleteDevice(username:string,device_name:string)
{
try{
 var data={username:username,device_name:device_name};
 var token=localStorage.getItem("TOKEN");
 var popupService_tmp:PopupService;

 await axios.post(`${environment.server_url}/delete_device`,data,{headers:{Authorization:token}}).catch(err=>{
  if(err.response.status==401 || err.response.status==400)
    {
      popupService_tmp.AlertErrorDialog(err.response.data.message,"Delete Device Failed");
    }
 });
}
catch(err)
{
}
}

readStreamKafka(username:string):Observable<any>
{  
  return new Observable(observer=>
    {
  try
   {
    this.closeStreamKafka();
     this.eventSource.onmessage=(event)=>
     { alert(event.data);
      observer.next(event.data);
     }
     this.eventSource.onerror=(err)=>
    {
    console.log(err);
    console.log("Connection has been closed.");
    alert("Error");
    observer.error(err);
    }
     this.eventSource.onopen = (e) => 
    {
      alert("open:"+this.eventSource.readyState);
      console.log('connection open');
      console.log("open:"+e);
    }
  }
  catch(exp)
  {
    alert("EXCEPTION HERE IS:"+exp.message);
  }
  });
  
 

   
}

closeStreamKafka()
{
  if(this.eventSource)
    {
      this.eventSource.close(); 
    }
}


async loadVideo(video_ref:ElementRef)
{
  var response = await axios.get(`${environment.server_url}/load_video`,{headers:{Authorization:this.token},responseType:'blob'}).then((response)=>{   
    const blob= new Blob([response.data],{type:'image/jpeg'});
    const url= URL.createObjectURL(blob);0
    video_ref.nativeElement.src=url;
  });
}
}
