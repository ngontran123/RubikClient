import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../../services/popup.service';
import { HandleService } from '../../../services/handle.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/layouts/header/header.component';

@Component({
  selector: 'app-add-account',
  standalone: true,
  imports: [ReactiveFormsModule,HeaderComponent],
  templateUrl: './add-account.component.html',
  styleUrl: './add-account.component.scss',
  providers:[PopupService,HandleService]
})
export class AddAccountComponent implements OnInit{
  role_type_list:string[]=['User','Admin'];
  gender_list:string[] =['Male','Female','Other'];
  accountForm!:FormGroup;
  constructor(private fb:FormBuilder,private handleService:HandleService)
  {
  }
  ngOnInit(): void 
  {
    this.getAccountPage();
    this.accountForm=this.fb.group({
       username:new FormControl('',[Validators.required]),
       password:new FormControl('',[Validators.required]),
       email:new FormControl('',[Validators.required]),
       gender:new FormControl('',[Validators.required]),
       avatar:new FormControl('',[Validators.required]),
       role_id:new FormControl('',[Validators.required])
    });
  }

  convertRoleToId(role:string)
  {
    let role_id=0;
    switch(role)
    {
      case 'User':role_id=0;break;
      case 'Admin':role_id=1;break;
    }
    return role_id;
  }


  async getAccountPage()
  {
    await this.handleService.getAccountPage();
  }

  async onSubmitForm()
  {
   if(!this.accountForm.valid)
   { 
    this.accountForm.markAllAsTouched();
   }
   else
   {
   this.accountForm.value.role_id=this.convertRoleToId(this.accountForm.value.role_id);
   await this.handleService.postAccount(this.accountForm.value);
   this.accountForm.reset();
   }
  }
}
