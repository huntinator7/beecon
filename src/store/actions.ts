export type StoreAction = openSidebar | closeSidebar | toggleSidebar;

interface openSidebar {
  type: "OPEN_SIDEBAR";
}

interface closeSidebar {
  type: "CLOSE_SIDEBAR";
}

interface toggleSidebar {
  type: "TOGGLE_SIDEBAR";
}
