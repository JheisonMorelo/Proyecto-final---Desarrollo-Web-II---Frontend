import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesSatisfechosLandingpageComponent } from './clientes-satisfechos-landingpage.component';

describe('ClientesSatisfechosLandingpageComponent', () => {
  let component: ClientesSatisfechosLandingpageComponent;
  let fixture: ComponentFixture<ClientesSatisfechosLandingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesSatisfechosLandingpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesSatisfechosLandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
