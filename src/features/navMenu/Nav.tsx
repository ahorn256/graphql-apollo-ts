import * as Icon from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import apolloClient, { token } from "../../apolloClient";
import { useReactiveVar } from "@apollo/client";

function Nav() {
  const loginToken = useReactiveVar(token);
  const navigate = useNavigate();

  function onLogout() {
    token('');
    apolloClient.clearStore();
    navigate('/');
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
