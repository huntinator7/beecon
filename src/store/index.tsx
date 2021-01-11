import React, {
  createContext,
  Dispatch,
  FunctionComponent,
  useReducer,
} from "react";
import { StoreAction } from "./actions";

interface StoreState {
  sidebarOpen: boolean;
  mainRef: any;
}

const initialStore: StoreState = { sidebarOpen: false, mainRef: null };

function reducer(state: StoreState, action: StoreAction) {
  switch (action.type) {
    case "OPEN_SIDEBAR":
      return { ...state, sidebarOpen: true };
    case "CLOSE_SIDEBAR":
      return { ...state, sidebarOpen: false };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "SET_MAIN_REF":
      return { ...state, mainRef: action.mainRef };
    case "SCROLL_MAIN_REF":
      state.mainRef.current.scrollTop = state.mainRef.current.scrollHeight;
      return state;
    default:
      return state;
  }
}

export const StoreContext = createContext<{
  state: StoreState;
  dispatch: Dispatch<StoreAction>;
}>({} as any);

export const StoreProvider: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(reducer, initialStore);
  const store = { state, dispatch };
  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};
