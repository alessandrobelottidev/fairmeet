import app from '@core/app';
import secrets from '@core/secrets';
import mongoose from 'mongoose';

const clientOptions = { dbName: 'fairmeet' };

mongoose
  .connect(secrets.MONGODB_CONNECTION_URI, clientOptions)
  .then(() => {
    app.listen(secrets.REST_API_PORT, () => {
      console.log('Server running on port ', secrets.REST_API_PORT);
    });
  })
  .catch(console.dir);
