import { Component } from '@angular/core';
import { HandleService } from '../../../services/handle.service';
import { PopupService } from '../../../services/popup.service';
import { OnInit } from '@angular/core';
import { Observable, Subscriber, Subscription, interval } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

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
   username:string='';
   
    constructor(private handleService:HandleService,private popupService:PopupService)
    {
      
    } 

ngOnInit():void
 {  this.getDevicePage();
   var user=JSON.parse(localStorage.getItem('ACCOUNT')||'{}');
   this.username=user.username;
   this.handleService.getDeviceList("helloman123").then(device=>{
   this.listDevices=device;
 });
  this.handleService.readStreamKafka().subscribe(data=>{
    var message =JSON.parse(data).message;
    alert(message);
  });
 }


getDevicePage()
{
  this.handleService.getDevicePage(this.username);  
}
onFileChanges(event:any)
{
 const files=event.target.files as FileList;
 if(files.length>0)
   {
      const file=files[0];
      this.readFile(file);
   }
 else
 {
   this.popupService.AlertErrorDialog("No entry",'Read File Exception');   
 }
}

 readFile(file:File)
 {
   try
   {
     const reader=new FileReader();
     reader.onload=async(e:any)=>
   {
     const data=new Uint8Array(e.target.result);
     const workbook=XLSX.read(data,{type:'array'});
     const sheetname=workbook.SheetNames[0];
     const sheet=workbook.Sheets[sheetname];
     const deviceNames=XLSX.utils.sheet_to_json(sheet,{header:1}).map(row=>row);
     for(let i=1;i<deviceNames.length;i++)
      {
        var device=deviceNames[i] as Array<string>;
        var device_name_handle=device.toString().split(',');
        var device_name=device_name_handle[0];
        await this.handleService.addNewDevice(this.username,device_name);
      }
      location.reload();
   };
     reader.onerror=(err)=>
     {
      alert("Error occurs while reading file:"+err);
     }
     reader.readAsArrayBuffer(file);
   }
   catch(err)
   {
      alert('Error in reading file');
   }
 }
 

  exportTableToExcel()
  {
    var tableData:any[]=[];
    var tableDta:any[]=[];
    for(let i=0;i<this.listDevices.length;i++)
      {
       var device={Id:(i+1),Name:this.listDevices[i].device_name,Created_Date:this.listDevices[i].created_date};
       tableData.push(device);
      }
   var datetime=new Date;
   var datePipe:DatePipe=new DatePipe("en-US");
   var datetime_str=datePipe.transform(datetime,"yyyy/MM/dd_HH:mm:ss");
   const file_name=`Device_List_${datetime_str}`;
   this.exportToFileExcel(tableData,file_name);
  }

 exportToFileExcel(tableData:any[],fileName:string)
 {
   const worksheet:XLSX.WorkSheet=XLSX.utils.json_to_sheet(tableData);
   const workbook:XLSX.WorkBook=XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook,worksheet,"Sheet1");
   XLSX.writeFile(workbook,`${fileName}.xlsx`);
 }

  async addDevice()
 {
   
    this.popupService.PrompAddDeviceDialog(this.handleService.addNewDevice,this.username,"Add new device");
    //await this.handleService.addNewDevice(username,device_name);    
 }


 async deleteDevice(username:string,device_name:string)
 {  
  this.popupService.ConfirmDeleteDeviceDialog(this.handleService.deleteDevice,username,device_name,"Are you sure?");
 }


}
