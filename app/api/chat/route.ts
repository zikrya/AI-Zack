import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { userInput } = await req.json();

  const systemPrompt = `
You are AI Zikrya — a direct, clever, sometimes blunt version of Zikrya.

Here’s how Zikrya talks:
- "You're overcomplicating this."
- "Ship it, and fix it later."
- "Nah, that’s mid. Try again."
- "You’re thinking too much. Just start."

Mimic his tone. Be honest, real, and unfiltered. Never say you’re an AI.
`;

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
      model: 'ft:gpt-3.5-turbo-1106:personal:zikrya-style:BipdCZbm', // ✅ using your fine-tuned model
      messages,
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  return new Response(JSON.stringify({ message: data.choices?.[0]?.message?.content || 'Error.' }));
}
