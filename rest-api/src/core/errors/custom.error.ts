export class CustomError extends Error {
  public status?: number;
  public cause: any;
  public feedback: string;

  /**
   * Custom Error Constructor
   * @param message - Optional error payload
   * @param statusCode - Optional HTTP status code
   * @param feedback - Optional feedback message
   */
  constructor(message: any, statusCode?: number, feedback: string = '') {
    super(message);
    this.name = 'CustomError';
    this.status = statusCode;
    this.cause = message;
    this.feedback = feedback;
  }
}
