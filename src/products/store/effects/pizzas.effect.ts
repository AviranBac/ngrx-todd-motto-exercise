import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/Observable/of';
import { switchMap, map, tap, catchError, exhaustMap } from 'rxjs/operators';

import * as pizzaActions from '../actions/pizzas.action';
import * as fromServices from '../../services';
import { Router } from '@angular/router';

@Injectable()
export class PizzasEffects {
    constructor(
        private actions$: Actions,
        private pizzaService: fromServices.PizzasService,
        private router: Router
    ) {}

    @Effect()
    loadPizzas$ = this.actions$
        .ofType(pizzaActions.LOAD_PIZZAS)
        .pipe(switchMap(() => {
            return this.pizzaService.getPizzas().pipe(
                map(pizzas => new pizzaActions.LoadPizzasSuccess(pizzas)),
                catchError(error => of(new pizzaActions.LoadPizzasFail(error)))
            )
        }));

    @Effect()
    createPizza$ = this.actions$
        .ofType(pizzaActions.CREATE_PIZZA).pipe(
            map((action: pizzaActions.CreatePizza) => action.payload),
            exhaustMap(pizza => {
                return this.pizzaService.createPizza(pizza).pipe(
                    map(pizza => new pizzaActions.CreatePizzaSuccess(pizza)),
                    catchError(error => of(new pizzaActions.CreatePizzaFail(error)))
                )
            })
        );

    @Effect({ dispatch: false })
    createPizzaSuccess$ = this.actions$
        .ofType(pizzaActions.CREATE_PIZZA_SUCCESS).pipe(
            map((action: pizzaActions.CreatePizzaSuccess) => action.payload),
            tap(pizza => this.router.navigate([`/products/${pizza.id}`]))
        );
}