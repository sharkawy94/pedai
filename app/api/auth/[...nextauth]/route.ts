import NextAuth from 'next-auth';
import { authOptions } from './auth';

const { auth, handlers } = NextAuth(authOptions);

export { auth };
export const authHandler = handlers;
