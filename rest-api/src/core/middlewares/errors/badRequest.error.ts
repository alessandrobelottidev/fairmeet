import { CustomError } from './custom.error';

export class BadRequestError extends CustomError {
  constructor(message: any, feedback?: string) {
    super(message);
    this.name = 'Bad Request';
    this.status = 400;
    this.cause = message;
    this.feedback = feedback ?? '';
  }
}
