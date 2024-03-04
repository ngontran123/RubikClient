import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolveItemsComponent } from './solve-items.component';

describe('SolveItemsComponent', () => {
  let component: SolveItemsComponent;
  let fixture: ComponentFixture<SolveItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolveItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolveItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
