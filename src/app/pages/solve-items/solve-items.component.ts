import { Component ,Input} from '@angular/core';
import { IRubik } from '../../models/item.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-solve-items',
  standalone: true,
  imports: [],
  templateUrl: './solve-items.component.html',
  styleUrl: './solve-items.component.scss'
})
export class SolveItemsComponent {
   @Input() rubik!:IRubik;
   public environment=`${environment.client_url}`;

   constructor(private route:Router)
   {}
   navigateRubik()
   {
     this.route.navigate([`/rubik-solve/${this.rubik.name}`]);
   }
}
