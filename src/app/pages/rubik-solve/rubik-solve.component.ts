import { Component,ElementRef,HostListener, OnInit, OnDestroy,ViewChild} from '@angular/core';
import { ColorPaletteComponent } from '../../shared/layouts/color-palette/color-palette.component';
import { PopupService } from '../../../services/popup.service';
import { HandleService } from '../../../services/handle.service';
import { SesService } from '../../../services/ses.service';
import { ActivatedRoute, mapToCanActivateChild } from '@angular/router';
import { NotFoundComponent } from '../not-found/not-found.component';
import * as _ from 'lodash';
import { Subscription, combineAll, concat } from 'rxjs';
@Component({
  selector: 'app-rubik-solve',
  standalone: true,
  imports: [ColorPaletteComponent,NotFoundComponent],
  templateUrl: './rubik-solve.component.html',
  styleUrl: './rubik-solve.component.scss',
  providers:[PopupService,HandleService]
})
export class RubikSolveComponent implements OnInit {
  isShowThreeD:boolean=true;
  rubikName:string='';
  threeDColor:string = '#3d81f6';
  flatColor:string = 'transparent';
  startPosX!:number;
  startPostY!:number;
  isRotating:boolean=false;
  startRotateX:number=0;
  startRotateY:number=0;
  cubeRotateStyle:string='';
  rotationX:number=0;
  rotationY:number=0;
  curr_horizontal_idx:number=0;
  color_face:string[]=['green','red','blue','orange'];
  is_upside_down:boolean=false;
  curr_left_img:string='assets/images/curved-left-arrow.png';
  curr_right_img:string='assets/images/next.png';
  curr_up_down_img:string ='assets/images/down-arrow.png';
  btn_color:string='';
  rubik_block_color:string[]=[];
  rubik_2x2_block_color:string[]=[];
  color_disable:string[]=[];
  rubik_temp_arr!:string[];
  upside_down_horizontal_rote:number=0;
  horizontal_rotate:number=-48;
  list_device:any[]=[];
  is_camera_click:boolean=false;
  delay=(ms:number)=>new Promise(rs=>setTimeout(rs,ms));
   
  @ViewChild('video_player',{static:true}) video_player!:ElementRef;
  @ViewChild('log_area',{static:true}) log_area!:ElementRef;
   eventSubsribe!:Subscription;
  constructor(private popupService:PopupService,private handleService:HandleService,private sseService:SesService,private route:ActivatedRoute)
  {    
  }
 

  cameraClick()
  {
    this.is_camera_click=!this.is_camera_click;
    if(this.is_camera_click)
    {
       this.handleService.loadVideo(this.video_player);
    }
  }

  ngOnInit(): void 
  {
  this.getRubikName();
  this.checkTokenValid();
   this.getListDevice();
   this.initRubikBlock();
   this.rubik_temp_arr=Array(54).fill('');
   this.initColorDisable();
   var user=JSON.parse(localStorage.getItem("ACCOUNT") as string);
   var username=user.username;
  //  const text=this.log_area.nativeElement.value;
  //  this.log_area.nativeElement.value=text+'hello'+'\n';
  //  this.log_area.nativeElement.value=text+'fuck'+'\n';

   this.sseService.initEventSource(username).subscribe((data)=>
   {
  
    var val=data.data.split(':');
    var username_values=val[0].split('_');
    var username_value=username_values[0];
    
    var command=username_values[1]+':'+val[1];
   
   if(username_value==username)
    { 
     const text=this.log_area.nativeElement.value;
     this.log_area.nativeElement.value=text+command+'\n';
    }
   },error=>{
   });
  //  this.handleService.readStreamKafka().subscribe(data=>{
  //   alert(data);
  // },err=>{
  //   alert("Error:"+err);
  // });
  }
 
 
 getRubikName()
 {
   this.rubikName=this.route.snapshot.paramMap.get('name') as string;
 }
 
