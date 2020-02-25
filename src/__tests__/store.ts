import { createStore, combineReducers } from "redux";

import rechyons from "../index";

let initState = {
  user: {
    name: "zhc",
    email: "zhc@qqqq.com",
    age: 14
  },
  items: {
    data: [1, 2, 3],
    height: 123
  }
};

export let store = createStore(combineReducers(rechyons.reducer(initState)));

export default rechyons(store.dispatch);
