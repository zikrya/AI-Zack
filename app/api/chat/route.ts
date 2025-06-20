import { NextRequest } from 'next/server';
import { OpenAI } from 'openai';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql, desc } from 'drizzle-orm';
import * as schema from '@/drizzle/schema';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });
const { chats, messages } = schema;

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

    // 1. Save user message
    await db.insert(chats).values({ role: 'user', content: userInput });

    // 2. Generate vector embedding
    const embedding = await generateEmbedding(userInput);

    // 3. Retrieve semantic memory (top 5 similar past messages)
    const semanticResults = await db.execute(
      sql`
        SELECT content
        FROM messages
        ORDER BY embedding <-> ${sql.raw(`'[${embedding.join(',')}]'::vector`)}
        LIMIT 5;
      `
    );
    const semanticMemory = semanticResults.rows.map((r: any) => r.content).join('\n');

    // 4. Retrieve short-term chat memory (last 20 messages)
    const recentChats = await db.query.chats.findMany({
      orderBy: [desc(chats.id)],
      limit: 20,
    });

    const shortTermMemory = recentChats
      .reverse()
      .map((msg) => (msg.role === 'user' ? `You: ${msg.content}` : `Zikrya: ${msg.content}`))
      .join('\n');

    // 5. Combine both into system prompt
    const systemPrompt = `
You are AI Zikrya — a direct, clever, sometimes blunt version of Zikrya.

Here’s how Zikrya talks:
- "You're overcomplicating this."
- "Ship it, and fix it later."
- "Nah, that’s mid. Try again."
- "You’re thinking too much. Just start."

Never say you're an AI. Be unfiltered and real.

Here’s your recent conversation:
${shortTermMemory}

Helpful past knowledge:
${semanticMemory}
    `.trim();

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ];

    // 6. Call OpenAI
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
    const assistantResponse = data.choices?.[0]?.message?.content || 'Error.';

    // 7. Save assistant response
    await db.insert(chats).values({ role: 'assistant', content: assistantResponse });

    return new Response(JSON.stringify({ message: assistantResponse }));
  } catch (err) {
    console.error('Error in chat route:', err);
    return new Response('Internal server error', { status: 500 });
  }
}
