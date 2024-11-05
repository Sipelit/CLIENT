import { gql } from "@apollo/client";

export const getTransactions = gql`
query GetTransactions($userId: ID, $name: String) {
  getTransactions(userId: $userId, name: $name) {
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
  mutation createTransaction(
    $name: String
    $userId: ID
    $category: String
    $items: [ItemInput]
    $totalPrice: Float
    $tax: Int
  ) {
    createTransaction(
      name: $name
      userId: $userId
      category: $category
      items: $items
      totalPrice: $totalPrice
      tax: $tax
    ) {
      _id
      name
      category
      tax
      totalPrice
      userId
      createdAt
      updatedAt
      items {
        name
        price
        quantity
      }
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
export const searchByName = gql`
  query GetTransactionByName($name: String) {
    getTransactionByName(name: $name) {
      _id
      name
      category
      totalPrice
      userId
      createdAt
    }
  }
`;

export const generateOCR = gql`
  query Gemini($input: String) {
    gemini(input: $input) {
      _id
      name
      items {
        name
        price
        quantity
        totalPrice
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
