export const refreshToken = {
  type: 'object',
  properties: {
    refreshToken: {
      type: 'string',
      format: 'uuid',
    },
  },
  required: [
    'refreshToken',
  ],
  additionalProperties: false,
};