 async checkTokenValid()
 {
  await this.handleService.getDetailSolveRubikPage(this.rubikName);
 }

initColorDisable()
{
  for(let i=0;i<6;i++)
  {
    this.color_disable[i]='false';
  }
}

checkFrequencyColor(color:string)
{   
  var is_disable=this.countAllFrequency(color);
  let idx=this.getIndexColor(color);
  if(is_disable)
  {
    this.color_disable[idx]='true';
  }
  else
  {
    this.color_disable[idx]='false';
  }
}

getIndexColor(color:string)
{ 
  let idx=-1;
  switch(color)
  {
    case 'whitesmoke':idx=0;break;
    case 'orange':idx=1;break;
    case 'green':idx=2;break;
    case 'red':idx=3;break;
    case 'blue':idx=4;break;
    case 'yellow':idx=5;break;
  }
  return idx;
}

countAllFrequency(color:string):boolean
{ 
  let num_freq=this.rubik_block_color.filter(c=>c==color).length;
  if(num_freq>=9)
  {
    return true;
  }
  return false;
}

showValue()
{
  alert("clickable");
}
switchThreeD()
{
  this.isShowThreeD=true;
  this.threeDColor='#3d81f6';
  this.flatColor='transparent';
}
switchFlatView()
{
  this.isShowThreeD=false;
  this.threeDColor='transparent';
  this.flatColor='#3d81f6';
}

startRotate(event:MouseEvent)
{ 
  this.isRotating=true;
  this.startPosX=event.clientX;
  this.startPostY=event.clientY;

}

stopRotate()
{ 
  this.isRotating=false;
}


@HostListener('document:mousemove',['$event'])
rotateCube(event:MouseEvent)
{
  if(this.isRotating)
  { 
    // const deltaX=event.clientX-this.startPosX;
    // const deltaY=event.clientY-this.startPostY;
    // const rotateX=this.startRotateX+(deltaY/5);
    // const rotateY=this.startPostY+(deltaX/5);
    // this.startRotateX=this.startPosX;
    // this.startRotateY=this.startPostY;
    this.startRotateX=event.clientX;
    this.startRotateY=event.clientY;
    const deltaX=this.startRotateX-this.startPosX;
    const deltaY=this.startRotateY-this.startPostY;
    this.rotationX+=deltaY*0.8;
    this.rotationY+=deltaX*0.8;
    this.startPosX=this.startRotateX;
    this.startPostY=this.startRotateY;
    console.log('X'+this.rotationX);
    console.log('Y'+this.rotationY);
    this.cubeRotateStyle=`rotateX(${this.rotationX}deg) rotateY(${this.rotationY}deg)`;
  }
}

rotateRightButton()
{
  this.curr_horizontal_idx-=1;
  if(this.curr_horizontal_idx<0)
  {
    this.curr_horizontal_idx=3;
  }
 if(!this.is_upside_down)
 {
  switch(this.curr_horizontal_idx)
{  
  case 0:this.cubeRotateStyle=`rotateX(-32deg) rotateY(-48deg)`;break;
  case 1: this.cubeRotateStyle=`rotateX(-32deg) rotateY(225deg)`;break;
  case 2: this.cubeRotateStyle=`rotateX(-32deg) rotateY(130deg)`;break;
  case 3: this.cubeRotateStyle=`rotateX(-32deg) rotateY(45deg)`;break;
}
 }
 else
 {
  this.upside_down_horizontal_rote-=90;
  switch(this.curr_horizontal_idx)
{ 
  case 0:this.cubeRotateStyle=`rotateX(148deg) rotateY(${this.upside_down_horizontal_rote}deg)`;break;
  case 1:this.cubeRotateStyle=`rotateX(148deg) rotateY(${this.upside_down_horizontal_rote}deg)`;break;
  case 2:this.cubeRotateStyle=`rotateX(148deg) rotateY(${this.upside_down_horizontal_rote}deg)`;break;
  case 3:this.cubeRotateStyle=`rotateX(148deg) rotateY(${this.upside_down_horizontal_rote}deg)`;break;
}
if(this.curr_horizontal_idx==0)
{
  this.upside_down_horizontal_rote=230;
}
 }
}

rotateLeftButton()
{
this.curr_horizontal_idx+=1;
if(this.curr_horizontal_idx>3)
{
  this.curr_horizontal_idx=0;
}
if(!this.is_upside_down)
{
 this.horizontal_rotate+=100;
switch(this.curr_horizontal_idx)
{
  case 0:this.cubeRotateStyle=`rotateX(-32deg) rotateY(-48deg)`;break;
  case 1: this.cubeRotateStyle=`rotateX(-32deg) rotateY(225deg)`;break;
  case 2: this.cubeRotateStyle=`rotateX(-32deg) rotateY(130deg)`;break;
  case 3: this.cubeRotateStyle=`rotateX(-32deg) rotateY(45deg)`;break;
}
}
else
{this.upside_down_horizontal_rote+=90;
  switch(this.curr_horizontal_idx)
{ 
  case 0:this.cubeRotateStyle=`rotateX(148deg) rotateY(${this.upside_down_horizontal_rote}deg)`;break;
  case 1:this.cubeRotateStyle=`rotateX(148deg) rotateY(${this.upside_down_horizontal_rote}deg)`;break;
  case 2:this.cubeRotateStyle=`rotateX(148deg) rotateY(${this.upside_down_horizontal_rote}deg)`;break;
  case 3:this.cubeRotateStyle=`rotateX(148deg) rotateY(${this.upside_down_horizontal_rote}deg)`;break;
}
if(this.curr_horizontal_idx==0)
{
  this.upside_down_horizontal_rote=230;
}
}
}

rotateUpsideDown()
{  this.is_upside_down=!this.is_upside_down
 if(this.is_upside_down)
 {
  switch(this.curr_horizontal_idx)
  {
   case 0:this.cubeRotateStyle=`rotateX(148deg) rotateY(230deg)`;this.upside_down_horizontal_rote=230;break;
   case 1:this.cubeRotateStyle=`rotateX(148deg) rotateY(680deg)`;this.upside_down_horizontal_rote=680;break;
   case 2:this.cubeRotateStyle=`rotateX(148deg) rotateY(410deg)`;this.upside_down_horizontal_rote=410;break;
   case 3:this.cubeRotateStyle=`rotateX(148deg) rotateY(140deg)`;this.upside_down_horizontal_rote=230;break;
  }
}
else{
  switch(this.curr_horizontal_idx)
  {
   case 0:this.cubeRotateStyle=`rotateX(-32deg) rotateY(-48deg)`;break;
   case 1:this.cubeRotateStyle=`rotateX(-32deg) rotateY(225deg)`;break;
   case 2:this.cubeRotateStyle=`rotateX(-32deg) rotateY(130deg)`;break;
   case 3: this.cubeRotateStyle=`rotateX(-32deg) rotateY(45deg)`;break;
  }
}
}


changeImage(image:string,direction:string)
{
  switch(direction)
  {
    case 'left':this.curr_left_img=image;break;
    case 'right':this.curr_right_img=image;break;
    case 'up-down':this.curr_up_down_img=image;break;
  }
}

getListDevice()
{
  var user=JSON.parse(localStorage.getItem('ACCOUNT')||'{}');
  var username=user.username;
this.handleService.getDeviceList(username).then((list)=>{
  this.list_device=list;
});
}

changeBtnColor(event:string)
{
  this.btn_color=event;
}

changeBlockColor(event:MouseEvent)
{

 const btn=event.currentTarget as HTMLButtonElement;
 const id =btn.dataset['field'] as string;
 var num_id=parseInt(id);
//  var current_color=this.rubik_block_color[num_id-1];
//  var curr_idx=this.getIndexColor(current_color);
//  var idx_new_color=this.getIndexColor(this.btn_color);
//  if(this.color_disable[idx_new_color]=='true')
//  {
//   this.popupService.AlertErrorDialog('You have used this color more than 9 times','Pick too much');
//   return;
//  }
//  if(this.color_disable[curr_idx]=='true' && idx_new_color!=curr_idx)
//  {
//   this.color_disable[curr_idx]='false';
//  }
if(this.rubikName=="Rubik's 3x3")
{
 this.rubik_block_color[num_id-1]=this.btn_color;
}
else if(this.rubikName=="Rubik’s Apprentice 2x2")
{
  this.rubik_2x2_block_color[num_id-1]=this.btn_color;
}
//  this.checkFrequencyColor(this.btn_color);
}

blankRubikBlock()
{  
  // var colors:string[]=['whitesmoke','orange','green','red','blue','yellow'];
  // for(let i=0;i<colors.length;i++)
  // {
  //   var count_color=this.rubik_block_color.filter(b=>b==colors[i]).length;
  //   alert(`Number of block of color ${colors[i]} is:${count_color}`);
  // }
 if(this.rubikName=="Rubik's 3x3 ")
 {
  for(let i=0;i<54;i++)
  {
    this.rubik_block_color[i]='grey';
  }
}
else if(this.rubikName="Rubik’s Apprentice 2x2")
{ for(let i=0;i<24;i++)
  {
  this.rubik_2x2_block_color[i]='grey';
  }
}
}
  initRubikBlock()
  {
   if(this.rubikName=="Rubik's 3x3")
   {
    for(let i=0;i<54;i++)
    { 
      if(i>=0 && i<9)
      {
      this.rubik_block_color.push('whitesmoke')
      }
      else if(i>=9 && i<18)
      {
        this.rubik_block_color.push('orange');
      }
      else if(i>=18 && i<27)
      {
        this.rubik_block_color.push('green');
      }
      else if(i>=27 && i<36)
      {
        this.rubik_block_color.push('red');
      }
      else if(i>=36 && i<45)
      {
        this.rubik_block_color.push('blue');
      }
      else
      {
        this.rubik_block_color.push('yellow');
      }
    }
  }
  else if(this.rubikName=="Rubik’s Apprentice 2x2")
  {
    for(let i=0;i<24;i++)
    {
      if(i>=0 && i<4)
      {
       this.rubik_2x2_block_color.push('whitesmoke');
      }
      else if(i>=4 && i<8)
      {
        this.rubik_2x2_block_color.push('orange');
      }
      else if(i>=8 && i<12)
      {
        this.rubik_2x2_block_color.push('green');
      }
      else if(i>=12 && i<16)
      {
        this.rubik_2x2_block_color.push('red');
      }
      else if(i>=16 && i<20)
      {
        this.rubik_2x2_block_color.push('blue');
      }
      else{
        this.rubik_2x2_block_color.push('yellow');
      }
    }
  }
  }
   
