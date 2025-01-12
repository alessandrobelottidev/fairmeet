import secrets from '@core/secrets';

export default {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Fairmeet API',
      description: 'All the data needed to power the frontend',
      version: '1.0.0',
      contact: {
        name: 'Marco Adami, Alessandro Belotti',
      },
    },
    servers: [
      {
        url: `http://localhost:${secrets.REST_API_PORT}`,
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/core/routes/*.ts',
    './src/features/places/routes/*.ts',
    './src/features/auth/routes/*.ts',
    './src/features/groups/routes/*.ts',
    './src/features/meetings/routes/*.ts',
  ],
};
