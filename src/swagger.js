const path = require('path');
const { paths } = require('./routes');

module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Disney Express API with Swagger',
      version: '0.1.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger'
    },
    servers: [
      {
        url: 'http://localhost:3001'
      }
    ],
    components: {
      schemas: {
        ErrorModel: {
          type: 'object',
          properties: {
            code: {
              type: 'integer',
              format: 'int32'
            },
            message: {
              type: 'string'
            }
          }
        },
        Character: {
          type: 'object',
          properties: {
            image: {
              type: 'string'
            },
            name: {
              type: 'string'
            }
          }
        },
        CharacterDetail: {
          type: 'object',
          properties: {
            image: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            age: {
              type: 'integer'
            },
            weight: {
              type: 'integer'
            },
            history: {
              type: 'string'
            },
            movies: {
              type: 'array',
              items: { $ref: '#/components/schemas/Movie' }
            }
          }
        },
        ArrayOfCharacters: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/Character'
          }
        },
        Movie: {
          type: 'object',
          properties: {
            image: {
              type: 'string'
            },
            title: {
              type: 'string'
            },
            createdDate: {
              type: 'string',
              format: 'date'
            },
            score: {
              type: 'integer'
            }
          }
        }
      },
      parameters: {
        skipParam: {
          name: 'skip',
          in: 'query',
          description: 'number of items to skip',
          required: true,
          schema: {
            type: 'integer',
            format: 'int32'
          }
        },
        limitParam: {
          name: 'limit',
          in: 'query',
          description: 'max records to return',
          required: true,
          schema: {
            type: 'integer',
            format: 'int32'
          }
        }
      },
      responses: {
        NotFound: {
          description: 'Entity not found.'
        },
        IllegalInput: {
          description: 'Illegal input for operation.'
        },
        ErrorModel: {
          description: 'General Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorModel'
              }
            }
          }
        }
      },
      securitySchemes: {
        api_key: {
          type: 'apiKey',
          name: 'api_key',
          in: 'header'
        },
        petstore_auth: {
          type: 'oauth2',
          flows: {
            implicit: {
              authorizationUrl: 'http://example.org/api/oauth/dialog',
              scopes: {
                'write:pets': 'modify pets in your account',
                'read:pets': 'read your pets'
              }
            }
          }
        }
      }
    },
    paths: paths.reduce((acc, path) => {
      acc[`/${path}`] = require(`./docs/${path.slice(0, -1)}.json`);
      return acc;
    }, {})
  },
  apis: [`${path.join(__dirname, './routes/*.js')}`]
};