  centerBlockColor(rubik_array:string[])
  {
    rubik_array[4]='whitesmoke';
    rubik_array[13]='orange';
    rubik_array[22]='green';
    rubik_array[31]='red';
    rubik_array[40]='blue';
    rubik_array[49]='yellow';
  }

  resetRubikBlock()
  {
    if(this.rubikName=="Rubik's 3x3")
    { 
    for(let i=0;i<54;i++)
    { 
      if(i>=0 && i<9)
      {
      this.rubik_block_color[i]='whitesmoke'
      }
      else if(i>=9 && i<18)
      {
        this.rubik_block_color[i]='orange';
      }
      else if(i>=18 && i<27)
      {
        this.rubik_block_color[i]='green';
      }
      else if(i>=27 && i<36)
      {
        this.rubik_block_color[i]='red';
      }
      else if(i>=36 && i<45)
      {
        this.rubik_block_color[i]='blue';
      }
      else
      {
        this.rubik_block_color[i]='yellow';
      }
    }
  }
  else if(this.rubikName=="Rubik’s Apprentice 2x2")
  {
    for(let i=0;i<24;i++)
    { 
      if(i>=0 && i<4)
      {
      this.rubik_2x2_block_color[i]='whitesmoke'
      }
      else if(i>=4 && i<8)
      {
        this.rubik_2x2_block_color[i]='orange';
      }
      else if(i>=8 && i<12)
      {
        this.rubik_2x2_block_color[i]='green';
      }
      else if(i>=12 && i<16)
      {
        this.rubik_2x2_block_color[i]='red';
      }
      else if(i>=16 && i<20)
      {
        this.rubik_2x2_block_color[i]='blue';
      }
      else
      {
        this.rubik_2x2_block_color[i]='yellow';
      }
    }
  }

  }
  

