export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    userId: String
  }

  type Query {
    users: [User]
    posts: [Post]
  }
`;
