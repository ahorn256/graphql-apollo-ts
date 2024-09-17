import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 as Grid, IconButton, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { InputBook } from './Book';
import formValidationSchema from './formValidationSchema';
import { useNavigate, useParams } from 'react-router-dom';
import { convertToFetchError, IFetchError } from '../../FetchError';
import { useCreateBookMutation } from '../../graphql/generated';

function FormDialog() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<InputBook>({
    resolver: yupResolver(formValidationSchema),
  });
  const { id } = useParams<{id:string}>();
  const [ open, setOpen ] = useState(false);
  const navigate = useNavigate();
  const [ error, setError ] = useState<IFetchError|null>(null);
  const [ createBook ] = useCreateBookMutation({ refetchQueries: [ 'BooksList' ] });

  const onClose = useCallback(() => {
    setOpen(false);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if(id) {
      setOpen(true);
      const book = null;
      console.log('TODO: get book');
      if(book) {
        reset(book);
      } else {
        reset({
          title: '',
          author: {
            firstname: '',
            lastname: '',
          },
          isbn: '',
        });
      }
    } else {
      setOpen(true);
    }
  }, [id, reset]);

  function onSave(book: InputBook) {
    if(id) {
      console.log('TODO: edit book');
    } else {
      createBook({
        variables: {
          book: {
            title: book.title,
            isbn: book.isbn,
            author: book.author?.firstname || book.author?.lastname ? book.author : undefined,
          }
        }
      })
      .then(() => onClose())
      .catch((error) => setError(convertToFetchError(error)));
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='form-dialog-title'
      aria-describedby='form-dialog-description'>
      <DialogTitle id='form-dialog-title'>
        {id ? 'Buch bearbeiten' : 'Neues Buch anlegen'}
      </DialogTitle>

      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}>
        <Close />
      </IconButton>

      <form onSubmit={handleSubmit(onSave)}>
        <DialogContent id='form-dialog-description'>
          {error && <div className='error'>Error: {error.message}</div>}
          <Grid container direction={'column'} rowSpacing={1} display='flex'>
            <Grid>
              <TextField fullWidth={true} label='Titel' error={!!errors.title} {...register('title')}/>
              { errors.title && <div className='error'>{errors.title.message}</div> }
            </Grid>
            <Grid>
              <TextField fullWidth={true} label='ISBN' error={!!errors.isbn} {...register('isbn')}/>
              { errors.isbn && <div className='error'>{errors.isbn.message}</div> }
            </Grid>
            <Grid>
              <TextField fullWidth={true} label='Author Vorname' error={!!errors.author?.firstname} {...register('author.firstname')}/>
              { errors.author?.firstname && <div className='error'>{errors.author?.firstname.message}</div> }
            </Grid>
            <Grid>
              <TextField fullWidth={true} label='Author Nachname' error={!!errors.author?.lastname} {...register('author.lastname')}/>
              { errors.author?.lastname && <div className='error'>{errors.author?.lastname.message}</div> }
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Abbrechen</Button>
          <Button type='submit'>Speichern</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default FormDialog;
