import swaggerOptions from '@/swagger.options';
import { errorHandler } from '@middlewares/errors';
import events from '@routes/events';
import spots from '@routes/spots.routes';
import express from 'express';
import swaggerjsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const swaggerDocs = swaggerjsdoc(swaggerOptions);

app.use(express.json());

app.get('/healthcheck', (_, res) => {
  res.send({
    Status: 'Running healthy',
    DateTime: Date.now(),
    AppLocals: app.locals,
  });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/v1/events', events);
app.use('/v1/spots', spots);

// Centralized error-handling middleware
app.use(errorHandler);

export default app;
