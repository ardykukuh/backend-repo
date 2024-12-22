import * as admin from 'firebase-admin';

// Declare module to extend Express' Request type
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}
