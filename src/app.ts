import * as express from 'express';
import * as bodyParser from 'body-parser';
import { connect } from 'mongoose'
import { InfoMessage, IMessage, WarningMessage, ErrorMessage } from './message';
import { middleware } from './middleware';
import { makeMessageModel } from './message_model';

const port = process.env.PORT || 3000

function handleRoute(MessageConstructor: (a: string, m: string) => IMessage) {
  return async function(_: any, res: any) {
    const { appName, message } = res.locals.message
    try {
      await makeMessageModel(appName)
        .create(MessageConstructor(appName, message))
    } catch (err) {
      console.error('error saving InfoMessage:')
      console.error(err)
    }
  }
}

async function start() {
  await connect(`mongodb://${process.env.MLAB_USER}:${process.env.MLAB_PW}@${process.env.MLAB_ADDRESS}`)

  const server = express()
  server.use(bodyParser.json())
  server.use(middleware)

  server.post('/info', handleRoute(InfoMessage))
  server.post('/warn', handleRoute(WarningMessage))
  server.post('/error', handleRoute(ErrorMessage))

  server.listen(port, (err: any) => {
    if (err) throw err
    console.log(`listening on port ${port}`)
  })
}

start()