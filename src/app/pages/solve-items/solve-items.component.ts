import { Component ,Input} from '@angular/core';
import { IRubik } from '../../models/item.model';

@Component({
  selector: 'app-solve-items',
  standalone: true,
  imports: [],
  templateUrl: './solve-items.component.html',
  styleUrl: './solve-items.component.scss'
})
export class SolveItemsComponent {
   @Input() rubik!:IRubik;
}
