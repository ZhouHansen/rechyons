import { Dispatch, AnyAction } from "redux";

class Rechyons {
  [key: string]: any;
  constructor(
    name: string,
    initState: { [key: string]: { [key: string]: any } },
    private dispatch: Dispatch<AnyAction>
  ) {
    Object.keys(initState[name]).map(key => {
      this[key] = name + key;
      return null;
    });
  }

  update(name: string | { [k: string]: any }, payload: any) {
    if (typeof name === "object" && name !== null) {
      for (let key in name) {
        this.dispatch({ type: this[key], payload: name[key] });
      }
    } else if (typeof name === "string") {
      this.dispatch({ type: this[name], payload });
    }
  }
}

function reducerMapper(
  initState: { [key: string]: { [key: string]: any } },
  name: string
) {
  return Object.keys(initState[name]).reduce((sum, key) => {
    return {
      ...sum,
      [name + key]: (
        state = initState[name][key],
        { type, payload }: { type: string; payload: any }
      ) => {
        switch (type) {
          case name + key: {
            return payload;
          }
          default:
            return state;
        }
      }
    };
  }, {});
}

rechyons.reducer = (initState: { [key: string]: { [key: string]: any } }) => {
  return Object.keys(initState).reduce((sum, name) => {
    return { ...sum, ...reducerMapper(initState, name) };
  }, {});
};

export default function rechyons(
  initState: { [key: string]: { [key: string]: any } },
  dispatch: Dispatch<AnyAction>
) {
  let r: { [key: string]: any } = Object.keys(initState).reduce((sum, name) => {
    return {
      ...sum,
      [name]: new Rechyons(name, initState, dispatch)
    };
  }, {});

  return r;
}
