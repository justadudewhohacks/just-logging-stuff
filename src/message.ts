export enum MessageCode {
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARN = 'WARN'
}

export interface IMessage {
  app: string
  createdAt: Date
  message: string
  code: MessageCode
}

function makeMessageConstructor(code: MessageCode) {
  return function(app: string, message: string) : IMessage {
    return ({
      app,
      message,
      createdAt: new Date(),
      code
    })
  }
}

export const InfoMessage = makeMessageConstructor(MessageCode.INFO)
export const WarningMessage = makeMessageConstructor(MessageCode.WARN)
export const ErrorMessage = makeMessageConstructor(MessageCode.ERROR)
