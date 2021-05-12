import { TestBed } from '@angular/core/testing';

import { ResetConfirmService } from './reset-confirm.service';

describe('ResetConfirmService', () => {
  let service: ResetConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResetConfirmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
