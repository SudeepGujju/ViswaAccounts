import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Group } from 'app/data-model';
import { AccountService } from 'app/services';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AccountDetailsResolver implements Resolve<Group> {

    constructor(private accountSrvc: AccountService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Group> {

        const id = route.paramMap.get('id');
        return  this.accountSrvc.get(id)
                            .pipe(
                                catchError( () => of(null) )
                            );
    }

}
