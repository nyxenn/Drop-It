import { Component } from '@angular/core';
import { SvDeviceService } from '../sv-device.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {
    public uuid;

    constructor(private devSrvc: SvDeviceService) {
        this.uuid = this.devSrvc.getDeviceID();
    }
}
