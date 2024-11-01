import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getItemAsync } from "expo-secure-store";

const httpLink = new HttpLink({
  // Bryan
  // uri: "http://192.168.10.189:3000",

  //Tasya
  uri: "http://192.168.9.252:3000",

  
  // cors: false,
});

const authLink = setContext(async (_, { headers }) => {
  // const token = await getItemAsync("access_token");
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzIwY2FjMzYzNzhhZWE2ZWUxYjQwMWYiLCJpYXQiOjE3MzAyMDIzMzB9.fFRi2ZF4YipmVcMhbl_yibMiIzNwu5jsWdSmG2BPxiQ";
  
  return token
    ? {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      }
    : null;
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
