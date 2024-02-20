import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
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
 
}
