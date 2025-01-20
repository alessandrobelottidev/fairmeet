import { globalErrorHandler, notFoundErrorHandler } from '@core/middlewares/errors/errorHandler';
import auth from '@features/auth/routes/auth.routes';
import groups from '@features/groups/routes/group.routes';
import meetings from '@features/meetings/routes/meeting.routes';
import events from '@features/places/routes/events.routes';
import places from '@features/places/routes/places.routes';
import spots from '@features/places/routes/spots.routes';
import corsOptions from '@options/cors.options';
import swaggerOptions from '@options/swagger.options';
import cookies from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import swaggerjsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const swaggerDocs = swaggerjsdoc(swaggerOptions);

app.use(cors(corsOptions));

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
// Auth feature
app.use('/v1/auth', auth);

// Places feature
app.use('/v1/places', places);
app.use('/v1/events', events);
app.use('/v1/spots', spots);

// Groups and users feature
app.use('/v1/users', groups);

// Meetings feature
app.use('/v1/meetings', meetings);

// Handle unregistered route for all HTTP Methods
app.all('*', notFoundErrorHandler);

// Centralized error-handling middleware
app.use(globalErrorHandler);

export default app;
