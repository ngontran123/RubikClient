import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../environments/environment';
import { PopupService } from '../../../services/popup.service';
import { HeaderComponent } from '../../shared/layouts/header/header.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [PopupService]
})
export class LoginComponent implements OnInit {
      loginForm!:FormGroup;
      constructor(private fb:FormBuilder,private popupService:PopupService)
      {
      }
      ngOnInit(): void {
        this.loginForm = this.fb.group(
          {
            username:new FormControl('',[Validators.required]),
            password:new FormControl('',[Validators.required])
          });
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
          localStorage.setItem("TOKEN",res.data.token);
          localStorage.setItem("AVATAR",res.data.avatar);
          }).catch((err)=>{
              if(err!=null)
              {
                if(err.response?.status===401)
                { 
                  this.popupService.AlertErrorDialog(err.response.data.message,"Login Error");                 
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
