import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Confirm API key is loaded
if (!process.env.OPENAI_KEY) {
  console.error('Error: OpenAI API key is missing. Check your Heroku config vars.');
  process.exit(1);
}
console.log('OpenAI API Key loaded.');

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

// OpenAI route
app.post('/api/openai', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: 'No message provided' });

    console.log('Received message:', message);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful admissions assistant.' },
        { role: 'user', content: message }
      ],
      max_tokens: 200
    });

    const reply = completion.choices?.[0]?.message?.content || "Sorry, I couldn't process your message.";
    console.log('Reply from OpenAI:', reply);

    res.json({ reply });
  } catch (err) {
    console.error('OpenAI request failed:', err);
    res.status(500).json({ reply: 'Error processing message', error: err.message });
  }
});

// Serve Vite frontend
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
