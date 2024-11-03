import { gql } from "@apollo/client";

export const CREATE_USER_TRANSACTION = gql`
  mutation Mutation($userTransactions: [UserTransactionInput]) {
    createUserTransactionMany(userTransactions: $userTransactions)
  }
`;
