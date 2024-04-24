import { GraphQLDebuggerContext } from "@graphql-debugger/trace-schema";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql } from "graphql";
import { traceSchema } from "@graphql-debugger/trace-schema";
import { ProxyAdapter } from "@graphql-debugger/adapter-proxy";
import { typeDefs } from "./type-defs";
import { resolvers } from "./resolvers";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const adapter = new ProxyAdapter();
const tracedSchema = traceSchema({
  schema,
  adapter,
});

async function main() {
  const result = await graphql({
    schema: tracedSchema,
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

  console.log(JSON.stringify(result, null, 2));
}

main();
