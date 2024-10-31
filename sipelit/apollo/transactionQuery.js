import { gql } from "@apollo/client";

export const getTransactions = gql`
  query GetTransactions {
    getTransactions {
      _id
      name
      category
      totalPrice
      userId
      createdAt
    }
  }
`;
export const createTransaction = gql`
  query GetTransactions {
    getTransactions {
      _id
      name
      category
      totalPrice
      userId
      createdAt
    }
  }
`;
export const getTransactionById = gql`
  query GetTransactionById($id: ID) {
    getTransactionById(_id: $id) {
      _id
      userTransaction {
        _id
        name
        items {
          name
          price
          quantity
        }
        totalPrice
        userId
        createdAt
        updatedAt
      }
      name
      items {
        name
        price
        quantity
      }
      category
      tax
      totalPrice
      userId
      createdAt
      updatedAt
    }
  }
`;
