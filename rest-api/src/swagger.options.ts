export default {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Employee API',
      description: 'Employee API Information',
      version: '1.0.0',
      contact: {
        name: 'Sagi Weizmann',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.REST_API_PORT}/${process.env.REST_API_PORT}`,
      },
    ],
  },
  apis: ['./src/api/routes/v1/*.js'],
};
