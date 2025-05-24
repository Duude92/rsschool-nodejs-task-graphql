import { GraphQLList, GraphQLNonNull } from 'graphql/type/index.js';
import { PostType } from '../types/postType.js';
import { UUIDType } from '../types/uuid.js';
import { FieldBase } from '../api/Types.js';
import { IPost } from '../api/IObjectTypes.js';

export const postsQuery: FieldBase<IPost, IPost[]> = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
  resolve: async (_, __, context) => await context.prisma.post.findMany(),
};
export const postQuery: FieldBase<IPost, IPost> = {
  type: PostType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }, context) =>
    (await context.prisma.post.findUnique({
      where: {
        id: id,
      },
    })) as IPost,
};
