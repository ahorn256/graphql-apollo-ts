import * as Icon from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

function Nav() {
  let loginToken = false;

  function onLogout() {
    console.log('TODO: onLogout()');
  }

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{flexGrow: 1}} />
        { !loginToken && <Link to="/login" style={{color: 'inherit'}}><Icon.Login /></Link> }
        { loginToken && <IconButton color="inherit" onClick={onLogout}><Icon.Logout /></IconButton> }
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
