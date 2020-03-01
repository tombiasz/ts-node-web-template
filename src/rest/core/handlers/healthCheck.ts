import { Request, Response } from 'express';
import { HttpError } from '../../shared/httpErrors';

export function createHealthCheckHandler(isHealthy: () => boolean) {
  return (req: Request, res: Response) => {
    if (isHealthy()) {
      return res.json({ message: 'ok' })
    }

    const error = HttpError.serviceUnavailable()
    res.status(error.status).end();
  }
}
