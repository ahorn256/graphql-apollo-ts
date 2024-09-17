export type Author = {
  firstname: string,
  lastname: string,
}

export type Book = {
  id: string,
  title: string,
  author: Author,
  isbn: string,
  rating: number,
};

export type InputBook = Omit<Book, 'id'|'rating'|'author'> & {
  id?: string,
  rating?: number,
  author?: Author,
};

export type BookSortIn = keyof Book;
export type BookSortDirection = 'asc' | 'desc';

export type BookSort = {
  orderBy: BookSortIn,
  order: BookSortDirection,
}

