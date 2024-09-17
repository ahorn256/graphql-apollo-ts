import { Route, Routes } from 'react-router-dom';
import './App.css';
import BooksApp from './features/books/BooksApp';
import FormDialog from './features/books/FormDialog';
import DeletionDialog from './features/books/DeletionDialog';
import NotFound from './NotFound';
import LoginForm from './features/login/LoginForm';
import Nav from './features/navMenu/Nav';
import { token } from './apolloClient';
import { useReactiveVar } from '@apollo/client';

function App() {
  const serverToken = useReactiveVar(token);

  return (
    <div className="App">
      <Nav />
      <div className='App-content'>
        <Routes>
          <Route path='/' element={ serverToken ? <BooksApp /> : <p>Sie müssen sich anmelden, um den Inhalt zu sehen</p>}>
            <Route path='/new' element={<FormDialog />} />
            <Route path='/edit/:id' element={<FormDialog />} />
            <Route path='/delete/:id' element={<DeletionDialog />} />
          </Route>
          <Route path='/login' element={<LoginForm />} />
          <Route path='*' element={<NotFound />}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
