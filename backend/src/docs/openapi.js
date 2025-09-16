import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'CampusLearn API',
      version: '1.0.0',
      description: 'REST API documentation for CampusLearn (auth, topics, replies, uploads)',
    },
    servers: [{ url: '/api/v1' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  // JSDoc annotations will be read from your routes and controllers
  apis: ['src/routes/**/*.js', 'src/controllers/**/*.js'],
});
