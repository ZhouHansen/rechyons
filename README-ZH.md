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

#### <center>Redux 不再冗长啰嗦, Redux 伟大复兴!</center>

<center>有这样一个库让你在使用redux，无需再写reducers和actions，同时保持不可突变性</center>

## 动机

<img width=450 src="./for_readme.png"/>

重复大量地命名真是很烦人
Redux 有一个缺点: 它太啰嗦了，当你需要加一个小功能时，就要写很多行：

- 常量名
- action 类型,
- action 创建者,
- reducer，在 reducer 中执行 action
- ...

实际上我们已经忍受这个缺点[好几年了](https://community.risingstack.com/repatch-the-simplified-redux/), 同时情况似乎变得越来越糟糕，当我们不加思考地滥用 redux sagas 和 generator 时，便陷入了[冗长的噩梦](https://github.com/ZhouHansen/rechyons#verbose-nightmare)

是时候重新思考如何使用 redux 了。 [为什么你不需要 Redux Saga](https://medium.com/slido-dev-blog/why-you-need-no-redux-saga-4d4dc46e448)

##### 通过`rechyons`, 你再也不用写上述的这一切了

Rechyons 让 redux state 变得像一般 js object 一样容易修改和取值，同时保持它的 immutable。

```ts
// 修改
hyperstore.user.update({ name: "yourname" });

// 取值
let username = hyperstore.user.name;
```

## 使用

[例子](https://github.com/ZhouHansen/rechyons/tree/master/src) 或者 [稍大一点的应用](https://github.com/ZhouHansen/dat-react-shopping-list)

```
$ git clone git@github.com:ZhouHansen/rechyons.git
$ cd rechyons/example
$ yarn install
$ yarn start
```

## 原理 (8 分钟差不多读完, 比你想象简单)

### 安装

支持 typescript 和 javascript

```sh
$ npm install rechyons
```

### 前提

```json
// 你的app的tsconfig.json
{
  "compilerOptions": {
    "strict": false
  }
}
```

### 启动 redux store 和 rechyons

`rechyons` 为每一个 state 数据生成 action 和 reducer。你的 State 的结构需要是这样的:

```
{
  moduleA: {keyA: somevalue, keyB: somevalue, keyC: somevalue},
  moduleB: {keyA: somevalue, keyB: somevalue, keyC: somevalue},
}
```

`rechyons` 出口两个函数 `rechyons.reducer()` 和 `rechyons()`.

`rechyons.reducer()` 用你的初始 state 自动生成 `'user/name'`, `'user/age'`, `'animal/category'`, `'animal/weight'` 四对 action 和 reducer。 然后返回 reducers 到 `redux.combineReducers`来创建 store.

`rechyons()` 吞下 `store.dispatch` 为接下来提交自生成的 action。

```ts
// store.ts
import { createStore, combineReducers } from "redux";

import rechyons from "rechyons";

let initState = {
  // moduleA
  user: {
    name: "小成",
    age: 10
  },
  // moduleB
  animal: {
    category: "猫咪",
    weight: 10
  }
};

export let store = createStore(combineReducers(rechyons.reducer(initState)));

export default rechyons(initState, store.dispatch);
```

### 在组件中进行数据绑定，获取和修改

`rechyons(initState, store.dispatch)`返回一个`hyperstore`, `hyperstore.user`和`hyperstore.animal`都是`Rechyons`的实例.

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
            hyperstore.user.update("name", "小汉");
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

#### 从 state 中获取数据

`store[hyperstore.user.name]` 等于 `initState.user.name` 等于 "小成";
`store[hyperstore.animal.weight]` 等于 `initState.animal.weight` 等于 10; 所以我们用这个来进行`MapStateToProps()`

#### 修改数据

使用 `hyperstore.user.update("name", "小汉")` 或者 `hyperstore.user.update({"name": "小汉"})`，`hyperstore.user.update("name", "abc")` 对特指的 action 执行了`store.dispatch({type: "user/name", "abc})`。

## API

### rechyons.reducer()

```ts
type ReducerType = { [key: string]: (state: any, action: AnyAction) => any };
type initStateType = { [key: string]: { [key: string]: any } };

rechyons.reducer: (initState: initStateType) => ReducerType
```

`rechyons.reducer()` 返回从初始 state 生成的 reducers，它的唯一作用是创建 redux store。

```ts
export let store = createStore(combineReducers(rechyons.reducer(initState)));
```

### rechyons()

```ts
rechyons: (initState: initStateType, dispatch: Dispatch<AnyAction>) => { [key: string]: Rechyons }
```

每一个 `hyperstore,someModule` 都是一个 Rechyons 实例

```ts
import hyperstore, { store } from "./store";
let hyperstore = rechyons(initState, store.dispatch);

// hyperstore.user是一个Rechyons实例
console.log(hyperstore.user.name); // keyname 等于为 "user/name"
console.log(store[hyperstore.user.name]); // 通过keyname获得的值为 "小成"

hyperstore.user.update({ name: "小汉", age: 20 }); // 修改数据
console.log(hyperstore.user.name); // 输出 "小汉"
```

### 冗长的噩梦

我想加一个点赞功能 ❤️ 在一款社交 app 上类似微信。

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

在`models/somemodule.js`的`effects`对象中定义一个 generator 用于提交 action。

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

在`actions/somemodule.js`,定义一个新的 action.

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

在`models/somemodule.js`的`reducer`object 对象中加一个 reducer。

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

在`components/somecomponent.js`，映射`dispatch`到`props`.

_人艰不拆_

## License

[MIT](https://www.tldrlegal.com/l/mit)
