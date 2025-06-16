import { TestBed } from '@angular/core/testing';

import { AsistenteServiceService } from './asistente-service.service';

describe('AsistenteServiceService', () => {
  let service: AsistenteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsistenteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
