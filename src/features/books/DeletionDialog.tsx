import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close } from '@mui/icons-material';
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { convertToFetchError, IFetchError } from "../../FetchError";
import { useDeleteBookMutation } from "../../graphql/generated";

function DeletionDialog() {
  const [ open, setOpen ] = useState(false);
  const { id } = useParams<{id:string}>();
  const navigate = useNavigate();
  const [ error, setError ] = useState<IFetchError|null>(null);
  const [ deleteBook ] = useDeleteBookMutation({ refetchQueries: [ 'BooksList' ] });

  const onClose = useCallback(() => {
    setError(null);
    setOpen(false);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    setOpen(true);
  }, [id]);

  function onConfirm(confirmed: boolean) {
    if(id && confirmed) {
      deleteBook({ variables: { id }})
      .then(() => onClose())
      .catch((error) => setError(convertToFetchError(error)));
    } else {
      onClose();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description">

      <DialogTitle id="confirm-dialog-title">
        { error ? 'Error' : 'Confirm deletion' }
      </DialogTitle>

      <IconButton
        onClick={() => onConfirm(false)}
        sx={{
          position: 'absolute',
          right: 10,
          top: 10,
        }}>
        <Close />
      </IconButton>

      <DialogContent id="confirm-dialog-description">
        { error ?
          <div className="error">{error.message}</div> :
          `Do you want remove "${id}"?`
        }
      </DialogContent>

      { !error &&
        <DialogActions>
          <Button onClick={() => onConfirm(false)}>Abbrechen</Button>
          <Button onClick={() => onConfirm(true)}>Ok</Button>
        </DialogActions>}
    </Dialog>
  );
}

export default DeletionDialog;
