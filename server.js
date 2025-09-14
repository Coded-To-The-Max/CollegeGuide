import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Confirm API key is loaded
if (!process.env.VITE_AI_API_KEY) {
  console.error('Error: OpenAI API key is missing. Check your .env file.');
  process.exit(1);
}

console.log('OpenAI API Key loaded.');

const openai = new OpenAI({ apiKey: process.env.VITE_AI_API_KEY });

app.post('/api/openai', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: 'No message provided' });

    console.log('Received message:', message);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use a model your account definitely supports
      messages: [
        { role: 'system', content: 'You are a helpful admissions assistant.' },
        { role: 'user', content: message },
      ],
      max_tokens: 200,
    });

    const reply = completion.choices?.[0]?.message?.content || "Sorry, I couldn't process your message.";
    console.log('Reply from OpenAI:', reply);

    res.json({ reply });
  } catch (err) {
    console.error('OpenAI request failed:', err);
    res.status(500).json({ reply: 'Error processing message', error: err.message });
  }
});

const port = 5174;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
