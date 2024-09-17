import { gql } from "@apollo/client";

gql`
  query BooksList {
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

gql`
  mutation deleteBook($id:ID!) {
    deleteBook(id: $id) {
      id
    }
  }
`;

gql`
  mutation createBook($book: BookInput){
    createBook(newBook: $book) {
      id
    }
  }
`;
