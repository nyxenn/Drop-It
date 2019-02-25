import { TestBed } from '@angular/core/testing';

import { SvMessageService } from './sv-message.service';

describe('SvMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SvMessageService = TestBed.get(SvMessageService);
    expect(service).toBeTruthy();
  });
});
