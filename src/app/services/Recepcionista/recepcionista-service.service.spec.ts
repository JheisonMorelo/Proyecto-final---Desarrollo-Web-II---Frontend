import { TestBed } from '@angular/core/testing';

import { RecepcionistaServiceService } from './recepcionista-service.service';

describe('RecepcionistaServiceService', () => {
  let service: RecepcionistaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecepcionistaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
