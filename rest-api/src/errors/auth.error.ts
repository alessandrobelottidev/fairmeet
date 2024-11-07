import { CustomError } from './custom.error';

interface AuthParams {
  realm?: string;
  [key: string]: any;
}

export class AuthError extends CustomError {
  public authorizationError: boolean = true;
  public authParams: AuthParams;
  public authHeaders: Record<string, string>;

  /**
   * Authorization Error Constructor
   * @param message - Error payload
   * @param statusCode - Status code. Defaults to `401`
   * @param feedback - Feedback message
   * @param authParams - Authorization Parameters to set in `WWW-Authenticate` header
   */
  constructor(
    message: any,
    statusCode: number = 401,
    feedback: string = '',
    authParams: AuthParams = {},
  ) {
    super(message, statusCode, feedback);
    this.authParams = authParams;
    this.authHeaders = {
      'WWW-Authenticate': `Bearer ${this.stringifyAuthParams()}`,
    };
  }

  /**
   * Private Method to convert object `key: value` to string `key=value`
   */
  private stringifyAuthParams(): string {
    let str = '';
    let { realm, ...others } = this.authParams;
    realm = realm || 'apps';

    str = `realm=${realm}`;
    const otherParams = Object.keys(others);
    if (otherParams.length < 1) return str;

    otherParams.forEach((authParam, index, array) => {
      if (authParam.toLowerCase() === 'realm') {
        delete others[authParam];
      }

      let comma = index === array.length - 1 ? '' : ',';
      str += ` ${authParam}=${others[authParam]}${comma}`;
    });

    return str;
  }
}
