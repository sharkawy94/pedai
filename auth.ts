import NextAuth from 'next-auth';
import { authOptions } from './app/api/auth/[...nextauth]/auth';

const { auth, handlers } = NextAuth(authOptions);

export { auth };
export const authHandler = handlers;
