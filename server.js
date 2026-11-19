import express from 'express';
import cors from 'cors';
import { Agent } from 'node:https';
import fs from 'fs';
import 'dotenv/config';
import { GigaChat } from 'langchain-gigachat';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/huggingface_transformers';
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

const app = express();
app.use(cors());
app.use(express.json());

const httpsAgent = new Agent({
  rejectUnauthorized: false,
});

const credentials = process.env.GIGACHAT_AUTH_KEY;

const llm = new GigaChat({
  credentials: credentials,
  model: 'GigaChat-2',
  scope: 'GIGACHAT_API_PERS',
  httpsAgent,
  temperature: 0.3,
});

const embeddings = new HuggingFaceTransformersEmbeddings({
  model: 'Xenova/all-MiniLM-L6-v2',
});

let vectorStore = null;

async function initRAG() {
  try {
    const knowledgeBase = fs.readFileSync('FAQ.txt', 'utf-8');
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 100,
    });
    const chunks = await splitter.createDocuments([knowledgeBase]);
    
    console.log(`Создано ${chunks.length} чанков. Построение индекса (локальная модель HuggingFace)...`);
    vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);
    console.log('RAG индекс успешно построен.');
  } catch (e) {
    console.error('Ошибка при инициализации RAG:', e);
  }
}

initRAG();

app.post('/api/chat', async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ answer: 'Не понял вопрос. Попробуйте переформулировать.' });
  }

  if (!vectorStore) {
    return res.status(503).json({ answer: 'База знаний еще загружается. Попробуйте через минуту.' });
  }

  try {
    const relevantDocs = await vectorStore.similaritySearch(question, 3);
    const context = relevantDocs.map(doc => doc.pageContent).join('\n\n---\n\n');

    const completion = await llm.invoke([
      {
        role: 'system',
        content: `Ты — помощник студента. Отвечай на вопрос, используя ТОЛЬКО этот контекст:\n\n${context}\n\nЕсли ответа нет в контексте, вежливо скажи, что не знаешь. Отвечай кратко и по делу.`
      },
      { role: 'user', content: question }
    ]);

    res.json({ answer: completion.content || 'Не удалось получить ответ.' });
  } catch (error) {
    console.error('GigaChat API Error:', error);
    res.status(500).json({ answer: 'Ошибка при запросе к GigaChat. Проверьте подключение.' });
  }
});

app.listen(3001, () => console.log('Сервер запущен на порту 3001'));
