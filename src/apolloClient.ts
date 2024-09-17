import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: `${process.env.REACT_APP_BACKEND_URL}/api`,
  cache: new InMemoryCache(),
});

export default apolloClient;
