import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as express from 'express';

import * as functions from 'firebase-functions';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const expressServer = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressServer),
    {
      logger:
        process.env.NODE_ENV === 'production'
          ? ['error', 'warn']
          : ['log', 'debug', 'error', 'verbose', 'fatal', 'warn'],
    },
  );
  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(3000);
  return expressServer;
}

exports.api = functions.https.onRequest(async (req, res) => {
  const expressServer = await bootstrap();
  expressServer(req, res);
});

bootstrap();
