import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql/type/index.js';
import { memberTypeIdField, memberTypesField } from './fields/memberTypesField.js';

export const rootSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      memberTypesField,
      memberTypeIdField,
    },
  }),
});
