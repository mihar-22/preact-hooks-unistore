// Type definitions for Preact Hooks - Unistore
// Project: https://github.com/mihar-22/preact-hooks-unistore
// Definitions by: Rahim Alwer <https://github.com/mihar-22>

import {
  Action,
  BoundAction,
  Store
} from 'unistore'

import {ComponentChildren, FunctionComponent} from "preact";

interface Consumer<T> extends FunctionComponent<{
  children: (value: T) => ComponentChildren
}> {}

interface Provider<T> extends FunctionComponent<{
  value: T,
  children: ComponentChildren
}> {}

interface Context<T> {
  Consumer: Consumer<T>;
  Provider: Provider<T>;
}

export interface StoreContext<K> extends Context<Store<K>> {}

export interface StoreProvider<K> extends Provider<Store<K>> {}

export function shallowEqual(left: any, right: any): boolean;

export function useSelector<TState, TSelected>(
  selector: (state: TState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
): TSelected;

export function useAction<K>(action: Action<K>): BoundAction

export function useStore<K>(): Store<K>;
