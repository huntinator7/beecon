export type StoreAction =
  | openSidebar
  | closeSidebar
  | toggleSidebar
  | setMainRef
  | scrollMainRef;

interface openSidebar {
  type: "OPEN_SIDEBAR";
}

interface closeSidebar {
  type: "CLOSE_SIDEBAR";
}

interface toggleSidebar {
  type: "TOGGLE_SIDEBAR";
}

interface setMainRef {
  type: "SET_MAIN_REF";
  mainRef: any;
}

interface scrollMainRef {
  type: "SCROLL_MAIN_REF";
}
