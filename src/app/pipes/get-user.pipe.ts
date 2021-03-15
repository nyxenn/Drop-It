import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';

@Pipe({
    name: 'getUser'
})
export class GetUserPipe implements PipeTransform {
    constructor(private afs: AngularFirestore) {}

    transform(value: any, args?: any): any {
        return this.getUser(value);
    }

    getUser(userId): Observable<any> {
        return this.afs.doc(`users/${userId}`).valueChanges();
    }
}
