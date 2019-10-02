<div align="center">
<h1>Preact Hooks - Unistore</h1>

> Inspired by [react-redux](https://github.com/reduxjs/react-redux) and [redux-zero](https://github.com/redux-zero/redux-zero)

[![version][version-badge]][package]
[![MIT License][license-badge]][license]

A custom Preact hook to wire up components to [Unistore](https://github.com/developit/unistore).
</div>

<hr />

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Docs](#docs)
  - [Setup](#setup)
  - [useStore](#usestore)
  - [useSelector](#useselector)
  - [useAction](#useaction)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

***This package has [Preact 10+](https://github.com/preactjs/preact) and [Unistore 3.4+](https://github.com/developit/unistore) as peer dependencies.***

`npm install @preact-hooks/unistore` or `yarn add @preact-hooks/unistore`

You can also load it via the [unpkg](https://unpkg.com) CDN

`https://unpkg.com/@preact-hooks/unistore` will download the latest UMD bundle.

All formats (UMD, CJS and ESM) are available in the dist folder inside the package.

## Docs

### Setup 

To get started wrap your app in a `Provider` component to make the store available 
throughout the entire component tree.

```js
import { StoreProvider }  from '@preact-hooks/unistore'

import createStore from 'unistore';
import devtools from 'unistore/devtools';

const initialStore = {}

const store = (process.env.NODE_ENV === 'production') 
  ? createStore(initialStore) 
  : devtools(createStore(initialStore))

function App() {
  return (
    <StoreProvider value={store}>
      // ...  
    </StoreProvider>
  )
}
``` 

🎉 Now you are ready to start using the hooks listed below in your function components.

### useStore

```js
const store = useStore()
```

This hook returns a reference to the same Unistore store that was passed into the `StoreProvider` component.

This hook should probably not be used frequently. Prefer `useSelector` as your primary choice. However, this may be useful for less common scenarios that do require access to the store.

```js
import { useStore } from '@preact-hooks/unistore'

function MyComponent() {
  const store = useStore()

  // ...
}
```

### useSelector

```js
const result = useSelector(selectorFn, equalityFn?)
```

To learn about this hook checkout the amazing [docs](https://react-redux.js.org/api/hooks) over at React Redux.

**Pay attention to:**

- [Equality Comparisons and Updates](https://react-redux.js.org/api/hooks#equality-comparisons-and-updates)
- [Usage Warnings](https://react-redux.js.org/api/hooks#usage-warnings)
- [Performance](https://react-redux.js.org/api/hooks#performance)

There is a convenient equality function called `shallowEqual` included. You can use this with 
the `useSelector` hook if you require it. If you're not sure when you'd need this then click
on the link above titled "Equality Comparisons and Updates".

```js
import shallowEqual from '@preact-hooks/unistore/shallowEqual'

function MyComponent() {
  const result = useSelector(selectorFn, shallowEqual)

  // ...
}
```

You could also use something like the [Lodash](https://github.com/lodash/lodash) `_.isEqual()` utility or 
[Immutable.js's](https://github.com/immutable-js/immutable-js) comparison capabilities. It's up to you how the equality check is performed. 

You can also checkout [Reselect](https://github.com/reduxjs/reselect) which is a "selector" library for Redux.

### useAction

```js
const action = useAction(actionFn)
```

This hook is used to create Unistore actions. The function passed into the hook is identical to how you would create an action for Unistore, they 
receive the current state and return a state update.

```js
import { useAction } from '@preact-hooks/unistore'

import { h } from 'preact'

function Counter() {
  const increment = useAction(({ count }) => ({ count: count + 1 }));
  
  return (<button onClick={increment}>Click me</button>);
}
```

If your actions are defined in another file then just import it and pass it through.

```js
// ...

import { increment } from 'myActionsFile.js'

function Counter() {
  const increment = useAction(increment);

  // ...  
}
```

## LICENSE

[MIT](LICENSE)

<!-- prettier-ignore-start -->
[package]: https://www.npmjs.com/package/@preact-hooks/unistore
[version-badge]: https://img.shields.io/npm/v/@preact-hooks/unistore
[license]: https://github.com/mihar-22/preact-hooks-unistore/blob/master/LICENSE
[license-badge]: https://img.shields.io/github/license/mihar-22/preact-hooks-unistore?color=b
<!-- prettier-ignore-end -->
