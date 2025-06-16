import { TestBed } from '@angular/core/testing';

import { ServicioService } from './servicio-service.service';

describe('ServicioServiceService', () => {
  let service: ServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
