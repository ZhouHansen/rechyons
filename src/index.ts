import { Dispatch, AnyAction } from "redux";

type ReducerType = { [key: string]: (state: any, action: AnyAction) => any };
type initStateType = { [key: string]: { [key: string]: any } };

class Rechyons {
  [key: string]: any;
  initState: initStateType;
  constructor(
    name: string,
    initState: initStateType,
    private dispatch: Dispatch<AnyAction>
  ) {
    Object.keys(initState[name]).map(key => {
      this[key] = (name + "/" + key) as string;
      return null;
    });
  }

  update(name: string | { [k: string]: any }, payload?: any) {
    if (typeof name === "object" && name !== null) {
      for (let key in name) {
        this.dispatch({ type: this[key], payload: name[key] });
      }
    } else if (typeof name === "string") {
      this.dispatch({ type: this[name], payload });
    }
  }
}

function reducerMapper(initState: initStateType, name: string) {
  return Object.keys(initState[name]).reduce((sum, key) => {
    return {
      ...sum,
      [name + "/" + key]: (
        state: any = initState[name][key],
        action: AnyAction
      ) => {
        switch (action.type) {
          case name + "/" + key: {
            return action.payload;
          }
          default:
            return state;
        }
      }
    };
  }, {});
}

rechyons.reducer = (initState: initStateType) => {
  this.initState = initState;
  return Object.keys(initState).reduce((sum: ReducerType, name) => {
    return { ...sum, ...(reducerMapper(initState, name) as ReducerType) };
  }, {});
};

export default function rechyons(dispatch: Dispatch<AnyAction>) {
  let r: { [key: string]: Rechyons } = Object.keys(this.initState).reduce(
    (sum, name) => {
      return {
        ...sum,
        [name]: new Rechyons(name, this.initState, dispatch)
      };
    },
    {}
  );

  return r;
}
