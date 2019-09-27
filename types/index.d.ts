// Type definitions for Preact Hooks - Unistore
// Project: https://github.com/mihar-22/preact-hooks-unistore
// Definitions by: Rahim Alwer <https://github.com/mihar-22>

import {
  Action,
  BoundAction,
  Store
} from 'unistore'

import {Context, Provider} from "preact";

export = unistore;
export as namespace unistore;

declare namespace unistore {
  interface StoreContext<K> extends Context<Store<K>> {}

  interface StoreProvider<K> extends Provider<Store<K>> {}

  function useSelector<TState, TSelected>(
    selector: (state: TState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean
  ): TSelected;

  function useAction<K>(action: Action<K>): BoundAction

  function useStore<K>(): Store<K>;
}

