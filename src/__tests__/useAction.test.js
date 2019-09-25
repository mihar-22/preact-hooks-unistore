/** @jsx h */

/**
 * Inspired heavily by
 * https://github.com/redux-zero/redux-zero/blob/master/src/react/hooks/useAction.spec.tsx
 */

import { h } from 'preact'
import * as ptl from 'preact-testing-library-next'
import '@testing-library/jest-dom/extend-expect'

import { StoreProvider, useAction } from '..'
import createStore from 'unistore'

describe('useAction', () => {
  let store

  beforeEach(() => {
    store = createStore({ count: 0 })
  })

  it('should provide an action bound to the store', () => {
    const Comp = () => {
      const increment = useAction(({ count }) => ({ count: count + 1 }))

      return <button onClick={increment}>Click me</button>
    }

    const { container: { firstChild: button } } = ptl.render(
      <StoreProvider value={store}>
        <Comp />
      </StoreProvider>
    )

    ptl.fireEvent.click(button)

    expect(store.getState()).toEqual({ count: 1 })
  })

  it('should allow action to be passed in externally', () => {
    const incrementAction = ({ count }) => ({ count: count + 1 })

    const Comp = () => {
      const increment = useAction(incrementAction)

      return <button onClick={increment}>Click me</button>
    }

    const { container: { firstChild: button } } = ptl.render(
      <StoreProvider value={store}>
        <Comp />
      </StoreProvider>
    )

    ptl.fireEvent.click(button)

    expect(store.getState()).toEqual({ count: 1 })
  })

  it('should provide an action with parameters bound to the store', () => {
    const Comp = () => {
      const incrementOf = useAction(({ count }, value) => ({
        count: count + value
      }))

      return <button onClick={() => incrementOf(10)}>Click me</button>
    }

    const { container: { firstChild: button } } = ptl.render(
      <StoreProvider value={store}>
        <Comp />
      </StoreProvider>
    )

    expect(store.getState()).toEqual({ count: 0 })

    ptl.fireEvent.click(button)
    ptl.fireEvent.click(button)

    expect(store.getState()).toEqual({ count: 20 })
  })
})
