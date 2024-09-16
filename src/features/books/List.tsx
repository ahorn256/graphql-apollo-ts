import { useMemo, useState } from "react";
import { IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { Delete, Edit, Star, StarBorder } from "@mui/icons-material";
import { gql, useQuery } from '@apollo/client';
import { Book, BookSort, BookSortIn, FetchedBook } from "./Book";
import { useNavigate } from "react-router-dom";
import { sortBooks } from "./booksHelpers";
import ErrorMessage from "../../ErrorMessage";

const tableHead = {
  title: 'Title',
  author: 'Author',
  isbn: 'ISBN',
  rating: 'Bewertung',
};

const GET_BOOKS = gql`
  query {
    book {
      id
      title
      isbn
      author {
        firstname
        lastname
      }
    }
  }
`;

function List() {
  const [ sort, setSort ] = useState<BookSort>({
    orderBy: 'title',
    order: 'asc',
  });
  const navigate = useNavigate();
  const { error, data } = useQuery<{ book: FetchedBook[] }>(GET_BOOKS);

  // convert FetchBook[] into Book[]
  const books = useMemo<Book[]>(() => {
    if(data) {
      return data.book.map(b => {
        const {
          id,
          title,
          isbn,
          author = {
            firstname: '',
            lastname: '',
          },
          rating = 0
        } = b;
        const book:Book = {
          id,
          title,
          isbn,
          rating,
          author: `${author.firstname} ${author.lastname}`,
        };
        return book;
      });
    } else {
      return [];
    }
  }, [data]);

  const sortedBooks = useMemo<Book[]>(() => sortBooks(books, sort), [sort, books]);

  function onDelete(book:Book) {
    navigate(`/delete/${book.id}`);
  }

  function onEdit(book:Book) {
    navigate(`/edit/${book.id}`);
  }

  return (
    <Paper>
      { error && <ErrorMessage error={error}/> }
      <Table>
        <TableHead>
          <TableRow>
            {Object.entries(tableHead).map(([key, head]) => (
              <TableCell key={key}>
                {head}
                <TableSortLabel
                  active={sort.orderBy === head}
                  direction={sort.order}
                  onClick={() => {
                    setSort({
                      orderBy: key as BookSortIn,
                      order: sort.order === 'asc' ? 'desc' : 'asc'
                    });
                  }} />
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedBooks.map(book => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>{Array(5).fill(0).map((item, index) => index < book.rating ? <Star key={index} /> : <StarBorder key={index} />)}</TableCell>
              <TableCell>
                <IconButton aria-label="edit book" onClick={() => onEdit(book)}>
                  <Edit />
                </IconButton>
                <IconButton aria-label="delete book" onClick={() => onDelete(book)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default List;
