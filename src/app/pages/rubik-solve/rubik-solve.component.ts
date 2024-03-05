import { Component } from '@angular/core';
import { ColorPaletteComponent } from '../../shared/layouts/color-palette/color-palette.component';

@Component({
  selector: 'app-rubik-solve',
  standalone: true,
  imports: [ColorPaletteComponent],
  templateUrl: './rubik-solve.component.html',
  styleUrl: './rubik-solve.component.scss'
})
export class RubikSolveComponent {
showValue()
{
  alert("clickable");
}
}
