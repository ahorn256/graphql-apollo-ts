import { useMemo, useState } from "react";
import { IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { Delete, Edit, Star, StarBorder } from "@mui/icons-material";
import { Book, BookSort, BookSortIn } from "./Book";
import { useNavigate } from "react-router-dom";
import { sortBooks } from "./booksHelpers";
import ErrorMessage from "../../ErrorMessage";
import { useBooksListQuery } from "../../graphql/generated";

const tableHead = {
  title: 'Title',
  author: 'Author',
  isbn: 'ISBN',
  rating: 'Bewertung',
};

function List() {
  const [ sort, setSort ] = useState<BookSort>({
    orderBy: 'title',
    order: 'asc',
  });
  const navigate = useNavigate();
  const { error, data } = useBooksListQuery();

  // convert data.book into Book[]
  const books = useMemo<Book[]>(() => {
    if(data && data?.book) {
      return data.book.map(b => {
        const book:Book = {
          id: b?.id || '',
          title: b?.title || '',
          isbn: b?.isbn || '',
          rating: 0,
          author: {
            firstname: b?.author?.firstname || '',
            lastname: b?.author?.lastname || '',
          },
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
              <TableCell>{book.author.firstname} {book.author.lastname}</TableCell>
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
