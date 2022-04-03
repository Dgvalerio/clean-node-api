import { Controller, HttpRequest } from '@/presentation/protocols';

import { Request, Response } from 'express';

export const adaptRoute =
  (controller: Controller) => async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = { body: req.body };

    const httpResponse = await controller.handle(httpRequest);

    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
