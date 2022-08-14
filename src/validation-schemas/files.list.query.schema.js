export const filesListQuery = {
  type: 'object',
  properties: {
    list_size: {
      type: 'number',
      minimum: 1,
    },
    page: {
      type: 'number',
      minimum: 1,
    },
  },
  additionalProperties: false,
};
