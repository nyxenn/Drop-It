import { TestBed } from '@angular/core/testing';

import { SvMapService } from './sv-map.service';

describe('SvMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SvMapService = TestBed.get(SvMapService);
    expect(service).toBeTruthy();
  });
});
