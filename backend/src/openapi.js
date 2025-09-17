// backend/src/openapi.js
export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'CampusLearn API',
    version: '1.0.0',
    description: 'Full-stack CampusLearn platform API',
  },
  servers: [
    {
      url: 'http://localhost:4000/api/v1', // 👈 Swagger “Try it out” will call here
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {}, // auto-populated or extended with your routes
};

