require('./_env')
import { log } from './logger'
import { initServer, stopServer } from './webserver'
import Graceful from 'node-graceful';

Graceful.captureExceptions = true;
Graceful.captureRejections = true;
Graceful.on('exit', async () => {
  await stopServer()
});

function verifyEnv() {
  ['IP_GEOLOCATION_KEY', 'PORT'].forEach((envVar) => {
    if (!process.env[envVar]) {
      log(`Fatal Error! Missing environment variable ${envVar}`)
      process.exit(1)
    } 
  })
}

async function run() {
  log('Starting service')
  verifyEnv()
  await initServer()
}

run()