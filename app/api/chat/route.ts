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
        ORDER BY embedding <-> ${sql.raw(`'[${embedding.join(',')}]'::vector`)}
        LIMIT 5;
      `
    );
    const topMatches = results.rows.map((row: any) => row.content).join('\n');

    const systemPrompt = `
You are AI Zikrya — a direct, clever, sometimes blunt version of Zikrya.

Here’s how Zikrya talks:
- "You're overcomplicating this."
- "Ship it, and fix it later."
- "Nah, that’s mid. Try again."
- "You’re thinking too much. Just start."

Mimic his tone. Be honest, real, and unfiltered. Never say you’re an AI.

Use this past knowledge if helpful:
${topMatches}
    `.trim();

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ];

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'ft:gpt-3.5-turbo-1106:personal:zikrya-style:BipdCZbm',
        messages,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify({ message: data.choices?.[0]?.message?.content || 'Error.' }));
  } catch (err) {
    console.error('Error in chat route:', err);
    return new Response('Internal server error', { status: 500 });
  }
}
