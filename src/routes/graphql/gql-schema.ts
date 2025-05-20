import { GraphQLObjectType, GraphQLSchema } from 'graphql/type/index.js';
import { memberTypeIdQuery, memberTypesQuery } from './queries/memberTypesQuery.js';
import { profileIdQuery, profileQuery } from './queries/profileQuery.js';
import { userQuery, usersQuery } from './queries/userQuery.js';
import { postQuery, postsQuery } from './queries/postQuery.js';
import { changeUser, createUser, deleteUser } from './mutations/userMutations.js';

export const rootSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      memberTypes: memberTypesQuery,
      memberType: memberTypeIdQuery,
      profiles: profileQuery,
      profile: profileIdQuery,
      users: usersQuery,
      user: userQuery,
      posts: postsQuery,
      post: postQuery,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutations',
    fields: {
      createUser: createUser,
      changeUser,
      deleteUser
    },
  }),
});
