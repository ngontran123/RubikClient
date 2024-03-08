import { Component,HostListener, OnInit} from '@angular/core';
import { ColorPaletteComponent } from '../../shared/layouts/color-palette/color-palette.component';
import { PopupService } from '../../../services/popup.service';

@Component({
  selector: 'app-rubik-solve',
  standalone: true,
  imports: [ColorPaletteComponent],
  templateUrl: './rubik-solve.component.html',
  styleUrl: './rubik-solve.component.scss',
  providers:[PopupService]
})
export class RubikSolveComponent implements OnInit {
  isShowThreeD:boolean=true;
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
  color_disable:string[]=[];
  rubik_temp_arr!:string[];
  delay=(ms:number)=>new Promise(rs=>setTimeout(rs,ms))

   
  constructor(private popupService:PopupService)
  {}
  ngOnInit(): void {
   this.initRubikBlock();
   this.rubik_temp_arr=Array(54).fill('');
   this.initColorDisable();
  }
 
initColorDisable()
{
  for(let i=0;i<6;i++)
  {
    this.color_disable[i]='false';
  }
}

checkFrequencyColor(color:string)
{ var is_disable=this.countAllFrequency(color);
  let idx=this.getIndexColor(color);
  if(is_disable)
  {
    this.color_disable[idx]='true';
  }
  else{
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
}
}

rotateUpsideDown()
{  this.is_upside_down=!this.is_upside_down
  switch(this.curr_horizontal_idx)
  {

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
 this.rubik_block_color[num_id-1]=this.btn_color;
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
  for(let i=0;i<54;i++)
  {
    this.rubik_block_color[i]='grey';
  }
  this.centerBlockColor(this.rubik_block_color);
}
  initRubikBlock()
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
  

 assignRandomColor(rubik_array:string[])
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
 async scrambleRubikBlock()
  {
    let round_count=4;
    while(round_count>0)
    { 
     this.assignRandomColor(this.rubik_block_color);
     round_count-=1;
     await this.delay(300);
    }
  }

}
