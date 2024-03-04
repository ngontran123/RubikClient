import { Component, OnInit } from '@angular/core';
import { IRubik } from '../../models/item.model';
import { HandleService } from '../../../services/handle.service';
import { SolveItemsComponent } from '../solve-items/solve-items.component';

@Component({
  selector: 'app-solve',
  standalone: true,
  imports: [SolveItemsComponent],
  templateUrl: './solve.component.html',
  styleUrl: './solve.component.scss',
  providers:[HandleService]
})
export class SolveComponent implements OnInit {
  rubiks:IRubik[]=[];
  rows:any[]=[];
     
  constructor(private handleService:HandleService){}

  ngOnInit(): void {
    this.getSolvableRubik();
  } 

  async getSolvableRubik()
  {
   this.rubiks = await this.handleService.getSolvableRubik();
   for(let i=0;i<this.rubiks.length;i+=3)
   {
     this.rows.push(this.rubiks.slice(i,i+3));
   }
  }
      

}
