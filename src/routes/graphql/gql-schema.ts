import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql/type/index.js';
import { memberTypeIdQuery, memberTypesQuery } from './queries/memberTypesQuery.js';
import { profileIdQuery, profileQuery } from './queries/profileQuery.js';
import { userQuery, usersQuery } from './queries/userQuery.js';
import { postQuery, postsQuery } from './queries/postQuery.js';

export const rootSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      memberTypesQuery,
      memberTypeIdQuery,
      profileQuery,
      profileIdQuery,
      usersQuery,
      userQuery,
      postsQuery,
      postQuery,
    },
  }),
});
