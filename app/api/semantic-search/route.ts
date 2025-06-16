import { NextRequest } from 'next/server';
import { OpenAI } from 'openai';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import * as schema from '@/drizzle/schema';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function generateEmbedding(text: string) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return res.data[0].embedding;
}

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json();
    if (!userInput) return new Response('Missing input.', { status: 400 });

    const embedding = await generateEmbedding(userInput);

    const results = await db.execute(
      sql`
        SELECT content
        FROM messages
        ORDER BY embedding <-> ${embedding}
        LIMIT 5;
      `
    );

    const topMatches = results.rows.map((row: any) => row.content);

    return Response.json({ matches: topMatches });
  } catch (err) {
    console.error('Error in semantic search:', err);
    return new Response('Internal server error', { status: 500 });
  }
}
