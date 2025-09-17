// backend/src/docs/openapi.js
// OpenAPI spec with Auth, Integrations, Topics, Replies, Files, and System.

const PORT = process.env.PORT || 4000;
const DEFAULT_SERVER = `http://localhost:${PORT}/api/v1`;
const SERVER_URL = process.env.SWAGGER_SERVER_URL || DEFAULT_SERVER;

/** @type {import('openapi3-ts').OpenAPIObject} */
export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'CampusLearn API',
    version: '1.0.0',
    description:
      'CampusLearn full-stack API. Use the Authorize button to paste a JWT access token.\n' +
      `Base: ${SERVER_URL}`,
  },
  servers: [{ url: SERVER_URL, description: 'Local development server' }],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Integrations', description: 'Twilio WhatsApp + Copilot' },
    { name: 'Topics', description: 'Student topics & tutor interactions' },
    { name: 'Files', description: 'Learning material uploads' },
    { name: 'System', description: 'Health & diagnostics' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      // ---- Auth ----
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@demo.dev' },
          password: { type: 'string', example: 'Passw0rd!' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string', enum: ['STUDENT', 'TUTOR', 'ADMIN'] },
              verified: { type: 'boolean' },
            },
          },
        },
      },

      // ---- Topics / Replies ----
      TopicStatus: { type: 'string', enum: ['OPEN', 'ASSIGNED', 'CLOSED'] },
      UserSlim: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['STUDENT', 'TUTOR', 'ADMIN'] },
        },
      },
      Reply: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          content: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          author: { $ref: '#/components/schemas/UserSlim' },
        },
      },
      Topic: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          status: { $ref: '#/components/schemas/TopicStatus' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          author: { $ref: '#/components/schemas/UserSlim' },
          assignee: { $ref: '#/components/schemas/UserSlim' },
          replies: { type: 'array', items: { $ref: '#/components/schemas/Reply' } },
        },
      },
      TopicCreateRequest: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', example: 'Intro to SQL' },
          content: { type: 'string', example: 'How do JOINs work?' },
        },
      },
      ReplyCreateRequest: {
        type: 'object',
        required: ['content'],
        properties: {
          content: { type: 'string', example: 'Use INNER JOIN to match rows on keys…' },
        },
      },

      // ---- Files ----
      FileUploadResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'file_123' },
          url: { type: 'string', example: '/uploads/abc123.pdf' },
          mime: { type: 'string', example: 'application/pdf' },
          size: { type: 'integer', example: 123456 },
          originalName: { type: 'string', example: 'notes.pdf' },
        },
      },

      // ---- Integrations ----
      WhatsAppTestRequest: {
        type: 'object',
        properties: {
          text: { type: 'string', example: 'CampusLearn WhatsApp test message' },
        },
      },
      CopilotRequest: {
        type: 'object',
        required: ['prompt'],
        properties: {
          prompt: { type: 'string', example: 'Explain GIN vs BTREE indexes in Postgres.' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],

  paths: {
    // -------- Auth --------
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and get JWT tokens',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
          401: { description: 'Invalid credentials' },
        },
        security: [], // login doesn’t need a token
      },
    },

    // -------- Topics --------
    '/topics': {
      get: {
        tags: ['Topics'],
        summary: 'List topics (auth required)',
        responses: {
          200: {
            description: 'Array of topics',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Topic' } } } },
          },
          401: { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Topics'],
        summary: 'Create topic (STUDENT only)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/TopicCreateRequest' } } },
        },
        responses: {
          201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Topic' } } } },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },

    '/topics/{id}': {
      get: {
        tags: ['Topics'],
        summary: 'Get topic by id (auth required)',
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Topic' } } } },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
        },
      },
    },

    '/replies/{topicId}': {
      post: {
        tags: ['Topics'],
        summary: 'Post a reply to a topic (TUTOR/ADMIN)',
        parameters: [
          { in: 'path', name: 'topicId', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ReplyCreateRequest' } } },
        },
        responses: {
          201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Reply' } } } },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Topic not found' },
        },
      },
    },

    // -------- Files --------
    '/file/upload': {
      post: {
        tags: ['Files'],
        summary: 'Upload learning material (auth required)',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Uploaded', content: { 'application/json': { schema: { $ref: '#/components/schemas/FileUploadResponse' } } } },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
        },
      },
    },

    // -------- Integrations --------
    '/integrations/whatsapp/test': {
      post: {
        tags: ['Integrations'],
        summary: 'Send a WhatsApp test message (Twilio)',
        requestBody: {
          required: false,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/WhatsAppTestRequest' } } },
        },
        responses: {
          200: { description: 'Message sent (or skipped with reason)' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden (ADMIN only if you enforce roles)' },
        },
      },
    },
    '/integrations/copilot': {
      post: {
        tags: ['Integrations'],
        summary: 'Ask CampusLearn Copilot (OpenAI or Ollama)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CopilotRequest' } } },
        },
        responses: {
          200: { description: 'Assistant reply or { skipped: true, reason }' },
          401: { description: 'Unauthorized' },
        },
      },
    },

    // -------- System --------
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check (no auth)',
        security: [],
        responses: { 200: { description: 'OK' } },
      },
    },
  },
};

