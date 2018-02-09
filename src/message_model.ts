import { Document, Schema, Model, model } from 'mongoose';
import { IMessage } from './message';

export interface IMessageModel extends IMessage, Document {}

export const MessageSchema: Schema = new Schema({
  app: String,
  createdAt: Date,
  message: String,
  code: { type: String, enum: ['INFO', 'ERROR', 'WARN'] }
})

function getCollectionName(appName: string) : string {
  return `${appName}_message`
}

export function makeMessageModel(appName: string) {
  const MessageModel: Model<IMessageModel> = model<IMessageModel>(getCollectionName(appName), MessageSchema)

  async function create(message: IMessage) {
    return new MessageModel(message).save()
  }

  return {
    create
  }
}