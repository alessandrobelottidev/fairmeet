import secrets from '@src/secrets';

export default {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Fairmeet API',
      description: 'All the data needed to power the frontend',
      version: '1.0.0',
      contact: {
        name: 'Marco Adami, Alessandro Belotti, Michela Stopato',
      },
    },
    servers: [
      {
        url: `http://localhost:${secrets.REST_API_PORT}`,
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};
