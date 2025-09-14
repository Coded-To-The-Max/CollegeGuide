import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Method not allowed' });
  }

  try {
    const body = req.body;
    console.log('[API] Request received:', body);

    if (!body?.message) {
      return res.status(400).json({ reply: 'No message provided' });
    }

    // Build conversation history
    const history = (body.conversation || []).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));

    history.push({ role: 'user', content: body.message });

    // Category-specific system prompt
    const systemPrompt =
      body.category === '2'
        ? 'You are a helpful admissions assistant specializing in personal statements.'
        : 'You are a helpful admissions assistant.';

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_KEY, // <- must be set in Vercel dashboard
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...history],
      max_tokens: 300,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I couldn't process your message.";

    console.log('[API] Reply sent:', reply);

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('[API] Error:', error);
    return res.status(500).json({ reply: 'Error processing message' });
  }
}
