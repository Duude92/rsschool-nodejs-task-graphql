import {
  GraphQLFieldConfig,
  GraphQLObjectType,
  GraphQLSchema,
  ThunkObjMap,
} from 'graphql/type/index.js';
import { memberTypeIdQuery, memberTypesQuery } from './queries/memberTypesQuery.js';
import { profileIdQuery, profileQuery } from './queries/profileQuery.js';
import { userQuery, usersQuery } from './queries/userQuery.js';
import { postQuery, postsQuery } from './queries/postQuery.js';
import {
  changeUser,
  createUser,
  deleteUser,
  subscribeTo,
  unsubscribeFrom,
} from './mutations/userMutations.js';
import {
  changeProfile,
  createProfile,
  deleteProfile,
} from './mutations/profileMutations.js';
import { changePost, createPost, deletePost } from './mutations/postMutations.js';
import { IMemberType, IPost, IProfile, IUserType } from './api/IObjectTypes.js';
import { FieldBase } from './api/Types.js';
import { Context } from 'node:vm';

const fields: {
  memberTypes: FieldBase<IMemberType, IMemberType[]>;
  memberType: FieldBase<IMemberType, IMemberType>;
  profiles: FieldBase<IProfile, IProfile[]>;
  profile: FieldBase<IProfile, IProfile>;
  users: FieldBase<IUserType, IUserType[]>;
  user: FieldBase<IUserType, IUserType>;
  posts: FieldBase<IPost, IPost[]>;
  post: FieldBase<IPost, IPost>;
} = {
  memberTypes: memberTypesQuery,
  memberType: memberTypeIdQuery,
  profiles: profileQuery,
  profile: profileIdQuery,
  users: usersQuery,
  user: userQuery,
  posts: postsQuery,
  post: postQuery,
};
export const rootSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: fields as unknown as ThunkObjMap<
      GraphQLFieldConfig<unknown, Context, unknown>
    >,
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutations',
    fields: {
      createUser: createUser,
      changeUser,
      deleteUser,
      createProfile,
      changeProfile,
      createPost,
      changePost,
      deletePost,
      deleteProfile,
      subscribeTo,
      unsubscribeFrom,
    },
  }),
});
