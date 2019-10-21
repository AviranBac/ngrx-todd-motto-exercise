import { tap, filter, take, switchMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { of } from 'rxjs/Observable/of';
import { Observable } from 'rxjs/Observable';

import * as fromStore from '../store';
import { Store } from '@ngrx/store';

@Injectable()
export class PizzasGuard implements CanActivate {
    constructor(
        private store: Store<fromStore.ProductsState>
    ) {}

    canActivate() {
        return this.checkStore().pipe(
            switchMap(() => of(true)),
            catchError(() => of(false))
        );
    }

    checkStore(): Observable<boolean> {
        return this.store.select(fromStore.getPizzasLoaded).pipe(
            tap(loaded => {
                if (!loaded) {
                    this.store.dispatch(new fromStore.LoadPizzas());
                }
            }),
            filter(loaded => loaded),
            take(1)
        )
    }
}