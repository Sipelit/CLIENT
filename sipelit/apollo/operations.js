import { gql } from "@apollo/client";

export const login = gql`
 mutation Login($username: String, $password: String) {
  login(username: $username, password: $password) {
    token
    username
  }
}
`;

export const register = gql`
mutation Register($name: String, $username: String, $email: String, $password: String) {
  register(name: $name, username: $username, email: $email, password: $password)
}
`;
