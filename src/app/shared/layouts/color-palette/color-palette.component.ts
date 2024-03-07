import { Component, OnInit,Output,EventEmitter,Input} from '@angular/core';

@Component({
  selector: 'app-color-palette',
  standalone: true,
  imports: [],
  templateUrl: './color-palette.component.html',
  styleUrl: './color-palette.component.scss'
})
export class ColorPaletteComponent implements OnInit {
     rows:any=[];
     colors:string[]=['whitesmoke','orange','green','red','blue','yellow'];
     backgroundColor:string='transparent';
     @Input() color_disable!:string[];
     @Output("update-color") color:EventEmitter<string>=new EventEmitter<string>();
  ngOnInit(): void 
  {
    this.getColorRows();
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

  checkDisableBtn(picked_color:string)
  {
   var idx=this.getIndexColor(picked_color);
   if(this.color_disable[idx]=='true')
   {
    return true;
   }
   return false;
  }
  


  getColorRows()
  {
    for(let i=0;i<this.colors.length;i+=3)
    {
      this.rows.push(this.colors.slice(i,i+3));
    }
    return this.rows;
  }

  changeBackgroundColor(color:string)
  {
    this.backgroundColor=color;
    this.color.emit(this.backgroundColor);
  }
}
