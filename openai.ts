import type { RequestHandler } from 'vite';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_AI_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    console.log('[API] Request received:', body);

    if (!body?.message) {
      return new Response(JSON.stringify({ reply: 'No message provided' }), { status: 400 });
    }

    // Build conversation history
    const history = (body.conversation || []).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content
    }));

    // Add current message at the end
    history.push({ role: 'user', content: body.message });

    // Category-specific system prompt
    const systemPrompt =
      body.category === '2'
        ? 'You are a helpful admissions assistant specializing in personal statements.'
        : 'You are a helpful admissions assistant.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history
      ],
      max_tokens: 300
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I couldn't process your message.";

    console.log('[API] Reply sent:', reply);

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[API] Error:', error);
    return new Response(JSON.stringify({ reply: 'Error processing message' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
};
