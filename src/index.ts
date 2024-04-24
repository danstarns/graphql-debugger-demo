import { GraphQLDebuggerContext } from "@graphql-debugger/trace-schema";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql } from "graphql";
import { traceSchema } from "@graphql-debugger/trace-schema";
import { ProxyAdapter } from "@graphql-debugger/adapter-proxy";
import { typeDefs } from "./type-defs";
import { resolvers } from "./resolvers";
import { PrismaInstrumentation } from "@prisma/instrumentation";
import { promisify } from "util";

const sleep = promisify(setTimeout);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const adapter = new ProxyAdapter();
const tracedSchema = traceSchema({
  schema,
  adapter,
  instrumentations: [new PrismaInstrumentation()],
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

  await sleep(1000);
}

main();
