export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'GameTracker API',
    version: '1.0.0',
    description:
      'REST API for tracking video games and their ratings. Manage your backlog, playing list, and completed games.',
    contact: { name: 'Jonathan Tubac' },
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local development' },
    { url: 'https://gametracker-api.vercel.app', description: 'Production' },
  ],
  tags: [
    { name: 'Games', description: 'CRUD operations for games' },
    { name: 'Ratings', description: 'Rating management per game' },
    { name: 'Health', description: 'Server health check' },
  ],
  components: {
    schemas: {
      Game: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Elden Ring' },
          dev: { type: 'string', example: 'FromSoftware', description: 'Developer / studio' },
          genre: { type: 'string', example: 'Action RPG' },
          platform: { type: 'string', example: 'PC' },
          release: { type: 'integer', example: 2022, description: 'Release year' },
          status: {
            type: 'string',
            enum: ['playing', 'completed', 'dropped', 'backlog', 'wishlist'],
            example: 'completed',
          },
          hours: { type: 'number', example: 120, description: 'Hours played' },
          image: { type: 'string', example: 'https://example.com/cover.jpg', description: 'Cover image URL' },
          notes: { type: 'string', example: 'Amazing game, loved every second.' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      GameInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'Elden Ring' },
          dev: { type: 'string', example: 'FromSoftware' },
          genre: { type: 'string', example: 'Action RPG' },
          platform: { type: 'string', example: 'PC' },
          release: { type: 'integer', example: 2022 },
          status: {
            type: 'string',
            enum: ['playing', 'completed', 'dropped', 'backlog', 'wishlist'],
            example: 'backlog',
          },
          hours: { type: 'number', example: 0 },
          image: { type: 'string', example: 'https://example.com/cover.jpg' },
          notes: { type: 'string', example: 'Heard great things about it.' },
        },
      },
      Rating: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          game_id: { type: 'integer', example: 1 },
          score: { type: 'number', minimum: 0, maximum: 10, example: 9.5 },
          review: { type: 'string', example: 'A masterpiece. Brutal but fair.' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      RatingInput: {
        type: 'object',
        required: ['score'],
        properties: {
          score: { type: 'number', minimum: 0, maximum: 10, example: 9.5 },
          review: { type: 'string', example: 'A masterpiece. Brutal but fair.' },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'NOT_FOUND' },
              message: { type: 'string', example: 'That game doesnt exist!' },
            },
          },
        },
      },
    },
    parameters: {
      gameId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Game ID',
        schema: { type: 'integer', example: 1 },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Server is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/api/v1/games': {
      get: {
        tags: ['Games'],
        summary: 'List all games',
        description: 'Returns a paginated list of games with optional filtering, search, and sorting.',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 }, description: 'Results per page' },
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search by title' },
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['playing', 'completed', 'dropped', 'backlog', 'wishlist'] },
            description: 'Filter by status',
          },
          {
            name: 'sort',
            in: 'query',
            schema: { type: 'string', enum: ['title', 'release', 'hours', 'created_at'] },
            description: 'Field to sort by',
          },
          {
            name: 'order',
            in: 'query',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
            description: 'Sort direction',
          },
        ],
        responses: {
          200: {
            description: 'List of games',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Game' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Games'],
        summary: 'Create a game',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/GameInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Game created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Game' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },

    '/api/v1/games/{id}': {
      parameters: [{ $ref: '#/components/parameters/gameId' }],
      get: {
        tags: ['Games'],
        summary: 'Get a game by ID',
        responses: {
          200: {
            description: 'Game found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Game' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Game not found',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
      put: {
        tags: ['Games'],
        summary: 'Update a game',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/GameInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Game updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Game' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Game not found',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
      delete: {
        tags: ['Games'],
        summary: 'Delete a game',
        responses: {
          204: { description: 'Game deleted — no content' },
          404: {
            description: 'Game not found',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },

    '/api/v1/games/{id}/rating': {
      parameters: [{ $ref: '#/components/parameters/gameId' }],
      get: {
        tags: ['Ratings'],
        summary: 'Get rating for a game',
        responses: {
          200: {
            description: 'Rating found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Rating' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Game or rating not found',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
      post: {
        tags: ['Ratings'],
        summary: 'Create or update rating (upsert)',
        description: 'If the game already has a rating, it will be updated. Otherwise a new one is created.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RatingInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Rating saved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Rating' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error (score missing or out of range)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          404: {
            description: 'Game not found',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
      delete: {
        tags: ['Ratings'],
        summary: 'Delete rating for a game',
        responses: {
          204: { description: 'Rating deleted — no content' },
          404: {
            description: 'Game or rating not found',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
  },
};
