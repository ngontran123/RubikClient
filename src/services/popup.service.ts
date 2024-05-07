import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ICallbackFunction } from '../app/models/callback.model';
@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor() {}
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
   }).then(res=>{
      if(res.isConfirmed)
         {
         cb(username,device_name);
         Swal.fire("Delete Device successfully",'Success','success');
         }
   });
  }

 
}
