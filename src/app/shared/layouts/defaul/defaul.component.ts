import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-defaul',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './defaul.component.html',
  styleUrl: './defaul.component.scss'
})
export class DefaulComponent {

}
