import {
  AppBar,
  Button,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useContext } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import { StoreContext } from "../store";
import { navigate } from "@reach/router";
import { useAuth } from "reactfire";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar = (_props: any) => {
  const { dispatch } = useContext(StoreContext);
  const classes = useStyles();
  const auth = useAuth();

  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const navToHome = () => {
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      style={{ backgroundColor: "#242f40", color: "#ffbe30" }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          className={classes.title + " home-button"}
          variant="h6"
          onClick={navToHome}
        >
          Beecon
        </Typography>
        <Button
          color="inherit"
          onClick={() => auth.signOut().then(() => window.location.reload())}
        >
          Log Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
