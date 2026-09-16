declare global {
  namespace Express {
    interface User {
      userId: number;
      email: string;
      role: string;
    }
  }
}

export {};