import { Pipe, PipeTransform } from '@angular/core';
import { SvMessageService } from '../sv-message.service';
import { Observable } from 'rxjs';

@Pipe({
    name: 'getScore'
})
export class GetScorePipe implements PipeTransform {
    constructor(private msgService: SvMessageService) {}

    transform(value: any, args?: any): any {
        return this.getScore(value);
    }

    getScore(msgId): Observable<any> {
        return this.msgService.getScore(msgId);
    }
}
