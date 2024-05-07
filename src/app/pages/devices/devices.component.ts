import { Component } from '@angular/core';
import { HandleService } from '../../../services/handle.service';
import { PopupService } from '../../../services/popup.service';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss',
  providers:[HandleService,PopupService]
})
export class DevicesComponent {
   listDevices!:any[];
   showForm:boolean=false;
    constructor(private handleService:HandleService,private popupService:PopupService)
    {
    } 

ngOnInit():void
 { 
  this.handleService.getDeviceList("helloman123").then(device=>{
  this.listDevices=device;
 });
  this.handleService.readStreamKafka().subscribe(data=>{
    var message =JSON.parse(data).message;
    alert(message);
  });
 }

  async addDevice(device_name:string)
 {
    var user=JSON.parse(localStorage.getItem('ACCOUNT')||'{}');
    var username=user.username;
    await this.handleService.addNewDevice(username,device_name);    
 }

 async deleteDevice(username:string,device_name:string)
 {
  this.popupService.ConfirmDeleteDeviceDialog(this.handleService.deleteDevice,username,device_name,"Are you sure?");
 }



}
