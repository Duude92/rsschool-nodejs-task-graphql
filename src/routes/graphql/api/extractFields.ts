import { GraphQLObjectType, GraphQLResolveInfo } from 'graphql/type/index.js';
import { parseResolveInfo, ResolveTree, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';

export const extractFields = (info: GraphQLResolveInfo, graphQlObject: GraphQLObjectType) => {
  const parsedResolveInfoFragment = parseResolveInfo(info);
  const { fields }: { fields: Record<string, string> } =
    simplifyParsedResolveInfoFragmentWithType(
      parsedResolveInfoFragment as ResolveTree,
      graphQlObject,
    );
  return fields;
};