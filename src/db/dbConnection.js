import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;
dotenv.config();

const client = new Client({
  connectionString: process.env.DB_CONNECTION_STRING,
});

await client.connect();

export const db = drizzle(client);
