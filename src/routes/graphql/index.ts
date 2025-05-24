import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import { rootSchema } from './gql-schema.js';
import depthLimit from 'graphql-depth-limit';
import DataLoader from 'dataloader';
import {
  Context,
  MemberLoaderType,
  PostLoaderType,
  ProfileLoaderType,
  UserLoaderType,
} from './api/Types.js';
import { IMemberType, IPost, IProfile, IUserType } from './api/IObjectTypes.js';

const createLoader = <T>(
  valuePromises: Promise<T[]>,
  predicate: (value: T, key: string) => boolean,
) =>
  new DataLoader(async (keys) => {
    const values = await valuePromises;
    return keys.map(async (key: unknown) =>
      values.filter((value) => predicate(value, key as string)),
    );
  });

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const errors = validate(rootSchema, parse(query), [depthLimit(5)]);
      if (errors.length) return { errors };

      const postLoader: PostLoaderType = createLoader<IPost>(
        prisma.post.findMany(),
        (post, key) => post.authorId === key,
      );
      const profileLoader: ProfileLoaderType = createLoader<IProfile>(
        prisma.profile.findMany({
          include: {
            memberType: true,
          },
        }),
        (profile, key) => profile.userId == key,
      );
      const memberLoader: MemberLoaderType = createLoader<IMemberType>(
        prisma.memberType.findMany(),
        (member, key) => member.id === key,
      );
      const userLoader: UserLoaderType = createLoader<IUserType>(
        prisma.user.findMany(),
        (member, key) => member.id === key,
      );

      return graphql({
        schema: rootSchema,
        source: query,
        variableValues: variables,
        contextValue: {
          prisma,
          loaders: { postLoader, profileLoader, memberLoader, userLoader },
        } as Context,
      });
    },
  });
};
export default plugin;
