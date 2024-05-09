import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ICallbackFunction } from '../app/models/callback.model';
@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor(private router:Router) {}
  AlertErrorDialog(data:string,title:string)
  { 
   Swal.fire({
      icon:'error',
      title:title,
      text:data
   });
  }
  AlertInfoDialog(data:string,title:string)
  { 
   Swal.fire({
      icon:'info',
      title:title,
      text:data
   });
  }
  AlertQuestionDialog(data:string,title:string)
  { 
   Swal.fire({
      icon:'question',
      title:title,
      text:data
   });
  }

  AlertWarningDialog(data:string,title:string)
  { 
   Swal.fire({
      icon:'warning',
      title:title,
      text:data
   });
  }
  AlertSuccessDialog(data:string,title:string)
  { 
   Swal.fire({
      icon:'success',
      title:title,
      text:data
   });
  }

  ConfirmDeleteDeviceDialog(cb:ICallbackFunction,username:string,device_name:string,title:string)
  {
   Swal.fire(
   {
   title:title,
   confirmButtonText:'Yes',
   denyButtonText:'No',
   showDenyButton:true,
   showCancelButton:false,
   customClass: {
      actions: 'my-actions',
      confirmButton: 'order-2',
      denyButton: 'order-3',
    },
   }).then(async res=>{
      if(res.isConfirmed)
         {
         await cb(username,device_name);
         location.reload();
         }
   });
  }
   
  PrompAddDeviceDialog(cb:ICallbackFunction,username:string,title:string)
  {
   Swal.fire({
      title:title,
      input:'text',
      showCancelButton:true,
      confirmButtonText:'Add',
      cancelButtonText:'Cancel',
      preConfirm:(val)=>{
         if(!val)
            {
               Swal.showValidationMessage("Please enter your device name");
            }
         return val;
      }
   }).then(async(res)=>{
      if(res.isConfirmed)
         {
            const device_name=res.value;
            await cb(username,device_name);
            location.reload();
         }
   });
  }
 
}
