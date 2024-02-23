import { Injectable } from '@angular/core';
import { IRubik } from '../app/models/item.model';
import axios from 'axios';
import { environment } from '../environments/environment';
import { PopupService } from './popup.service';
@Injectable({
  providedIn: 'root'
})
export class HandleService {
  constructor(private popupService:PopupService) { }
   rubiks:IRubik[]=[];
  async getAllRubiks()
   {
    var response =await axios.get(`${environment.server_url}/get-rubik`).then((res)=>
   {
  this.rubiks=res.data.list;
  return this.rubiks;
    }).catch(err=>{
    if(err!=null)
    {
      if(err.response.status==401)
      {
       
       this.popupService.AlertErrorDialog(err.response.data.message,"Get data failed");
      }
    }
    });
    return this.rubiks; 
   }
}
