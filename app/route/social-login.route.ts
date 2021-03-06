import Router from 'express-promise-router';
import { Request, Response } from 'express';
import { SocialLoginController } from '../controller/social-login.controller';
import { Context } from '../interface/context.interface';

const subRoutes = {
  root: '/',
  loginUrl: '/login-url',
  login: '/login',
  loginWithAccessToken: '/login-with-access-token',
};

export const publicRoutes = [
  subRoutes.loginUrl,
  subRoutes.login,
  subRoutes.loginWithAccessToken,
];

export const router = Router();

const socialLoginController = new SocialLoginController();

router.post(subRoutes.loginUrl, async (req: Request, res: Response) => {
  const context = res.locals.ctx as Context;
  const response = await socialLoginController.loginUrl(
    context.postgresql_provider,
    req.body
  );
  res.status(200).json({ loginUrl: response });
});

router.post(subRoutes.login, async (req: Request, res: Response) => {
  const context = res.locals.ctx as Context;
  const response = await socialLoginController.login(
    context.postgresql_provider,
    req.body
  );
  res.status(200).json(response);
});

router.post(
  subRoutes.loginWithAccessToken,
  async (req: Request, res: Response) => {
    const context = res.locals.ctx as Context;
    const response = await socialLoginController.loginWithAccessToken(
      context.postgresql_provider,
      req.body
    );
    res.status(200).json(response);
  }
);
