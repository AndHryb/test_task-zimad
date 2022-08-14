export const fileId = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
    },
  },
  required: [
    'id',
  ],
  additionalProperties: false,
};
