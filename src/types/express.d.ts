declare global {
  namespace Express {
    interface Request {
      user?: import('./userTypes').UserData;
    }
  }
}