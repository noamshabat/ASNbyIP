import express, { Request, Response, Express, NextFunction } from 'express'
import { Server } from 'http'
import { log } from './logger'
import { ip2region } from './ipGeoApi'

let server:Server

// setup app routes
function initRoutes(app:Express) {
  app.get('/test', (req:Request, res: Response) => {
    res.sendStatus(200)
  })

  app.get('/shutdown', (req:Request, res: Response) => {
    res.status(200).send('Shutting down')
    stopServer()
  })

  app.get('/getip', async (req:Request, res:Response, next:NextFunction) => {
    try {
      const ip:string = req.query.ip as string
      const region = await ip2region(ip)
      res.status(200).send(region)
    } catch(err) {
      next(err)
    }
  })

  app.get('*', function(req, res){
    res.status(404).send('unknown route')
  });
}

async function errorMiddleware(err:any, req:Request, res:Response, next:NextFunction) {
	if (err.serviceException) {
		res.status(err.code).send(err.message)
	} else {
		const msg = JSON.stringify(err)
		res.status(500).send(msg)
	}
}

export function initServer() {
  const app = express()
	const port = process.env.PORT

  app.use(express.json())

	initRoutes(app)

	app.use(errorMiddleware)

	return new Promise<void>((resolve) => {
		server = app.listen(port, () => {
			log(`Express listening at http://localhost:${port}`)
			resolve()
		})
	})
}

export async function stopServer() {
  log('Web server shutting down')
	if (server) {
		await new Promise((res) => {
      try {
        server!.close(res)
      } catch(err) {
        log('Error while shutting down', err)
        process.exit(1)
      }
		})
	}
}