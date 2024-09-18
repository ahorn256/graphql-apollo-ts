import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 as Grid, IconButton, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { Book, InputBook } from './Book';
import formValidationSchema from './formValidationSchema';
import { useNavigate, useParams } from 'react-router-dom';
import { convertToFetchError, IFetchError } from '../../FetchError';
import { useBookByIdLazyQuery, useCreateBookMutation, useUpdateBookMutation } from '../../graphql/generated';

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
  const [ updateBook ] = useUpdateBookMutation({ refetchQueries: [ 'BooksList' ] });
  const [ getBook, { error: bookByIdError } ] = useBookByIdLazyQuery();
  const [ book, setBook ] = useState<Book|null>(null);

  const onClose = useCallback(() => {
    setError(null);
    setOpen(false);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if(bookByIdError) {
      setOpen(true);
      setError(convertToFetchError(bookByIdError));
    }
  }, [ bookByIdError ]);

  useEffect(() => {
    if(id) {
      getBook({ variables: { id }})
      .then((response) => {
        if(response.data?.book && response.data?.book.length && response.data?.book[0]){
          const { title, isbn, author } = response.data?.book[0];
          setBook({
            id,
            title: title || '',
            isbn: isbn || '',
            author: {
              firstname: author?.firstname || '',
              lastname: author?.lastname || '',
            },
            rating: 0,
          });
        }
      });
    }
  }, [ id, getBook ]);

  useEffect(() => {
    if(book) {
      setOpen(true);
      reset(book);
    } else if(!id) {
      setOpen(true);
      reset({
        title: '',
        author: {
          firstname: '',
          lastname: '',
        },
        isbn: '',
      });
    }
  }, [ id, book, reset ]);

  function onSave(book: InputBook) {
    const newBook = {
      title: book.title,
      isbn: book.isbn,
      author: book.author?.firstname || book.author?.lastname ? book.author : undefined,
    };

    if(id) {
      updateBook({ variables: { book: { ...newBook, id } } })
      .then(() => onClose())
      .catch((error) => setError(convertToFetchError(error)));
    } else {
      createBook({ variables: { book: newBook } })
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
