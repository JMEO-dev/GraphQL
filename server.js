const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');

const app = express();

const authors = [
  { id: 1, name: 'J. K. Rowling' },
  { id: 2, name: 'J. R. R. Tolkien' },
  { id: 3, name: 'Brent Weeks' },
];

const books = [
  {
    id: 1,
    name: 'Harry Potter and the Chamber of Secrets',
    authorld: 1,
  },
  {
    id: 2,
    name: 'Harry Potter and the Prisoner of Azkaban',
    authorld: 1,
  },
  { id: 3, name: 'Harry Potter and the Goblet of Fire', authorld: 1 },
  { id: 4, name: 'The Fellowship of the Ring', authorld: 2 },
  { id: 5, name: 'The Two Towers', authorld: 2 },
  { id: 6, name: 'The Return of the King', authorld: 2 },
  { id: 7, name: 'The Way of Shadows', authorld: 3 },
  { id: 8, name: 'Beyond the Shadows', authorld: 3 },
];

// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'HelloWorld',
//     fields: () => ({
//       message: {
//         type: GraphQLString,
//         resolve: () => 'Hello World',
//       },
//     }),
//   }),
// });

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents an author of a book ',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorld === author.id);
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorld: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (books) => {
        return authors.find((author) => author.id === books.authorld);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'Find a single book',
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        books.find((book) => book.id === args.id),
    },

    books: {
      type: new GraphQLList(BookType),
      description: 'List of All Books',
      resolve: () => books,
    },

    author: {
      type: AuthorType,
      description: 'Find a Single Author',
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.id),
    },

    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of All Authors',
      resolve: () => authors,
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Add a Book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorld: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorld: args.authorld,
        };
        books.push(book);
        return book;
      },
    },

    addAuthor: {
      type: AuthorType,
      description: 'Add an author',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = {
          id: authors.length + 1,
          name: args.name,
        };
        authors.push(author);
        return author;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(5000, () => {
  console.log('Server started at port 5000');
});
