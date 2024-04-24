import { GraphQLDebuggerContext } from "@graphql-debugger/trace-schema";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql } from "graphql";

const typeDefs = /* GraphQL */ `
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

const resolvers = {
  Query: {
    users: () => [{ id: 1, username: "John Doe", email: "jhon-doe@email.com" }],
    posts: () => [
      { id: 1, title: "Hello World", content: "Hello World!", userId: 1 },
    ],
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

async function main() {
  const result = await graphql({
    schema,
    source: /* GraphQL */ `
      query {
        users {
          id
          username
          email
        }
      }
    `,
    contextValue: {
      GraphQLDebuggerContext: new GraphQLDebuggerContext(),
    },
  });

  console.log(result);
}

main();
