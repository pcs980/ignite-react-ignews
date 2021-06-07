import { Client, query } from 'faunadb';

export const fauna = new Client({
  secret: process.env.FAUNADB_KEY,
});

export const q = query;
