import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/Observable/of';
import { switchMap, map, catchError } from 'rxjs/operators';

import * as toppingActions from '../actions/toppings.action';
import * as fromServices from '../../services';

@Injectable()
export class ToppingsEffects {
    constructor(
        private actions$: Actions,
        private toppingsService: fromServices.ToppingsService
    ) {}

    @Effect()
    loadToppings$ = this.actions$
        .ofType(toppingActions.LOAD_TOPPINGS)
        .pipe(switchMap(() => {
            return this.toppingsService.getToppings().pipe(
                map(toppings => new toppingActions.LoadToppingsSuccess(toppings)),
                catchError(error => of(new toppingActions.LoadToppingsFail(error)))
            )
        }));
}