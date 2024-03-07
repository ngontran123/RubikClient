import { Component,HostListener} from '@angular/core';
import { ColorPaletteComponent } from '../../shared/layouts/color-palette/color-palette.component';

@Component({
  selector: 'app-rubik-solve',
  standalone: true,
  imports: [ColorPaletteComponent],
  templateUrl: './rubik-solve.component.html',
  styleUrl: './rubik-solve.component.scss'
})
export class RubikSolveComponent {
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
  alert(this.btn_color);
}

changeBlockColor(event:MouseEvent)
{
 const btn=event.currentTarget as HTMLButtonElement;
 const id =btn.dataset['field'];
}

}
