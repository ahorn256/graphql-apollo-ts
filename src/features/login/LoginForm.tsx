import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 as Grid, IconButton, TextField } from "@mui/material";
import { Login } from "./Login";
import { yupResolver } from "@hookform/resolvers/yup";
import loginValidationSchema from "./loginValidationSchema";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertToFetchError, IFetchError } from "../../FetchError";
import apolloClient, { token } from "../../apolloClient";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState:{errors},
  } = useForm<Login>({
    resolver: yupResolver(loginValidationSchema),
  });
  const [ open, setOpen ] = useState(false);
  const navigate = useNavigate();
  const [ error, setError ] = useState<IFetchError|null>(null);

  const onClose = useCallback(() => {
    setOpen(false);
    navigate('/');
  }, [navigate]);

  const onLogin = async (login:Login) => {
    try {
      const url = process.env.REACT_APP_BACKEND_URL;

      if(!url){
        throw new Error('REACT_APP_BACKEND_URL is undefined');
      }

      const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(login),
      })

      if(response.ok) {
        const data = await response.text();
        token(data);
        apolloClient.resetStore();
        onClose();
      } else {
        throw new Error(`Fetching token failed with: ${response.status} ${response.statusText}`);
      }        
    } catch(error) {
      setError(convertToFetchError(error));
    }
  }

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      aria-labelledby="login-form-title"
      aria-describedby="login-form-description">
      <DialogTitle id='login-form-title'>Title</DialogTitle>

      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}>
        <Close />
      </IconButton>
      
      <form onSubmit={handleSubmit(onLogin)}>
        <DialogContent id='login-form-description'>
          {error && <div className="error">Error: {error.message}</div>}
          <Grid container direction="column" rowSpacing={1}>
            <Grid>
              <TextField fullWidth={true} label='Benutzername' error={!!errors.user} {...register('user')}></TextField>
              { errors.user && <div className="error">{errors.user.message}</div>}
            </Grid>
            <Grid>
              <TextField fullWidth={true} label='Passwort' error={!!errors.password} {...register('password')}></TextField>
              { errors.password && <div className="error">{errors.password.message}</div>}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Abbrechen</Button>
          <Button type='submit'>Login</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default LoginForm;
