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
    const deltaX=event.clientX-this.startPosX;
    const deltaY=event.clientY-this.startPostY;
    const rotateX=this.startRotateX+(deltaY/5);
    const rotateY=this.startPostY+(deltaX/5);
    this.startRotateX=this.startPosX;
    this.startRotateY=this.startPostY;
    this.cubeRotateStyle=`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }
}

}
