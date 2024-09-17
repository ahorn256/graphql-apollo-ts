import { ApolloClient, createHttpLink, InMemoryCache, makeVar } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

export const token = makeVar('');

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token()}`,
    }
  }
});

const apolloClient = new ApolloClient({
  link: authLink.concat(
    createHttpLink({
      uri: `${process.env.REACT_APP_BACKEND_URL}/api`,
    })
  ),
  cache: new InMemoryCache(),
});

export default apolloClient;
