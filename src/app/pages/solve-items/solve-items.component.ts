import { Component ,Input} from '@angular/core';
import { IRubik } from '../../models/item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solve-items',
  standalone: true,
  imports: [],
  templateUrl: './solve-items.component.html',
  styleUrl: './solve-items.component.scss'
})
export class SolveItemsComponent {
   @Input() rubik!:IRubik;

   constructor(private route:Router)
   {}
   navigateRubik()
   {
     this.route.navigate([`/rubik-solve/${this.rubik.name}`]);
   }
}