 assignRandomColor(rubik_array:string[])
 {
 if(this.rubikName=="Rubik's 3x3")
 {
  var colors_obj:{[key:string]:number}={
    'whitesmoke':8,
    'orange':8,
    'green':8,
    'red':8,
    'blue':8,
    'yellow':8
  };
  const skip_idx:number[]=[4,13,22,31,40,49];
  this.centerBlockColor(rubik_array);
  for(let i=0;i<54;i++)
  { 
    if(skip_idx.includes(i))
    {
      continue;
    }
    var ob=Object.keys(colors_obj);
    var ob_len:number=ob.length;
    var random_idx:number=Math.round(Math.random()*(ob_len-1));
    rubik_array[i]=ob[random_idx];
    colors_obj[ob[random_idx]]-=1;
    if(colors_obj[ob[random_idx]]==0)
    {
      colors_obj=Object.keys(colors_obj).filter(key=>
        key!=ob[random_idx]).reduce((newObject,key)=>{
          newObject[key]=colors_obj[key];
          return newObject;
        },{});
    }
  }
}
else if(this.rubikName=="Rubik’s Apprentice 2x2")
{
  var color_obj:{[key:string]:number}=
  {
   'whitesmoke':4,
   'orange':4,
   'green':4,
   'red':4,
   'blue':4,
   'yellow':4
  };
  for(let i=0;i<24;i++)
  {
    var ob=Object.keys(color_obj);
    var ob_len=ob.length;
    var random_idx=Math.round(Math.random()*(ob_len-1));
    this.rubik_2x2_block_color[i]=ob[random_idx];
    color_obj[ob[random_idx]]-=1;
    if(color_obj[ob[random_idx]]==0)
    {
      color_obj=Object.keys(color_obj).filter(key=>
        key!=ob[random_idx]).reduce((newObj,key)=>{
          newObj[key]=color_obj[key];
          return newObj;
        },{});
    }
  }
}
}

async cancel_move(first:string,second:string):Promise<number>
{
  var val=first+second;
  if(val=='RL'||val=='LR'||val=='UD'||val=='DU'||val=='FB'||val=='BF')
    {
      return 1;
    }
    return -1;
}

async scramble_generator(nums_move:number,notations:string[])
{
  let move:string='';
  let before_move:string='';
  var res='';
  for(let i=0;i<nums_move;i++)
    {
      do{
        let index=Math.floor(Math.random()*6);
        move=notations[index];
      }while(move==before_move || await this.cancel_move(move,before_move)==1)
     before_move=move;
     let mod=Math.floor((Math.random()*3))+1;
     switch(mod)
     {
      case 1:move+=' ';break;
      case 2:move+='2 ';break;
      case 3:move+="' ";break;
     }
     res+=move;
    }
    return res.trim();
}

async switchFront()
{
 if(this.rubikName =="Rubik's 3x3")
  { 
    var first_color=_.cloneDeep(this.rubik_block_color[11]);
    var second_color=_.cloneDeep(this.rubik_block_color[14]);
    var third_color=_.cloneDeep(this.rubik_block_color[17]);
    var second_face_color =_.cloneDeep(this.rubik_block_color[19]);
    var third_face_color = _.cloneDeep(this.rubik_block_color[20]);
    this.rubik_block_color[20]=this.rubik_block_color[18];
    this.rubik_block_color[18]=this.rubik_block_color[24];
    this.rubik_block_color[19]=this.rubik_block_color[21];
    this.rubik_block_color[21]=this.rubik_block_color[25];
    this.rubik_block_color[24]=this.rubik_block_color[26];
    this.rubik_block_color[25]=this.rubik_block_color[23];
    this.rubik_block_color[26]=third_face_color;
    this.rubik_block_color[23]=second_face_color;
    this.rubik_block_color[11]=this.rubik_block_color[45];
    this.rubik_block_color[14]=this.rubik_block_color[46];
    this.rubik_block_color[17]=this.rubik_block_color[47];
    this.rubik_block_color[45]=this.rubik_block_color[33];
    this.rubik_block_color[46]=this.rubik_block_color[30];
    this.rubik_block_color[47]=this.rubik_block_color[27];
    this.rubik_block_color[27]=this.rubik_block_color[6];
    this.rubik_block_color[30]=this.rubik_block_color[7];
    this.rubik_block_color[33]=this.rubik_block_color[8];
    this.rubik_block_color[6]=third_color;
    this.rubik_block_color[7]=second_color;
    this.rubik_block_color[8]=first_color;
  }
}

async switchBack()
{
  if(this.rubikName=="Rubik's 3x3")
    { 
      var first_color=_.cloneDeep(this.rubik_block_color[29]);
      var second_color=_.cloneDeep(this.rubik_block_color[32]);
      var second_face_color=_.cloneDeep(this.rubik_block_color[37]);
      var third_face_color = _.cloneDeep(this.rubik_block_color[38]);
      this.rubik_block_color[38]=this.rubik_block_color[36];
      this.rubik_block_color[36]=this.rubik_block_color[42];
      this.rubik_block_color[37]=this.rubik_block_color[39];
      this.rubik_block_color[39]=this.rubik_block_color[43];
      this.rubik_block_color[42]=this.rubik_block_color[44];
      this.rubik_block_color[43]=this.rubik_block_color[41];
      this.rubik_block_color[44]=third_face_color;
      this.rubik_block_color[41]=second_face_color;
      var third_color=_.cloneDeep(this.rubik_block_color[35]);
      this.rubik_block_color[29]=this.rubik_block_color[53];
      this.rubik_block_color[32]=this.rubik_block_color[52];
      this.rubik_block_color[35]=this.rubik_block_color[51];
      this.rubik_block_color[51]=this.rubik_block_color[9];
      this.rubik_block_color[52]=this.rubik_block_color[12];
      this.rubik_block_color[53]=this.rubik_block_color[15];
      this.rubik_block_color[9]=this.rubik_block_color[2];
      this.rubik_block_color[12]=this.rubik_block_color[1];
      this.rubik_block_color[15]=this.rubik_block_color[0];
      this.rubik_block_color[0]=first_color;
      this.rubik_block_color[1]=second_color;
      this.rubik_block_color[2]=third_color;
    }
}
async switchLeft()
{
if(this.rubikName=="Rubik's 3x3")
  {
    var first_color=_.cloneDeep(this.rubik_block_color[18]);
    var second_color=_.cloneDeep(this.rubik_block_color[21]);
    var third_color=_.cloneDeep(this.rubik_block_color[24]);
    var second_face_color =_.cloneDeep(this.rubik_block_color[10]);
    var third_face_color =_.cloneDeep(this.rubik_block_color[11]);
    this.rubik_block_color[11]=this.rubik_block_color[9];
    this.rubik_block_color[9]=this.rubik_block_color[15];
    this.rubik_block_color[10]=this.rubik_block_color[12];
    this.rubik_block_color[12]=this.rubik_block_color[16];
    this.rubik_block_color[15]=this.rubik_block_color[17];
    this.rubik_block_color[16]=this.rubik_block_color[14];
    this.rubik_block_color[17]=third_face_color;
    this.rubik_block_color[14]=second_face_color;
    this.rubik_block_color[18]=this.rubik_block_color[0];
    this.rubik_block_color[21]=this.rubik_block_color[3];
    this.rubik_block_color[24]=this.rubik_block_color[6];
    this.rubik_block_color[0]=this.rubik_block_color[44];
    this.rubik_block_color[3]=this.rubik_block_color[41];
    this.rubik_block_color[6]=this.rubik_block_color[38];
    this.rubik_block_color[38]=this.rubik_block_color[51];
    this.rubik_block_color[41]=this.rubik_block_color[48];
    this.rubik_block_color[44]=this.rubik_block_color[45];
    this.rubik_block_color[45]=first_color;
    this.rubik_block_color[48]=second_color;
    this.rubik_block_color[51]=third_color;
  }
}

async switchRight()
{
if(this.rubikName=="Rubik's 3x3")
  {
    var first_color=_.cloneDeep(this.rubik_block_color[20]);
    var second_color=_.cloneDeep(this.rubik_block_color[23]);
    var third_color = _.cloneDeep(this.rubik_block_color[26]);
    var second_face_color = _.cloneDeep(this.rubik_block_color[28]);
    var third_face_color = _.cloneDeep(this.rubik_block_color[29]);
    this.rubik_block_color[29]=this.rubik_block_color[27];
    this.rubik_block_color[27]=this.rubik_block_color[33];
    this.rubik_block_color[28]=this.rubik_block_color[30];
    this.rubik_block_color[30]=this.rubik_block_color[34];
    this.rubik_block_color[33]=this.rubik_block_color[35];
    this.rubik_block_color[34]=this.rubik_block_color[32];
    this.rubik_block_color[35]=third_face_color;
    this.rubik_block_color[32]=second_face_color;
    this.rubik_block_color[20]=this.rubik_block_color[47];
    this.rubik_block_color[23]=this.rubik_block_color[50];
    this.rubik_block_color[26]=this.rubik_block_color[53];
    this.rubik_block_color[47]=this.rubik_block_color[42];
    this.rubik_block_color[50]=this.rubik_block_color[39];
    this.rubik_block_color[53]=this.rubik_block_color[36];
    this.rubik_block_color[36]=this.rubik_block_color[8];
    this.rubik_block_color[39]=this.rubik_block_color[5];
    this.rubik_block_color[42]=this.rubik_block_color[2];
    this.rubik_block_color[2]=first_color;
    this.rubik_block_color[5]=second_color;
    this.rubik_block_color[8]=third_color;
  }

}

async switchUp()
{
 if(this.rubikName=="Rubik's 3x3")
  {
    var first_color =_.cloneDeep(this.rubik_block_color[18]);
    var second_color =_.cloneDeep(this.rubik_block_color[19]);
    var third_color=_.cloneDeep(this.rubik_block_color[20]);
    var face_second_color=_.cloneDeep(this.rubik_block_color[1]);
    var face_third_color=_.cloneDeep(this.rubik_block_color[2]);
    this.rubik_block_color[1]=this.rubik_block_color[3];
    this.rubik_block_color[2]=this.rubik_block_color[0];
    this.rubik_block_color[0]=this.rubik_block_color[6];
    this.rubik_block_color[3]=this.rubik_block_color[7];
    this.rubik_block_color[6]=this.rubik_block_color[8];
    this.rubik_block_color[7]=this.rubik_block_color[5];
    this.rubik_block_color[8]=face_third_color;
    this.rubik_block_color[5]=face_second_color;
    this.rubik_block_color[18]=this.rubik_block_color[27];
    this.rubik_block_color[19]=this.rubik_block_color[28];
    this.rubik_block_color[20]=this.rubik_block_color[29];
    this.rubik_block_color[27]=this.rubik_block_color[36];
    this.rubik_block_color[28]=this.rubik_block_color[37];
    this.rubik_block_color[29]=this.rubik_block_color[38];
    this.rubik_block_color[36]=this.rubik_block_color[9];
    this.rubik_block_color[37]=this.rubik_block_color[10];
    this.rubik_block_color[38]=this.rubik_block_color[11];
    this.rubik_block_color[9]=first_color;
    this.rubik_block_color[10]=second_color;
    this.rubik_block_color[11]=third_color;
    
  }
}
async switchDown()
{
  if(this.rubikName=="Rubik's 3x3")
    {
      var first_color=_.cloneDeep(this.rubik_block_color[24]);
      var second_color=_.cloneDeep(this.rubik_block_color[25]);
      var third_color=_.cloneDeep(this.rubik_block_color[26]);
      var second_face_color=_.cloneDeep(this.rubik_block_color[46]);
      var third_face_color=_.cloneDeep(this.rubik_block_color[47]);
      this.rubik_block_color[47]=this.rubik_block_color[45];
      this.rubik_block_color[45]=this.rubik_block_color[51];
      this.rubik_block_color[46]=this.rubik_block_color[48];
      this.rubik_block_color[48]=this.rubik_block_color[52];
      this.rubik_block_color[51]=this.rubik_block_color[53];
      this.rubik_block_color[52]=this.rubik_block_color[50];
      this.rubik_block_color[53]=third_face_color;
      this.rubik_block_color[50]=second_face_color;
      this.rubik_block_color[24]=this.rubik_block_color[15];
      this.rubik_block_color[25]=this.rubik_block_color[16];
      this.rubik_block_color[26]=this.rubik_block_color[17];
      this.rubik_block_color[15]=this.rubik_block_color[42];
      this.rubik_block_color[16]=this.rubik_block_color[43];
      this.rubik_block_color[17]=this.rubik_block_color[44];
      this.rubik_block_color[42]=this.rubik_block_color[33];
      this.rubik_block_color[43]=this.rubik_block_color[34];
      this.rubik_block_color[44]=this.rubik_block_color[35];
      this.rubik_block_color[33]=first_color;
      this.rubik_block_color[34]=second_color;
      this.rubik_block_color[35]=third_color;
    }
}

async switchReverseFront()
{
if(this.rubikName=="Rubik's 3x3")
{
  var first_color=_.cloneDeep(this.rubik_block_color[27]);
  var second_color=_.cloneDeep(this.rubik_block_color[30]);
  var third_color=_.cloneDeep(this.rubik_block_color[33]);
  var second_face_color =_.cloneDeep(this.rubik_block_color[19]);
  var third_face_color = _.cloneDeep(this.rubik_block_color[18]);
  this.rubik_block_color[18]=this.rubik_block_color[20];
  this.rubik_block_color[20]=this.rubik_block_color[26];
  this.rubik_block_color[19]=this.rubik_block_color[23];
  this.rubik_block_color[23]=this.rubik_block_color[25];
  this.rubik_block_color[26]=this.rubik_block_color[24];
  this.rubik_block_color[25]=this.rubik_block_color[21];
  this.rubik_block_color[21]=second_face_color;
  this.rubik_block_color[24]=third_face_color;
  this.rubik_block_color[27]=this.rubik_block_color[47];
  this.rubik_block_color[30]=this.rubik_block_color[46];
  this.rubik_block_color[33]=this.rubik_block_color[45];
  this.rubik_block_color[45]=this.rubik_block_color[11];
  this.rubik_block_color[46]=this.rubik_block_color[14];
  this.rubik_block_color[47]=this.rubik_block_color[17];
  this.rubik_block_color[11]=this.rubik_block_color[8];
  this.rubik_block_color[14]=this.rubik_block_color[7];
  this.rubik_block_color[17]=this.rubik_block_color[6];
  this.rubik_block_color[6]=first_color;
  this.rubik_block_color[7]=second_color;
  this.rubik_block_color[8]=third_color;
}
}

async switchReverseBack()
{
  if(this.rubikName=="Rubik's 3x3")
  {
    var first_color=_.cloneDeep(this.rubik_block_color[0]);
    var second_color=_.cloneDeep(this.rubik_block_color[1]);
    var third_color=_.cloneDeep(this.rubik_block_color[2]);
    var second_face_color=_.cloneDeep(this.rubik_block_color[37]);
    var third_face_color=_.cloneDeep(this.rubik_block_color[36]);
    this.rubik_block_color[36]=this.rubik_block_color[38];
    this.rubik_block_color[37]=this.rubik_block_color[41];
    this.rubik_block_color[38]=this.rubik_block_color[44];
    this.rubik_block_color[41]=this.rubik_block_color[43];
    this.rubik_block_color[44]=this.rubik_block_color[42];
    this.rubik_block_color[43]=this.rubik_block_color[39];
    this.rubik_block_color[42]=third_face_color;
    this.rubik_block_color[39]=second_face_color;
    this.rubik_block_color[0]=this.rubik_block_color[15];
    this.rubik_block_color[1]=this.rubik_block_color[12];
    this.rubik_block_color[2]=this.rubik_block_color[9];
    this.rubik_block_color[9]=this.rubik_block_color[51];
    this.rubik_block_color[12]=this.rubik_block_color[52];
    this.rubik_block_color[15]=this.rubik_block_color[53];
    this.rubik_block_color[51]=this.rubik_block_color[35];
    this.rubik_block_color[52]=this.rubik_block_color[32];
    this.rubik_block_color[53]=this.rubik_block_color[29];
    this.rubik_block_color[29]=first_color;
    this.rubik_block_color[32]=second_color;
    this.rubik_block_color[35]=third_color;
  }
}

async switchReverseLeft()
{
  if(this.rubikName=="Rubik's 3x3")
    {
      var first_color = _.cloneDeep(this.rubik_block_color[18]);
      var second_color =_.cloneDeep(this.rubik_block_color[21]);
      var third_color = _.cloneDeep(this.rubik_block_color[24]);
      var second_face_color =_.cloneDeep(this.rubik_block_color[10]);
      var third_face_color = _.cloneDeep(this.rubik_block_color[9]);

      this.rubik_block_color[9]=this.rubik_block_color[11];
      this.rubik_block_color[10]=this.rubik_block_color[14];
      this.rubik_block_color[11]=this.rubik_block_color[17];
      this.rubik_block_color[14]=this.rubik_block_color[16];
      this.rubik_block_color[17]=this.rubik_block_color[15];
      this.rubik_block_color[16]=this.rubik_block_color[12];
      this.rubik_block_color[15]=third_face_color;
      this.rubik_block_color[12]=second_face_color;

      this.rubik_block_color[18]=this.rubik_block_color[45];
      this.rubik_block_color[21]=this.rubik_block_color[48];    
      this.rubik_block_color[24]=this.rubik_block_color[51];
      this.rubik_block_color[45]=this.rubik_block_color[44];
      this.rubik_block_color[48]=this.rubik_block_color[41];
      this.rubik_block_color[51]=this.rubik_block_color[38];
      this.rubik_block_color[38]=this.rubik_block_color[6];
      this.rubik_block_color[41]=this.rubik_block_color[3];
      this.rubik_block_color[44]=this.rubik_block_color[0];
      this.rubik_block_color[0]=first_color;
      this.rubik_block_color[3]=second_color;
      this.rubik_block_color[6]=third_color;
    }
}

async switchReverseRight()
{
  var first_color = _.cloneDeep(this.rubik_block_color[20]);
  var second_color =_.cloneDeep(this.rubik_block_color[23]);
  var third_color = _.cloneDeep(this.rubik_block_color[26]);
  var second_face_color =_.cloneDeep(this.rubik_block_color[28]);
  var third_face_color = _.cloneDeep(this.rubik_block_color[27]);

  this.rubik_block_color[27]=this.rubik_block_color[29];
  this.rubik_block_color[28]=this.rubik_block_color[32];
  this.rubik_block_color[29]=this.rubik_block_color[35];
  this.rubik_block_color[32]=this.rubik_block_color[34];
  this.rubik_block_color[35]=this.rubik_block_color[33];
  this.rubik_block_color[34]=this.rubik_block_color[30];
  this.rubik_block_color[33]=third_face_color;
  this.rubik_block_color[30]=second_face_color;

  this.rubik_block_color[20]=this.rubik_block_color[2];
  this.rubik_block_color[23]=this.rubik_block_color[5];    
  this.rubik_block_color[26]=this.rubik_block_color[8];
  this.rubik_block_color[2]=this.rubik_block_color[42];
  this.rubik_block_color[5]=this.rubik_block_color[39];
  this.rubik_block_color[8]=this.rubik_block_color[36];
  this.rubik_block_color[36]=this.rubik_block_color[53];
  this.rubik_block_color[39]=this.rubik_block_color[50];
  this.rubik_block_color[42]=this.rubik_block_color[47];
  this.rubik_block_color[47]=first_color;
  this.rubik_block_color[50]=second_color;
  this.rubik_block_color[53]=third_color;
}

async switchReverseUp()
{
  if(this.rubikName=="Rubik's 3x3")
  {
    var first_color=_.cloneDeep(this.rubik_block_color[18]);
    var second_color=_.cloneDeep(this.rubik_block_color[19]);
    var third_color=_.cloneDeep(this.rubik_block_color[20]);
    var second_face_color=_.cloneDeep(this.rubik_block_color[1]);
    var third_face_color = _.cloneDeep(this.rubik_block_color[0]);
    this.rubik_block_color[0]=this.rubik_block_color[2];
    this.rubik_block_color[1]=this.rubik_block_color[5];
    this.rubik_block_color[2]=this.rubik_block_color[8];
    this.rubik_block_color[5]=this.rubik_block_color[7];
    this.rubik_block_color[8]=this.rubik_block_color[6];
    this.rubik_block_color[7]=this.rubik_block_color[3];
    this.rubik_block_color[6]=third_face_color;
    this.rubik_block_color[3]=second_face_color;
    this.rubik_block_color[18]=this.rubik_block_color[9];
    this.rubik_block_color[19]=this.rubik_block_color[10];
    this.rubik_block_color[20]=this.rubik_block_color[11];
    this.rubik_block_color[9]=this.rubik_block_color[36];
    this.rubik_block_color[10]=this.rubik_block_color[37];
    this.rubik_block_color[11]=this.rubik_block_color[38];
    this.rubik_block_color[36]=this.rubik_block_color[27];
    this.rubik_block_color[37]=this.rubik_block_color[28];
    this.rubik_block_color[38]=this.rubik_block_color[29];
    this.rubik_block_color[27]=first_color;
    this.rubik_block_color[28]=second_color;
    this.rubik_block_color[29]=third_color;
  }
}

async switchReverseDown()
{
  if(this.rubikName=="Rubik's 3x3")
  {
    var first_color=_.cloneDeep(this.rubik_block_color[24]);
    var second_color=_.cloneDeep(this.rubik_block_color[25]);
    var third_color=_.cloneDeep(this.rubik_block_color[26]);
    var second_face_color = _.cloneDeep(this.rubik_block_color[46]);
    var third_face_color = _.cloneDeep(this.rubik_block_color[45]);
    this.rubik_block_color[45] = this.rubik_block_color[47];
    this.rubik_block_color[46]=this.rubik_block_color[50];
    this.rubik_block_color[47]=this.rubik_block_color[53];
    this.rubik_block_color[50]=this.rubik_block_color[52];
    this.rubik_block_color[53]=this.rubik_block_color[51];
    this.rubik_block_color[52]=this.rubik_block_color[48];
    this.rubik_block_color[51]=third_face_color;
    this.rubik_block_color[48]=second_face_color;
    this.rubik_block_color[24]=this.rubik_block_color[33];
    this.rubik_block_color[25]=this.rubik_block_color[34];
    this.rubik_block_color[26]=this.rubik_block_color[35];
    this.rubik_block_color[33]=this.rubik_block_color[42];
    this.rubik_block_color[34]=this.rubik_block_color[43];
    this.rubik_block_color[35]=this.rubik_block_color[44];
    this.rubik_block_color[42]=this.rubik_block_color[15];
    this.rubik_block_color[43]=this.rubik_block_color[16];
    this.rubik_block_color[44]=this.rubik_block_color[17];
    this.rubik_block_color[15]=first_color;
    this.rubik_block_color[16]=second_color;
    this.rubik_block_color[17]=third_color;
  }
}

