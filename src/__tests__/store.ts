import {
  createStore,
  combineReducers,
  Dispatch,
  AnyAction,
  Store,
  CombinedState
} from "redux";

import rechyons from "../index";

let initState: { [key: string]: { [key: string]: any } } = {
  user: {
    name: "zhc",
    email: "zhc@qqqq.com",
    age: 14
  },
  items: {
    data: [1, 2, 3],
    hight: 123
  }
};

let reducers: { [key: string]: any } = combineReducers<{
  [key: string]: any;
}>(rechyons.reducer(initState));

export let store: Store<
  CombinedState<{ [key: string]: any }>,
  AnyAction
> = createStore(
  combineReducers<{
    [key: string]: any;
  }>(rechyons.reducer(initState))
);

let dispatch: Dispatch<AnyAction> = store.dispatch;

export default rechyons(initState, dispatch);
