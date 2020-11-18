import {
  AppBar,
  Button,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useContext, useEffect } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import { StoreContext } from "../store";
import { navigate } from "@reach/router";

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

const Navbar = (props: any) => {
  const { dispatch } = useContext(StoreContext);
  const classes = useStyles();

  const logProps = useCallback(() => {
    console.log(props);
  }, [props]);

  useEffect(() => {
    logProps();
  }, [logProps]);

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
        <Button color="inherit" onClick={() => navigate("/login")}>
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
