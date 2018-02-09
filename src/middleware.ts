const registeredApps = (process.env.APPS || '')
  .split(';')
  .map(n => n.trim())

function extractSharedToken(token: string): string {
  return token.split('_')[0] || ''
}

function extractAppName(token: string): string {
  return token.split('_')[1] || ''
}

function getAppName(token: string): string {
  const appName = extractAppName(token)
  return registeredApps.find(a => a === appName)
}

export function middleware (req: any, res: any, next: () => void) {
  const token = req.body.token || ''
  const message = req.body.message || ''

  if (extractSharedToken(token) !== process.env.TOKEN) {
    console.log('incoming request with invalid token')
    return res.status(404).send('invalid token')
  }

  const appName = getAppName(token)
  if (!appName) {
    console.log('incoming request with unkown app:', extractAppName(token))
    return res.status(404).send('unkown app')
  }

  if (!message) {
    console.log('incoming request without message from app:', appName)
    return res.status(404).send('message required')
  }

  res.status(202).send()

  res.locals.message = { appName, message }
  next()
}