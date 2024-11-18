import { globalErrorHandler, notFoundErrorHandler } from '@core/middlewares/errors';
import auth from '@features/auth/routes/auth.routes';
import events from '@features/places/routes/events.routers';
import spots from '@features/places/routes/spots.routes';
import swaggerOptions from '@options/swagger.options';
import cookies from 'cookie-parser';
import express from 'express';
import swaggerjsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const swaggerDocs = swaggerjsdoc(swaggerOptions);

app.use(express.json());
app.use(cookies());

app.get('/healthcheck', (_, res) => {
  res.send({
    Status: 'Running healthy',
    DateTime: Date.now(),
    AppLocals: app.locals,
  });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:            # arbitrary name for the security scheme
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT    # optional, arbitrary value for documentation
 */
app.use('/v1/auth', auth);

app.use('/v1/events', events);
app.use('/v1/spots', spots);

// Handle unregistered route for all HTTP Methods
app.all('*', notFoundErrorHandler);

// Centralized error-handling middleware
app.use(globalErrorHandler);

export default app;
