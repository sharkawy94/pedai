import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  password: text('password')
});

export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  userId: serial('userId').references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: serial('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 })
});

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: serial('userId').references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: varchar('sessionToken', { length: 255 }).notNull().unique(),
  expires: timestamp('expires', { mode: 'date' }).notNull()
});

export const verificationTokens = pgTable('verificationTokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expires: timestamp('expires', { mode: 'date' }).notNull()
});
