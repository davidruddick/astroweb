import { TestBed } from '@angular/core/testing';

import { VettingService } from './vetting.service';

describe('VettingService', () => {
  let service: VettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
