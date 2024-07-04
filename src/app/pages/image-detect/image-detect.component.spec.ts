import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDetectComponent } from './image-detect.component';

describe('ImageDetectComponent', () => {
  let component: ImageDetectComponent;
  let fixture: ComponentFixture<ImageDetectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageDetectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageDetectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
