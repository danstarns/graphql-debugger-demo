import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql } from "graphql";
import { typeDefs } from "./type-defs";
import { resolvers } from "./resolvers";
import { promisify } from "util";
import {
  GraphQLDebuggerContext,
  traceSchema,
} from "@graphql-debugger/trace-schema";
import { ProxyAdapter } from "@graphql-debugger/adapter-proxy";
import { PrismaInstrumentation } from "@prisma/instrumentation";
import { PrismaClient } from "@prisma/client";

const sleep = promisify(setTimeout);
const prisma = new PrismaClient();

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
  await sleep(2000); // wait for schema to be inital exported to debugger, for demo only

  await prisma.user.create({
    data: {
      username: "test",
      email: `email-${Math.random()}@example.com`,
    },
  });

  const result = await graphql({
    schema: tracedSchema.schema,
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
      GraphQLDebuggerContext: new GraphQLDebuggerContext({
        schema: tracedSchema.schema,
        schemaHash: tracedSchema.schemaHash,
      }),
    },
  });
}

main();
