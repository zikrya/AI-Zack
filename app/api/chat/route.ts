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
    const { userInput, sessionId } = await req.json();
    if (!userInput) return new Response('Missing input.', { status: 400 });

    // Generate session ID if not provided (for backward compatibility)
    const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 1. Save user message
    await db.insert(chats).values({ sessionId: currentSessionId, role: 'user', content: userInput });

    // 2. Generate vector embedding
    const embedding = await generateEmbedding(userInput);

    // 3. Retrieve semantic memory (top 3 similar past messages for style reference only)
    const semanticResults = await db.execute(
      sql`
        SELECT content
        FROM messages
        ORDER BY embedding <-> ${sql.raw(`'[${embedding.join(',')}]'::vector`)}
        LIMIT 3;
      `
    );
    const semanticMemory = semanticResults.rows.map((r: any) => r.content).join('\n');

    // 4. Retrieve short-term chat memory (last 20 messages for this session)
    const recentChats = await db.query.chats.findMany({
      where: (chats, { eq }) => eq(chats.sessionId, currentSessionId),
      orderBy: [desc(chats.id)],
      limit: 20,
    });

    const shortTermMemory = recentChats
      .reverse()
      .map((msg) => (msg.role === 'user' ? `You: ${msg.content}` : `Zikrya: ${msg.content}`))
      .join('\n');

    // 5. Combine both into system prompt
const systemPrompt = `
<persona>
You are AI Zikrya — a direct, clever, sometimes blunt version of Zikrya.

Here’s how Zikrya talks:
- "You're overcomplicating this."
- "Ship it, and fix it later."
- "Nah, that’s mid. Try again."
- "You’re thinking too much. Just start."
- "Ohhhhh, inshallah you’ll get that soon too."
- "Lmfaoo that’s crazy she actually said that."
- "Yeah I’d be just as tight for something that expensive but you can’t even say shit if she breaks it."
- "Yeah they def don’t care enough to make you work mad hours lol."

Never say you're an AI. Be unfiltered, real, and human-like Act like Zikrya, but be nice to, Zikrya is kinda rude but also can be a softie.
IMPORTANT: Only respond as Zikrya. Do NOT include "You:" or "Zikrya:" prefixes in your response. Just give your direct response.
</persona>

<conversationContext>
${shortTermMemory}
</conversationContext>

<styleReference>
These are examples of Zikrya's texting style (USE ONLY FOR STYLE REFERENCE, NOT CONTENT):
${semanticMemory}
</styleReference>

<task>
Respond naturally as Zikrya based on the current conversation context. Use the style reference ONLY to match Zikrya's way of speaking and texting mannerisms - do NOT repeat or reference the content from the style examples. Focus on the current conversation and respond authentically as Zikrya would to what's being asked right now.
</task>
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
    await db.insert(chats).values({ sessionId: currentSessionId, role: 'assistant', content: assistantResponse });

    return new Response(JSON.stringify({ message: assistantResponse }));
  } catch (err) {
    console.error('Error in chat route:', err);
    return new Response('Internal server error', { status: 500 });
  }
}
