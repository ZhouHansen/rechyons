# <center><img width=40 src="./rechyons.png"/> Rechyons</center>

[![stability][stability-image]][stability-index]
[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![dm][dm-image]][npm-url]
[![js-standard-style][code-style]][standard]

[stability-image]: https://img.shields.io/badge/stability-stable-green.svg
[stability-index]: https://nodejs.org/api/documentation.html#documentation_stability_index
[npm-image]: https://img.shields.io/npm/v/rechyons.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/rechyons
[travis-image]: https://img.shields.io/travis/zhouhansen/rechyons.svg?style=flat-square
[travis-url]: https://travis-ci.org/zhouhansen/rechyons
[dm-image]: http://img.shields.io/npm/dm/rechyons.svg?style=flat-square
[code-style]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard]: https://github.com/feross/standard

#### <center>Redux is no longer verbose, MRGA!</center>

<center>A library allows you use redux without writing actions and reducers, and still keep immutable</center>

[中文文档(Chinese Document)](https://github.com/ZhouHansen/rechyons/blob/master/README-ZH.md)

## Motivation

<img width=450 src="./for_readme.png"/>

Redux has one disadvantage: it is painfully verbose. Each time we want to add a simple feature, we needed to type a lot of lines for

- constants
- action types,
- action creators,
- action handlers in the reducer
- ...

Actually we bear this disadvantage for [several years](https://community.risingstack.com/repatch-the-simplified-redux/), and the situation seems to be getting worse. See [verbose nightmare](https://github.com/ZhouHansen/rechyons#verbose-nightmare)

##### With `rechyons`, you no longer need the verbose lines above at all

## Usage

[Example](https://github.com/ZhouHansen/rechyons/tree/master/src) or [a little bigger app](https://github.com/ZhouHansen/dat-react-shopping-list)

```
$ git clone git@github.com:ZhouHansen/rechyons.git
$ cd rechyons/example
$ yarn install
$ yarn start
```

## Principle (8 minutes to read, easy than you imagine)

### Install

Support both typescript and javascript

```sh
$ npm install rechyons
```

### Antecedent

```json
// your app tsconfig.json
{
  "compilerOptions": {
    "strict": false
  }
}
```

### Setup redux store and rechyons

`rechyons` generate action and reducer for each of the state fields. Shape your initState's structure to this:

```
{
  moduleA: {keyA: somevalue, keyB: somevalue, keyC: somevalue},
  moduleB: {keyA: somevalue, keyB: somevalue, keyC: somevalue},
}
```

`rechyons` exports two functions `rechyons.reducer()` and `rechyons()`.

`rechyons.reducer()` takes your init state to generate `'user/name'`, `'user/age'`, `'animal/category'`, `'animal/weight'` four pair of action and reducer automatically. Then return the reducers to `redux.combineReducers` to create the store.

`rechyons()` swallows `store.dispatch` for calling the designated actions.

```ts
// store.ts
import { createStore, combineReducers } from "redux";

import rechyons from "rechyons";

let initState = {
  // moduleA
  user: {
    name: "zhc",
    age: 10
  },
  // moduleB
  animal: {
    category: "dog",
    weight: 10
  }
};

export let store = createStore(combineReducers(rechyons.reducer(initState)));

export default rechyons(initState, store.dispatch);
```

### Get, bind and update state in component

`rechyons(initState, store.dispatch)` returns a `hyperstore`, `hyperstore.user` and `hyperstore.animal` both are instances of `Rechyons` class.

```ts
// TestComponent
import React from "react";
import { connect } from "react-redux";
import hyperstore from "./store";

export interface Props {
  name: string;
}

class TestComponent extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div>
        <button
          data-testid="button"
          onClick={() => {
            hyperstore.user.update("name", "abc");
          }}
        >
          {this.props.name}
        </button>
      </div>
    );
  }
}

const MapStateToProps = store => {
  return {
    name: store[hyperstore.user.name]
  };
};

export default connect(MapStateToProps)(TestComponent);
```

#### Get data from state

`store[hyperstore.user.name]` equals to `initState.user.name` which is "zhc";
`store[hyperstore.animal.weight]` equals to `initState.animal.weight` which is 10; So we can use this to `MapStateToProps()`

#### Update state

Use `hyperstore.user.update("name", "abc")` or `hyperstore.user.update({"name": "abc"})`，
`hyperstore.user.update("name", "abc")` 对特指的 action 执行了`store.dispatch({type: "user/name", "abc})`

## API

### rechyons.reducer()

```ts
type ReducerType = { [key: string]: (state: any, action: AnyAction) => any };
type initStateType = { [key: string]: { [key: string]: any } };

rechyons.reducer: (initState: initStateType) => ReducerType
```

`rechyons.reducer()` return the reducers generated from initstate, so it only devotes to create redux store.

```ts
export let store = createStore(combineReducers(rechyons.reducer(initState)));
```

### rechyons()

```ts
rechyons: (initState: initStateType, dispatch: Dispatch<AnyAction>) => { [key: string]: Rechyons }
```

Each `hyperstore.someModule` is a Rechyons instance

```ts
import hyperstore, { store } from "./store";
let hyperstore = rechyons(initState, store.dispatch);

// hyperstore.user is one of the Rechyons instances
console.log(hyperstore.user.name); // get the keyname output "user/name"
console.log(store[hyperstore.user.name]); // get the value output "zhc"

hyperstore.user.update({ name: "abc", age: 20 }); // change state
console.log(hyperstore.user.name); // output "abc"
```

### Verbose nightmare

I want to add a like feature ❤ on the image people post in a social app like twitter.

```js
export default {
  state: {
    //...
  },
  effects: {
    //... Thousands of lines
    *toggleLike({ payload }, { call, put }) {
      const { isLiked, id } = payload;
      if (isLiked) {
        yield call(services.setLike, id);
      } else {
        yield call(services.setUnLike, id);
      }
      yield put(toggleLikeSuccess({ id, isLiked }));
    }
  },
  reducer: {
    //...
  }
};
```

In `models/somemodule.js`, add a generator to commit actions in `effects` object.

```js
export function toggleLikeSuccess({ id, isLiked }) {
  return {
    type: "toggleLikeSuccess",
    payload: {
      id,
      isLiked
    }
  };
}
```

In `actions/somemodule.js`, define a new action.

```js
export default {
  state: {
    //...
  },
  effects: {
    //... Thousands of lines
  },
  reducer: {
    //...Thousands of lines
    toggleLikeSuccess(state, { payload }) {
      const { id, isLiked } = payload;
      return {
        ...state,
        list: list.map(item => {
          if (item.id === id) {
            const newLikeNum = isLiked ? item.like_num + 1 : item.like_num - 1;
            return {
              ...item,
              is_liked: isLiked,
              like_num: newLikeNum > 0 ? newLikeNum : 0
            };
          }
          return item;
        })
      };
    }
  }
};
```

In `models/somemodule.js`, add a reducer in `reducer` object.

```js
const mapDispatchToProps = dispatch => ({
  dispatch,
  toggleLikeMyImgTxt: compose(
    dispatch,
    // ...
    actions.triggerAction("somemodule/toggleLike")
  )
});
```

In `components/somecomponent.js`, map `dispatch` to `props`.

_Life is too heavy_

## License

[MIT](https://www.tldrlegal.com/l/mit)
