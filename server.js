import express from 'express';
import cors from 'cors';
import GigaChat from 'gigachat';
import { Agent } from 'node:https';
import fs from 'fs';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const httpsAgent = new Agent({
  rejectUnauthorized: false,
});

const client = new GigaChat({
  timeout: 600,
  model: 'GigaChat-2',
  credentials: process.env.GIGACHAT_AUTH_KEY,
  scope: 'GIGACHAT_API_PERS',
  httpsAgent,
});

let knowledgeBase = "";
try {
  knowledgeBase = fs.readFileSync('FAQ.txt', 'utf-8');
} catch (e) {
  console.log("Внимание: файл FAQ.txt не найден!");
}

const chunks = knowledgeBase.split('\n\n').filter(c => c.trim().length > 0);

app.post('/api/chat', async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ answer: 'Не понял вопрос. Попробуйте переформулировать.' });
  }

  const questionWords = question.toLowerCase().split(' ');
  let bestChunk = "";
  let maxMatches = 0;

  chunks.forEach(chunk => {
    const chunkLower = chunk.toLowerCase();
    let matches = 0;
    questionWords.forEach(word => {
      if (word.length > 3 && chunkLower.includes(word)) matches++;
    });
    if (matches > maxMatches) {
      maxMatches = matches;
      bestChunk = chunk;
    }
  });

  const context = bestChunk || "Информация не найдена в базе знаний.";

  try {
    const completion = await client.chat({
      messages: [
        {
          role: 'system',
          content: `Ты — помощник студента. Отвечай на вопрос, используя ТОЛЬКО этот контекст: "${context}". Если ответа нет в контексте, вежливо скажи, что не знаешь. Отвечай кратко и по делу.`
        },
        { role: 'user', content: question }
      ],
      temperature: 0.3,
    });

    res.json({ answer: completion.choices[0]?.message.content || 'Не удалось получить ответ.' });
  } catch (error) {
    console.error('GigaChat API Error:', error);
    res.status(500).json({ error: 'Ошибка при запросе к GigaChat' });
  }
});

app.listen(3001, () => console.log('Сервер запущен на порту 3001'));
