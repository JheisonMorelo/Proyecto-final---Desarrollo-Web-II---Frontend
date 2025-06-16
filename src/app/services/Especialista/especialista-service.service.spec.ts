import { TestBed } from '@angular/core/testing';

import { EspecialistaServiceService } from './especialista-service.service';

describe('EspecialistaServiceService', () => {
  let service: EspecialistaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspecialistaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
