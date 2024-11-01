import { gql } from "@apollo/client";

export const getUserById = gql`
query GetUserById($id: ID) {
  getUserById(_id: $id) {
    _id
    name
    username
    email
    password
    profilePicture
    total
  }
}
`;