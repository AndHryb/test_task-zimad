export const updateFile = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
  anyOf: [
    { required: ['name'] },
  ],
  additionalProperties: false,
};
