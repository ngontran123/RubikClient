import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../environments/environment';
import { PopupService } from '../../../services/popup.service';
import { HeaderComponent } from '../../shared/layouts/header/header.component';
import { Subscription,timer } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [PopupService]
})
export class LoginComponent implements OnInit,OnDestroy {
      loginForm!:FormGroup;
      loginRetryTime:number=0;
      timerSubcribe!:Subscription;
      lockedTime!:Date;
      remainingTime!:number;
      isLocked:boolean=false;
      standard_remaing_time:string='';
      constructor(private fb:FormBuilder,private popupService:PopupService,private router:Router)
      {
      }
      ngOnInit(): void {
        this.loginForm = this.fb.group(
          {
            username:new FormControl('',[Validators.required]),
            password:new FormControl('',[Validators.required])
            
          });
          this.timerSubcribe=timer(0,1000).subscribe(()=>{
           const current_time=new Date(Date.now());
           if(this.isLocked)
           {
                this.remainingTime=Math.ceil((this.lockedTime.getTime()-current_time.getTime())/1000);
                var second_remain=(this.remainingTime%60)<10?'0'+(this.remainingTime%60):(this.remainingTime%60);
                if(this.remainingTime<60)
                { 
                  this.standard_remaing_time=`00:${second_remain}`;
                }
                else
                {
                  this.standard_remaing_time=`${Math.floor(this.remainingTime/60)}:${second_remain}`;
                }
                if(this.remainingTime<0)
                { 
                  this.remainingTime=0;
                  this.isLocked=false;
                  this.loginRetryTime=0;
                }
           }  
          });
      }

      ngOnDestroy(): void {
        if(this.timerSubcribe)
        { 
          this.timerSubcribe.unsubscribe();
        }
      }
      async onSubmitForm()
      { 
        if(!this.loginForm.valid)
        {
          this.loginForm.markAllAsTouched();
        }
        else
        { 
        try{
         await axios.post(`${environment.server_url}/login`,this.loginForm.value).then((res)=>{
          if(this.isLocked)
          { 
           this.popupService.AlertErrorDialog(`You have been locked from logging in ${this.standard_remaing_time}`,"Login Error");
          }
          else
          {
          localStorage.setItem("TOKEN",res.data.token);
          localStorage.setItem("AVATAR",res.data.avatar);
          this.router.navigate(['/about']);
          }
          }).catch((err)=>{
              if(err!=null)
              {  
               if(!this.isLocked)
               {
                this.loginRetryTime+=1;
               } 
                if(this.isLocked)
                 {
                  this.popupService.AlertErrorDialog(`You have been locked from logging in ${this.standard_remaing_time}`,"Login Error");
                 }
                
                if(this.loginRetryTime>5)
                { if(!this.isLocked)
                  {
                  this.lockedTime=new Date(Date.now()+2*60*1000);
                  this.isLocked=true;
                  this.popupService.AlertErrorDialog(`You have been locked from logging in 2 minutes`,"Login Error");
                  }
                }
                else
                {
                if(err.response?.status===401)
                { 
                  this.popupService.AlertErrorDialog(err.response.data.message,"Login Error");                 
                }
              }
              
              }
          });
        }
        catch(error)
        {
          console.log(error);
        }
        }
      }
}