 async rotationDirection(direct:string)
 {
  switch(direct)
  {
    case "F":this.switchFront();break;
    case "B":this.switchBack();break;
    case "L":this.switchLeft();break;
    case "R":this.switchRight();break;
    case "U":this.switchUp();break;
    case "D":this.switchDown();break;
    case "F'":this.switchReverseFront();break;
    case "B'":this.switchReverseBack();break;
    case "L'":this.switchReverseLeft();break;
    case "R'":this.switchReverseRight();break;
    case "U'":this.switchReverseUp();break;
    case "D'":this.switchReverseDown();break;
  }
 }



 async rotationSolveRubik(solve_value:string)
 { 

 var num_times=parseInt(solve_value.replace(/\D/g,''));
      for(let i =0;i<num_times;i++)
        {
      solve_value=solve_value.replace(/\d/g,'');
      this.rotationDirection(solve_value);
      await this.delay(200);
        }
    
 }

 async scrambleRubikBlock()
  {
    var cube_notations=['U','F','R','L','D','B'];
    var pattern=await this.scramble_generator(30,cube_notations);  
    var val=pattern.split(' ');
    for(let direct of val)
      {
        if(direct.includes('2'))
          {
            direct=direct.replace(/\d/g,"");
            await this.rotationDirection(direct);
            await this.rotationDirection(direct);
          }
        else
        {
         await this.rotationDirection(direct);
        }
        await this.delay(100);
      }
  }
  
