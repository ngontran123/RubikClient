import { Component, ElementRef,EventEmitter,Output,ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-detect',
  standalone: true,
  imports: [],
  templateUrl: './image-detect.component.html',
  styleUrl: './image-detect.component.scss'
})
export class ImageDetectComponent 
{    
  imageUrl:string|ArrayBuffer|null=null;
  @ViewChild('fileInput')fileInput!:ElementRef;
  @Output() imageSelected :EventEmitter<string|ArrayBuffer|null>=new EventEmitter<string|ArrayBuffer|null>();
  @Output() fileSelected:EventEmitter<File> = new EventEmitter<File>(); 
  onFileSelected(event:Event):void
  {
   const input = event.target as HTMLInputElement;
   if(input.files && input.files[0])
    {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload=e=>{this.imageUrl=reader.result;
                       this.imageSelected.emit(this.imageUrl);
                       this.fileSelected.emit(file);
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput():void
  {
  this.fileInput.nativeElement.click();
  }
}
