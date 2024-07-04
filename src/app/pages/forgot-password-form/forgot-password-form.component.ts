import { Component, EventEmitter, Output,OnInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QrCodeModule} from 'ng-qrcode';
import { HandleService } from '../../../services/handle.service';
import { PopupService } from '../../../services/popup.service';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [QrCodeModule,ReactiveFormsModule],
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './forgot-password-form.component.scss'
})
export class ForgotPasswordFormComponent {
@Output() close_form = new EventEmitter<void>();
@ViewChildren('otp1,otp2,otp3,otp4,otp5,otp6') list_child!:QueryList<ElementRef>;
@ViewChild('password') password!:ElementRef;
@ViewChild('repassword') repassword!:ElementRef;
sendOtpForm!:FormGroup;
sendForm!:FormGroup;
qrValue:string='';
otp_value:string='';
qr_input_value:string='';
constructor(private fb:FormBuilder,private passwordfb:FormBuilder,private handleService:HandleService,private popupService:PopupService)
{
}

ngOnInit():void
{
 this.qrValue=this.generateQRCode();
 
 this.sendOtpForm=this.fb.group(
 {
  phone:new FormControl('',[Validators.required]),
  qr:new FormControl('',[Validators.required])
 });

 this.sendForm=this.passwordfb.group({
   password:new FormControl('',[Validators.required]),
   reconfirm_password:new FormControl('',[Validators.required])
 });
}

qr_onChange(event:Event)
{
  this.qr_input_value=(event.target as HTMLInputElement).value;
}

getRandomNumber(min:number,max:number):number
{
 return Math.round((Math.random()*(max-min)+min));
}

generateQRCode():string
{  
  var value='';
  this.otp_value='';
  for(let i=0;i<6;i++)
    { 
      var ramdom_num=this.getRandomNumber(65,90) as number;
      value+=String.fromCharCode(ramdom_num);
      var otp_val=(ramdom_num-65);
      otp_val=otp_val%10;
      this.otp_value+=otp_val;
    } 
    return value;
}

async onSendOtp()
{
  if(!this.sendOtpForm.valid)
    {
    this.sendOtpForm.markAllAsTouched(); 
    }
  else
  {
    if(this.qr_input_value!=this.qrValue)
      {
        this.popupService.AlertErrorDialog("QR Code is not match","Error");
        return;
      }
    await this.handleService.forgotPassword(this.sendOtpForm);
  }
}


onInput(e:Event,index:number)
{    const input =e.target as HTMLInputElement;
     if(index<5 && input.value.length==1)
      { 
        this.list_child.toArray()[index+1].nativeElement.focus();
      }
}

onKeyDown(e:KeyboardEvent,index:number)
{
  const input=e.target as HTMLInputElement;
  
  if(e.key=="Backspace" && input.value.length==0 && index>0)
    {
      this.list_child.toArray()[index-1].nativeElement.focus();
    }
}


async onChangePassword()
{
   const curr_password=this.password.nativeElement.value;
   const re_password= this.repassword.nativeElement.value;
   var otp_input='';
   for(var otp_pin of this.list_child)
    {
     otp_input+=otp_pin.nativeElement.value;
    }
  if(curr_password=='' || re_password=='')
    {
      this.popupService.AlertErrorDialog('Your new password cannot be left empty','Error');
      return;
    }
  else if(curr_password!=re_password)
    {
    this.popupService.AlertErrorDialog("Your password is not matched","Error");
    return;
    }
    if(otp_input=='')
    {
      this.popupService.AlertErrorDialog("Please fill your Otp","Error");
      return;
    }
    else if(this.otp_value != otp_input)
    { 
    this.popupService.AlertErrorDialog(`Your OTP is not correct`,"Error");
    return;
    }
  else
  { 
    if(!this.sendForm.valid || !this.sendOtpForm.valid)
    { 
    if(!this.sendForm.valid)
      {
      this.sendForm.markAllAsTouched(); 
      }
      else
      {
      this.sendOtpForm.markAllAsTouched();
      }
    }
    else
    {  
      var phone = this.sendOtpForm.get('phone')?.value;
      var phone_sendform=this.sendForm.get('phone');
      if(!phone_sendform)
        {
      this.sendForm.addControl('phone',new FormControl(phone));
        }
        else
        {
          this.sendForm.get('phone')?.setValue(phone);
        }
      
      await this.handleService.resetPassword(this.sendForm);

      for(var otp_pin of this.list_child)
        {
          otp_pin.nativeElement.value='';
        }
      this.sendForm.reset();
      this.sendOtpForm.reset();
    }
  }
}

closeForm()
{
  this.close_form.emit();
}
}
