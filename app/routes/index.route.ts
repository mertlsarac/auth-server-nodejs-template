import authRouter from './auth.route';
import socialLoginRouter from './social-login.route';
import infoRouter from './info.route';
import { handle } from '../services/error-handler.service';
import { Request, Response } from 'express';
import { PostgreSqlProvider } from '../providers/postgresql.provider';
import { EncryptionService } from '../services/encryption.service';

export module Routes {
 export function mount(app) {
  const postgreSqlProvider = new PostgreSqlProvider();

  postgreSqlProvider.preload().then(() => console.log('PostgreSQL preload completed.'));

  const responseInterceptor = (req, res, next) => {
   var originalSend = res.send;
   const service = new EncryptionService();
   res.send = function () {
    console.log('Starting Encryption: ', new Date());
    let encrypted_arguments = service.encrypt(arguments);
    console.log('Encryption Completed: ', new Date());

    originalSend.apply(res, encrypted_arguments);
   };

   next();
  }

  // use this interceptor before routes
  app.use(responseInterceptor);

  // INFO: Keep this method at top at all times
  app.all('/*', async (req: Request, res: Response, next) => {
   try {
    // create context
    let dbProviders = {
     postgreSqlProvider: postgreSqlProvider
    }
    res.locals.ctx = {dbProviders};

    next();
   } catch (e) {
    let error = handle(e);
    res.status(error.code).json({message: error.message});
   }
  });

  // TODO: Add your routes here
  app.use('/auth', authRouter);
  app.use('/social', socialLoginRouter);
  app.use('/info', infoRouter);

  // Use for error handling
  app.use(function (err, req, res, next) {
   let error = handle(err);
   console.log(err);
   res.status(error.code).json({message: error.message});
  });
 }
}