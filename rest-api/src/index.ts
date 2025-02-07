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

export type { IPlace } from '@features/places/types/place.interface';
export type { ISpot } from '@features/places/types/spot.interface';
export type { IEvent } from '@features/places/types/event.interface';

export type { IGroup } from '@features/groups/types/group.interface';
export type { IMessage } from '@features/groups/types/message.interface';

export type { ScoredPlace, RecommendationOptions } from '@core/services/recom-engine/types';

export type { IUser } from '@features/auth/types/user';
export type { Role } from '@features/auth/types/role';

export type { IMeeting } from '@features/meetings/types/meeting.interface';
