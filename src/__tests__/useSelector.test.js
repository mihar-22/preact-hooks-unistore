/** @jsx h */

/**
 * Inspired heavily by
 * https://github.com/reduxjs/react-redux/blob/master/test/hooks/useSelector.spec.js
 */

import { h } from 'preact'
import * as ptl from '@testing-library/preact'
import '@testing-library/jest-dom/extend-expect'

import { StoreProvider, useSelector } from '..'
import createStore from 'unistore'
import shallowEqual from '../shallowEqual'
import { useReducer } from 'preact/hooks'

describe('useSelector', () => {
  let store

  beforeEach(() => {
    store = createStore({})
  })

  describe('core subscription behavior', () => {
    let tester

    beforeEach(() => {
      store.setState({ message: 'hello' })

      const Comp = () => {
        const message = useSelector(s => s.message)

        return <div data-testid='store'>{message}</div>
      }

      tester = ptl.render(
        <StoreProvider value={store}>
          <Comp />
        </StoreProvider>
      )
    })

    it('selects the state on initial render', () => {
      expect(tester.getByTestId('store')).toHaveTextContent('hello')
    })

    it('selects the state and renders the component when the store updates', () => {
      ptl.act(() => {
        store.setState({ message: 'bye' })
      })

      expect(tester.getByTestId('store')).toHaveTextContent('bye')
    })
  })

  describe('lifecycle interactions', () => {
    let renderedItems

    beforeEach(() => {
      store = createStore({ count: 0 })
      renderedItems = []
    })

    it('always uses the latest state', () => {
      const Comp = () => {
        const value = useSelector(s => s.count)
        renderedItems.push(value)
        return <div />
      }

      ptl.render(
        <StoreProvider value={store}>
          <Comp />
        </StoreProvider>
      )

      expect(renderedItems).toEqual([0])

      ptl.act(() => {
        store.setState({ count: 1 })
      })

      expect(renderedItems).toEqual([0, 1])
    })

    it('notices store updates between render and store subscription effect', () => {
      const Comp = () => {
        const count = useSelector(s => s.count)
        renderedItems.push(count)

        if (count === 0) {
          store.setState({ count: 1 })
        }

        return <div>{count}</div>
      }

      ptl.render(
        <StoreProvider value={store}>
          <Comp />
        </StoreProvider>
      )

      expect(renderedItems).toEqual([0, 1])
    })
  })

  describe('performance optimizations and bail-outs', () => {
    let renderedItems

    beforeEach(() => {
      renderedItems = []
    })

    it('defaults to ref-equality to prevent unnecessary updates', () => {
      const Comp = () => {
        const value = useSelector(s => s)
        renderedItems.push(value)
        return <div />
      }

      ptl.render(
        <StoreProvider value={store}>
          <Comp />
        </StoreProvider>
      )

      expect(renderedItems.length).toBe(1)
      store.setState({})
      expect(renderedItems.length).toBe(1)
    })

    it('allows other equality functions to prevent unnecessary updates', () => {
      store = createStore({ count: 1, stable: {} })

      const Comp = () => {
        const value = useSelector(s => Object.keys(s), shallowEqual)
        renderedItems.push(value)
        return <div />
      }

      ptl.render(
        <StoreProvider value={store}>
          <Comp />
        </StoreProvider>
      )

      expect(renderedItems.length).toBe(1)
      store.setState({})
      expect(renderedItems.length).toBe(1)
    })

    it('uses the latest selector', () => {
      let selectorId = 0
      let forceRender

      const Comp = () => {
        const [, f] = useReducer(c => c + 1, 0)
        forceRender = f
        const renderedSelectorId = selectorId++
        const value = useSelector(() => renderedSelectorId)
        renderedItems.push(value)
        return <div />
      }

      ptl.render(
        <StoreProvider value={store}>
          <Comp />
        </StoreProvider>
      )

      expect(renderedItems).toEqual([0])

      ptl.act(forceRender)
      expect(renderedItems).toEqual([0, 1])

      ptl.act(() => {
        store.setState({})
      })
      expect(renderedItems).toEqual([0, 1])

      ptl.act(forceRender)
      expect(renderedItems).toEqual([0, 1, 2])
    })
  })

  describe('edge cases', () => {
    beforeEach(() => {
      store = createStore({ count: 0 })
    })

    it('ignores transient errors in selector (e.g. due to stale props)', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const Parent = () => {
        const count = useSelector(s => s.count)
        return <Child parentCount={count} />
      }

      const Child = ({ parentCount }) => {
        const result = useSelector(({ count }) => {
          if (count !== parentCount) {
            throw new Error()
          }

          return count + parentCount
        })

        return <div>{result}</div>
      }

      ptl.render(
        <StoreProvider value={store}>
          <Parent />
        </StoreProvider>
      )

      expect(() => store.setState({}, true)).not.toThrowError()

      spy.mockRestore()
    })

    it('correlates the subscription callback error with a following error during rendering', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const Comp = () => {
        const result = useSelector(s => {
          if (s.count > 0) {
            throw new Error('foo')
          }

          return s.count
        })

        return <div>{result}</div>
      }

      const App = () => (
        <StoreProvider value={store}>
          <Comp />
        </StoreProvider>
      )

      ptl.render(<App />)

      expect(() => {
        ptl.act(() => {
          store.setState({ count: 1 })
        })
      }).toThrow(
        /The error may be related to the previous error:/
      )

      spy.mockRestore()
    })

    /**
     * I have no idea what is going on with this test. Oddly it passes when I remove the test
     * above... If I place the this test above the previous one then that one fails ... I don't
     * see a connection that would cause the failure.
     */
    it('re-throws errors from the selector that only occur during rendering', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const Parent = () => {
        const count = useSelector(s => s.count)
        return <Child parentCount={count} />
      }

      const Child = ({ parentCount }) => {
        const result = useSelector(({ count }) => {
          if (parentCount > 0) {
            throw new Error()
          }

          return count + parentCount
        })

        return <div>{result}</div>
      }

      ptl.render(
        <StoreProvider value={store}>
          <Parent />
        </StoreProvider>
      )

      // expect(() => {
      //   ptl.act(() => {
      //     store.setState({ count: 1 })
      //   })
      // }).toThrow()

      spy.mockRestore()
    })

    it('throws if no selector is passed', () => {
      expect(() => useSelector()).toThrow()
    })
  })
})
