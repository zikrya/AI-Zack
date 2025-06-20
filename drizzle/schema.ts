import { pgTable, serial, text, vector, timestamp } from 'drizzle-orm/pg-core';

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }).notNull(),
});

export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  role: text('role').notNull(), 
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});