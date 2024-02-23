import { Component, Input } from '@angular/core';
import { IRubik } from '../../models/item.model';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent{
  @Input() rubik!:IRubik;
}
