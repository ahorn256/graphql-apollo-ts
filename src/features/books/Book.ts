export type Book = {
  id: string,
  title: string,
  author: string,
  isbn: string,
  rating: number,
};

export type InputBook = Omit<Book, 'id'|'rating' & { id?: string, rating?: number }>;
export type FetchedBook = Omit<Book, 'rating' | 'author'> & {
  rating?: number,
  author?: {
    firstname: string,
    lastname: string,
  }
};

export type BookSortIn = keyof Book;
export type BookSortDirection = 'asc' | 'desc';

export type BookSort = {
  orderBy: BookSortIn,
  order: BookSortDirection,
}

