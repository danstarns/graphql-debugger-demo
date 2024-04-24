export const resolvers = {
  Query: {
    users: () => [{ id: 1, username: "John Doe", email: "jhon-doe@email.com" }],
    posts: () => [
      { id: 1, title: "Hello World", content: "Hello World!", userId: 1 },
    ],
  },
};
