import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'CampusLearn API',
      version: '1.0.0',
      description: 'REST API documentation for CampusLearn (auth, topics, replies, files, integrations)',
    },
    servers: [{ url: '/api/v1' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // include routes, controllers, and your integrations route file
  apis: ['src/routes/**/*.js', 'src/controllers/**/*.js', 'src/integrations/**/*.js'],
});

