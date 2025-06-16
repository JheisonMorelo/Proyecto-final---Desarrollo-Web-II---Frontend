import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpageHomeComponent } from './landingpage-home.component';

describe('LandingpageHomeComponent', () => {
  let component: LandingpageHomeComponent;
  let fixture: ComponentFixture<LandingpageHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingpageHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingpageHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
