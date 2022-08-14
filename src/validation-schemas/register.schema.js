export const register = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 6,
    },
    name: {
      type: 'string',
    },
  },
  required: [
    'email',
    'password',
    'name',
  ],
  additionalProperties: false,
};
