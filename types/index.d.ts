import {
  Action,
  BoundAction,
  Store
} from 'unistore'

export function shallowEqual(left: any, right: any): boolean;

export function useSelector<TState, TSelected>(
  selector: (state: TState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
): TSelected;

export function useAction<K>(action: Action<K>): BoundAction

export function useStore<K>(): Store<K>;
