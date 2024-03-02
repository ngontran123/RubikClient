import { Component } from '@angular/core';
import { ItemsComponent } from '../items/items.component';

@Component({
  selector: 'app-solve',
  standalone: true,
  imports: [ItemsComponent],
  templateUrl: './solve.component.html',
  styleUrl: './solve.component.scss'
})
export class SolveComponent {

}
