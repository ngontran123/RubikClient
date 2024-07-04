import { Component,OnInit } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent 
{ 
  public loading_state!:boolean;
  constructor(private loadingService:LoadingService)
  {}
  ngOnInit():void
  {
    this.loadingService.load.subscribe(val=>{this.loading_state=val;});
  }

}
