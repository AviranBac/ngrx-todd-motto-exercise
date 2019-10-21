import * as fromPizzas from '../actions/pizzas.action';

import { Pizza } from '../../models/pizza.model';

export interface PizzaState {
    entities: { [id: number] : Pizza }
    loaded: boolean,
    loading: boolean
}

export const initialState: PizzaState = {
    entities: {},
    loaded: false,
    loading: false
};

export function reducer(
    state = initialState,
    action: fromPizzas.PizzasAction
): PizzaState {
    
    switch (action.type) {
        case fromPizzas.LOAD_PIZZAS: {
            return {
                ...state,
                loading: true
            };
        }

        case fromPizzas.LOAD_PIZZAS_SUCCESS: {
            const pizzas = action.payload;

            const entities = pizzas.reduce(
                (entities: { [id: number ] : Pizza}, pizza: Pizza) => {
                    return {
                        ...entities,
                        [pizza.id]: pizza
                    }
                }, 
                {
                    ...state.entities
                }
            );
            console.log(entities);
            return {
                ...state,
                loading: false,
                loaded: true,
                entities
            };
        }

        case fromPizzas.LOAD_PIZZAS_FAIL: {
            return {
                ...state,
                loading: false,
                loaded: false
            };
        }

        case fromPizzas.CREATE_PIZZA_SUCCESS: {
            const addedPizza = {
                ...action.payload,
                id: getHighestPizzaId(state)
            };
            const updatedEntities = {
                ...state.entities,
                [addedPizza.id]: addedPizza
            }
            return {
                ...state,
                entities: updatedEntities
            }
        }
    }
    return state;
}

export const getPizzasLoading = (state: PizzaState) => state.loading;
export const getPizzasLoaded = (state: PizzaState) => state.loaded;
export const getPizzasEntities = (state: PizzaState) => state.entities;

export function getHighestPizzaId(state: PizzaState) {
    if (Object.keys(state.entities).length == 0) {
        return 1;
    }

    return Object.keys(state.entities)
        .map((stringId) => +stringId)
        .reduce((max, currentValue) => Math.max(max, currentValue), 0);
}