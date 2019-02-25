import { TestBed } from '@angular/core/testing';

import { SvDeviceService } from './sv-device.service';

describe('ServiceDeviceService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: SvDeviceService = TestBed.get(SvDeviceService);
        expect(service).toBeTruthy();
    });
});
