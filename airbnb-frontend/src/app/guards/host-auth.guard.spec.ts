import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { hostAuthGuard } from './host-auth.guard';

describe('hostAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => hostAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
