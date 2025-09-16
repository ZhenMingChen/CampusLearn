// backend/src/docs/openapi.js
import swaggerJSDoc from 'swagger-jsdoc';

const base = {
  openapi: '3.0.3',
  info: {
    title: 'CampusLearn API',
    version: '1.0.0',
    description:
      'REST API documentation for CampusLearn (auth, topics, replies, files, integrations)',
  },
  servers: [{ url: '/api/v1' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
  security: [{ bearerAuth: [] }],
};

export const swaggerSpec = swaggerJSDoc({
  definition: base,
  apis: [
    'src/routes/**/*.js',
    'src/controllers/**/*.js',
    'src/integrations/**/*.js', // make sure integrations are scanned
    'src/docs/**/*.js',         // optional doc-only files
  ],
});

// --- Inline fallback to guarantee Copilot shows up in Swagger ---
const inlinePaths = {
  '/integrations/copilot': {
    post: {
      summary: 'Ask CampusLearn Copilot (OpenAI)',
      description:
        'Returns a concise assistant reply. Safely returns `{ skipped: true }` if OPENAI_API_KEY is not set.',
      tags: ['Integrations'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['prompt'],
              properties: {
                prompt: {
                  type: 'string',
                  example:
                    'Explain the difference between GIN and BTREE indexes in Postgres.',
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Assistant response or `{ skipped: true }`' },
        401: { description: 'Auth required' },
      },
    },
  },
};

// merge/override into the generated spec
swaggerSpec.paths = { ...(swaggerSpec.paths || {}), ...inlinePaths };