  async solveRubik()
  {    
  // await this.switchRight();
  // await this.switchDown();
  // await this.switchRight();
  // await this.switchDown();
  // await this.switchFront();
  // await this.switchLeft();
  //await this.switchRight();
  // await this.switchLeft();
    // await this.switchReverseFront();
    //await this.switchRight();
    // await this.switchUp();
    // await this.switchReverseLeft();
    // await this.switchDown();
    // await this.switchUp();
    // await this.switchLeft();
    // await this.switchDown();
    // await this.switchBack();
    // await this.switchLeft();
    // await this.switchBack();
    // await this.switchLeft();
    // await this.switchFront();
    // await this.switchUp();
    // await this.switchRight();
    // await this.switchLeft();
    // await this.switchDown();

    //await this.switchReverseRight();

    //await this.switchReverseLeft();

  var rubik_cube=  this.rubik_block_color;
  var upper_face=rubik_cube.slice(0,9);
  var right_face = rubik_cube.slice(27,36);
  var front_face=rubik_cube.slice(18,27);
  var down_face= rubik_cube.slice(45,54);
  var left_face=rubik_cube.slice(9,18);
  var back_face=rubik_cube.slice(36,45);
  var manual_ordered_face =upper_face.concat(right_face,front_face,down_face,left_face,back_face);  
  var res=this.rubikName=="Rubik's 3x3"?await this.handleService.solveRubik(this.rubikName,manual_ordered_face):await this.handleService.solveRubik(this.rubikName,this.rubik_2x2_block_color);
  var solve_res=res.split(' ');
  for(let i=0;i<solve_res.length-1;i++)
    { 
      await this.rotationSolveRubik(solve_res[i]);
    }
  
  // var sol_res='';
  // if(res!=null)
  // {  
  //    var res_handle=res.split(' ');
  //    for(let i=0;i<res_handle.length-1;i++)
  //     {
  //       var command=Array.from(res_handle[i]);
  //       sol_res+=command[0].repeat(parseInt(command[1]));
  //     }
  //     sol_res=sol_res.trim();
  // }
  //var init_ers=await this.handleService.initMqtt();


  // var transmit=await this.handleService.transmitMqtt("gud sier","test");
  }
}
