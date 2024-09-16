import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync.js';
import uuidv4 from 'uuid/v4.js';
import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
} from 'graphql';

const db = low(new FileSync('data.json'));

function getBook(title = '', isbn = '', id = '') {
  let books = db.get('books');
  console.log(books);

  if (title) {
    books = books.filter({ title });
  }

  if (isbn) {
    books = books.filter({ isbn });
  }

  if (id) {
    books = books.filter({ id });
  }

  const result = books.value();

  return result.map((book) => {
    return { ...book, author: getAuthor(book.author_id) };
  });
}

function deleteBook(id) {
  const book = getBook('', '', id);

  db.get('authors').remove({ id: book[0].author_id }).write();

  db.get('books').remove({ id }).write();

  return book[0];
}

function createBook(book) {
  const author = { ...book.author, id: uuidv4() };
  db.get('authors').push(author).write();
  const newBook = {
    id: uuidv4(),
    title: book.title,
    isbn: book.isbn,
    author_id: author.id,
  };
  db.get('books').push(newBook).write();
  return getBook(newBook.title, newBook.isbn, newBook.id)[0];
}

function updateBook(updatedBook) {
  const book = getBook('', '', updatedBook.id);

  db.get('authors')
    .find({ id: book[0].author_id })
    .assign({ ...updatedBook.author })
    .write();

  db.get('books')
    .chain()
    .find({ id: updatedBook.id })
    .assign({
      id: book[0].id,
      title: updatedBook.title,
      isbn: updatedBook.isbn,
      author_id: book[0].author_id,
    })
    .write();

  return getBook('', '', updatedBook.id)[0];
}

function getAuthor(id) {
  return db.get('authors').find({ id }).value();
}

const bookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
    title: {
      type: GraphQLString,
    },
    isbn: {
      type: GraphQLString,
    },
    author: {
      type: authorType,
    },
  }),
});

const bookInputType = new GraphQLInputObjectType({
  name: 'BookInput',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    title: {
      type: GraphQLString,
    },
    isbn: {
      type: GraphQLString,
    },
    author: {
      type: authorInputType,
    },
  }),
});

const authorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
    firstname: {
      type: GraphQLString,
    },
    lastname: {
      type: GraphQLString,
    },
  }),
});

const authorInputType = new GraphQLInputObjectType({
  name: 'AuthorInput',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    firstname: {
      type: GraphQLString,
    },
    lastname: {
      type: GraphQLString,
    },
  }),
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    book: {
      type: GraphQLList(bookType),
      args: {
        title: {
          type: GraphQLString,
        },
        isbn: {
          type: GraphQLString,
        },
      },
      resolve: (root, { title, isbn, id }) => getBook(title, isbn, id),
    },
  }),
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    deleteBook: {
      type: bookType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (root, { id }) => {
        return deleteBook(id);
      },
    },
    createBook: {
      type: bookType,
      args: {
        newUser: {
          type: bookInputType,
        },
      },
      resolve: (root, { newBook }) => createBook(newBook),
    },
    updateBook: {
      type: bookType,
      args: {
        updatedUser: {
          type: bookInputType,
        },
      },
      resolve: (root, { updatedBook }) => updateBook(updatedBook),
    },
  }),
});

export default new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
