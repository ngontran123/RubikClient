import { Component, OnInit } from '@angular/core';
import { HandleService } from '../../../services/handle.service';
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  providers:[HandleService]
})
export class AboutComponent implements OnInit {

  constructor(private handleService:HandleService)
  {
  }
  ngOnInit(): void {
    this.getAboutPage();
  }
  getAboutPage()
  {  
    this.handleService.getAboutPage();
  }
}
