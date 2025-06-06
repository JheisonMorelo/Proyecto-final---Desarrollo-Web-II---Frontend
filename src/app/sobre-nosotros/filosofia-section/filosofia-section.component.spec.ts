import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilosofiaSectionComponent } from './filosofia-section.component';

describe('FilosofiaSectionComponent', () => {
  let component: FilosofiaSectionComponent;
  let fixture: ComponentFixture<FilosofiaSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilosofiaSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilosofiaSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
