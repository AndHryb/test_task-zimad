export const deleteUser = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      pattern: '^[1-9][0-9]*$',
    },
  },
  required: [
    'userId',
  ],
  additionalProperties: false,
};
