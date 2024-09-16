import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Author = {
  __typename?: 'Author';
  firstname?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastname?: Maybe<Scalars['String']['output']>;
};

export type AuthorInput = {
  firstname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
};

export type Book = {
  __typename?: 'Book';
  author?: Maybe<Author>;
  id: Scalars['ID']['output'];
  isbn?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type BookInput = {
  author?: InputMaybe<AuthorInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isbn?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createBook?: Maybe<Book>;
  deleteBook?: Maybe<Book>;
  updateBook?: Maybe<Book>;
};


export type MutationCreateBookArgs = {
  newUser?: InputMaybe<BookInput>;
};


export type MutationDeleteBookArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateBookArgs = {
  updatedUser?: InputMaybe<BookInput>;
};

export type Query = {
  __typename?: 'Query';
  book?: Maybe<Array<Maybe<Book>>>;
};


export type QueryBookArgs = {
  isbn?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type BooksListQueryVariables = Exact<{ [key: string]: never; }>;


export type BooksListQuery = { __typename?: 'Query', book?: Array<{ __typename?: 'Book', id: string, title?: string | null, isbn?: string | null, author?: { __typename?: 'Author', firstname?: string | null, lastname?: string | null } | null } | null> | null };


export const BooksListDocument = gql`
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

/**
 * __useBooksListQuery__
 *
 * To run a query within a React component, call `useBooksListQuery` and pass it any options that fit your needs.
 * When your component renders, `useBooksListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBooksListQuery({
 *   variables: {
 *   },
 * });
 */
export function useBooksListQuery(baseOptions?: Apollo.QueryHookOptions<BooksListQuery, BooksListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BooksListQuery, BooksListQueryVariables>(BooksListDocument, options);
      }
export function useBooksListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BooksListQuery, BooksListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BooksListQuery, BooksListQueryVariables>(BooksListDocument, options);
        }
export function useBooksListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BooksListQuery, BooksListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BooksListQuery, BooksListQueryVariables>(BooksListDocument, options);
        }
export type BooksListQueryHookResult = ReturnType<typeof useBooksListQuery>;
export type BooksListLazyQueryHookResult = ReturnType<typeof useBooksListLazyQuery>;
export type BooksListSuspenseQueryHookResult = ReturnType<typeof useBooksListSuspenseQuery>;
export type BooksListQueryResult = Apollo.QueryResult<BooksListQuery, BooksListQueryVariables>;