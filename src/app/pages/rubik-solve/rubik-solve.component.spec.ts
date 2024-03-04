import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubikSolveComponent } from './rubik-solve.component';

describe('RubikSolveComponent', () => {
  let component: RubikSolveComponent;
  let fixture: ComponentFixture<RubikSolveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RubikSolveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RubikSolveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
