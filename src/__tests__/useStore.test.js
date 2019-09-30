/** @jsx h */

import { h } from 'preact'
import * as ptl from '@testing-library/preact'
import '@testing-library/jest-dom/extend-expect'

import { StoreProvider, useStore } from '..'
import createStore from 'unistore'

describe('useStore', () => {
  let store

  beforeEach(() => {
    store = createStore({})
  })

  it('should fetch store from context', () => {
    store.setState({ message: 'hello' })

    const Comp = () => {
      const store = useStore()

      return (
        <div data-testid='store'>{store.getState().message}</div>
      )
    }

    const tester = ptl.render(
      <StoreProvider value={store}>
        <Comp />
      </StoreProvider>
    )

    expect(tester.getByTestId('store')).toHaveTextContent('hello')
  })
})
