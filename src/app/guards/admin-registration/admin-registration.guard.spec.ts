import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminRegistrationGuard } from '../../admin-registration.guard';

describe('adminRegistrationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminRegistrationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
