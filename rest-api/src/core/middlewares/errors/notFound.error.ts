import { CustomError } from './custom.error';

export class NotFoundError extends CustomError {
  constructor(message: any, feedback?: string) {
    super(message);
    this.name = 'Not Found Error';
    this.status = 404;
    this.cause = message;
    this.feedback = feedback ?? '';
  }
}
