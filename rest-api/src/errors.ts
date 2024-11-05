export interface IReqError {
  message: string;
  details?: string;
}

export const ServerError = {
  message: "Errore del server, riprova piu tardi...",
} as IReqError;

export const NotFoundError = {
  message: "Spiacenti non e' stata trovata la risorsa che cercavate...",
} as IReqError;

export const UnauthorizedError = {
  message: "Non sei autorizzato a eseguire questa azione.",
} as IReqError;

export const InvalidPayloadError = {
  message: "La tua richiesta non e' valida, i parametri sono errati.",
} as IReqError;

export const createCustomError = (
  message: string,
  details?: string
): IReqError => ({
  message,
  details,
});

export const createErrorWithDetails = (
  error: IReqError,
  details: string
): IReqError => ({
  message: error.message,
  details,
});
