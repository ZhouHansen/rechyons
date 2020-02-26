import { createStore, combineReducers } from "redux";

import rechyons from "rechyons";

let initState = {
  user: {
    name: "zhc"
  }
};

export let store = createStore(combineReducers(rechyons.reducer(initState)));

export let hyperstore = rechyons(initState, store.dispatch);
