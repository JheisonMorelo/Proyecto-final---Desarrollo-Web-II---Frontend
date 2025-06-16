import { TestBed } from '@angular/core/testing';

import { CitaService } from '../../services/Cita/cita-service.service';

describe('CitaServiceService', () => {
  let service: CitaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
