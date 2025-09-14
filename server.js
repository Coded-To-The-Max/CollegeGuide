import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// OpenAI API route
app.post('/api/openai', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: 'No message provided' });

    console.log('Received message:', message);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', 
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

// Serve Vite build (dist folder)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA fallback for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
});

// Dynamic port for Heroku
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
