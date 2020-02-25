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

## Motivation

<img width=450 src="./for_readme.png"/>

Redux has one disadvantage: it is painfully verbose. Each time we want to add a simple feature, we needed to type a lot of lines for

- constants
- action types,
- action creators,
- action handlers in the reducer
- ...

Actually we bear this disadvantage for [several years](https://community.risingstack.com/repatch-the-simplified-redux/), and the situation seems to be getting worse.

### Verbose nightmare

Let me give you an example, I want to add a like feature ❤ on the image people post in a social app like twitter. If you have the same nightmare, just omit this part~

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

### With `rechyons`, you no longer need the verbose lines above at all.

Let's see why

## Usage (About 5-10 minutes to understand, easy than you imagine)

### Install

Support both typescript and javascript

```sh
$ npm install rechyons
```

`rechyons` generate action and reducer for each of the state fields. To work with `rechyons`, your state's structure must be `{componentA: {}, componentB: {} ...}`, this is totally reasonable.

```ts
// store.ts
import { createStore, combineReducers } from "redux";

import rechyons from "rechyons";

let initState = {
  user: {
    name: "zhc",
    age: 10
  },
  animal: {
    category: "dog",
    weight: 10
  }
};

export let store = createStore(combineReducers(rechyons.reducer(initState)));

export default rechyons(store.dispatch);
```

`rechyons` has two function `rechyons.reducer()` and `rechyons()`.

First, `rechyons.reducer()` takes your init state to generate `'user/name'`, `'user/age'`, `'animal/category'`, `'animal/weight'` four pair of action and reducer automatically! Then return the reducers to `redux.combineReducers` to create the store.

Then, the `rechyons()` swallow `store.dispatch` to call the designated actions.

```ts
// TestComponent
import React from "react";
import { connect } from "react-redux";
import superstore from "./store";

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
            superstore.user.update("name", "abc");
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
    name: store[superstore.user.name]
  };
};

export default connect(MapStateToProps)(TestComponent);
```

To `MapStateToProps`, just treat `superstore` as your js object `initState`'s structure.To Change user's data, just call `superstore.user.update("name", "newname");`, or use a object if you have multiple datas to update once `superstore.user.update({name: "newname", age: 20});`.

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
rechyons: (dispatch: Dispatch<AnyAction>) => { [key: string]: Rechyons }
```

Each value of `superstore` is a Rechyons instance

```ts
import superstore, { store } from "./store";
let superstore = rechyons(store.dispatch);

// superstore.user is one of the Rechyons instances
console.log(superstore.user.name) // get the keyname output "user/name"
console.log(store[superstore.user.name]) // get the value output "zhc"

superstore.user.update({"name", "abc"}) // change state
console.log(superstore.user.name) // output "abc"
```

## License

[MIT](https://www.tldrlegal.com/l/mit)
