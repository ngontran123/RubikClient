import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-color-palette',
  standalone: true,
  imports: [],
  templateUrl: './color-palette.component.html',
  styleUrl: './color-palette.component.scss'
})
export class ColorPaletteComponent implements OnInit {
     rows:any=[];
     colors:string[]=['whitesmoke','orange','greenyellow','red','blue','yellow'];
     backgroundColor:string='transparent';
  ngOnInit(): void 
  {
    this.getColorRows();
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
  }
}
