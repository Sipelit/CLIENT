import { gql } from "@apollo/client";


export const LOGIN =  gql`

  mutation login($body: LoginInput!) {
    login(body: $body) {
      accessToken
      user {
        name
      }
    }
  }
`;