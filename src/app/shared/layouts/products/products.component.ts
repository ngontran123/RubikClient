import { Component, OnInit } from '@angular/core';
import { HandleService } from '../../../../services/handle.service';
import { IRubik } from '../../../models/item.model';
import { ItemsComponent } from '../../../pages/items/items.component';
import { IOption } from '../../../models/option.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ItemsComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
     
    rubik_list:IRubik[]=[];
    filter_options:IOption[]=[
      {name:'Core Cubes',checked:false},
      {name:'Novelty Puzzles',checked:false},
      {name:'Multiplayer Games',checked:false},
      {name:'Speed Cubes',checked:false},
      {name:'Bundles',checked:false},
    ]

     constructor(private handleService:HandleService)
     {
     }
     ngOnInit(): void 
     {  this.handleService.checkProductToken();
        this.getAllRubik();
     }
     toggleCheckBox(option:IOption)
     {
      option.checked=!option.checked;
     }
     clearAllCheckBox()
     {
      this.filter_options.forEach(option=>option.checked=false);
     }
     async getAllRubik()
     {
       this.rubik_list=await this.handleService.getAllRubiks();
     }
}
