import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getItemAsync } from "expo-secure-store";

const httpLink = new HttpLink({
  // Bryan
  uri: "http://192.168.10.189:3000",

  //Tasya
  // uri: "http://192.168.9.252:3000",
  // cors: false,

  // uri: "http://192.168.9.218:3000",
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getItemAsync("access_token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
