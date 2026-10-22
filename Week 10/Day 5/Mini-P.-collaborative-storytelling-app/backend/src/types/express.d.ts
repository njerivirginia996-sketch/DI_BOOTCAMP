import type { User } from '@story-app/types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
